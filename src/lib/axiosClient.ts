// lib/axiosClient.ts
'use client'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';
import { refreshingAccessToken } from '../../actions/refreshAccessToken'

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  withCredentials: true,
})

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

function addRefreshedSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

axiosClient.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') return config

  try {
    const AccessToken = localStorage.getItem('AccessToken')

    if (!AccessToken) return config

    const decoded: { exp?: number } = jwtDecode(AccessToken)
    const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : true

    if (isExpired) {
      const retryOriginalRequest = new Promise<void>((resolve) => {
        addRefreshedSubscriber((token: string) => {
          config.headers.Authorization = `Bearer ${token}`
          resolve()
        })
      })

      if (!isRefreshing) {
        isRefreshing = true
        try {
          const newAccessToken = await refreshingAccessToken()
          if (newAccessToken) {
            localStorage.setItem('AccessToken', newAccessToken)
            onRefreshed(newAccessToken)
          } else {
            localStorage.removeItem('AccessToken')
          }
        } catch (err) {
          localStorage.removeItem('AccessToken')
          throw err
        } finally {
          isRefreshing = false
        }
      }

      await retryOriginalRequest
      return config
    }

    config.headers.Authorization = `Bearer ${AccessToken}`
  } catch (err) {
    console.log('Failed to attach access token:', err)
    localStorage.removeItem('AccessToken')
    return Promise.reject(err)
  }

  config.headers['Content-Type'] = 'application/json'
  config.headers['Accept'] = 'application/json'

  return config
}, (error) => Promise.reject(error))

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('AccessToken')
    }
    return Promise.reject(err)
  }
)

export default axiosClient
