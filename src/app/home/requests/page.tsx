"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X } from "lucide-react"

import { getFriendRequests } from "../../../../actions/features/friendRequest/getFriendRequest"
import {
  acceptFriendRequest,
  declineFriendRequest,
} from "../../../../actions/features/friendRequest/reactToFriendRequest"

type FriendRequest = {
  id: string
  status: "pending" | "accepted" | "declined"
  userId: string
  email: string
  username: string
  avatar_url?: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getFriendRequests()
        setRequests(
          res.map((r: any) => ({
            id: r.id,
            status: r.status,
            userId: r.from_user.id,
            email: r.from_user.email,
            username: r.from_user.username,
            avatar_url: r.from_user.avatar_url,
          }))
        )
      } catch (err) {
        console.error("Failed to fetch requests:", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleAccept = async (from_user: string, requestId: string) => {
    const res = await acceptFriendRequest(from_user, requestId)
    if (res.success) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "accepted" } : r
        )
      )
    } else {
      console.error("Accept failed:", res.message)
    }
  }

  const handleDecline = async (from_user: string, requestId: string) => {
    const res = await declineFriendRequest(from_user, requestId)
    if (res.success) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "declined" } : r
        )
      )
    } else {
      console.error("Decline failed:", res.message)
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Loading requests...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No friend requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={request.avatar_url || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {request.username
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{request.username}</h3>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {request.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleAccept(request.userId, request.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleDecline(request.userId, request.id)}
                        size="sm"
                        variant="outline"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}
                  {request.status === "accepted" && (
                    <span className="text-green-600 font-semibold">Accepted</span>
                  )}
                  {request.status === "declined" && (
                    <span className="text-red-600 font-semibold">Declined</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
