"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X } from "lucide-react"

const mockRequests = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 3,
  },
  {
    id: 2,
    name: "Bob Wilson",
    email: "bob@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 1,
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    mutualFriends: 5,
  },
]

export default function RequestsPage() {
  const [requests, setRequests] = useState(mockRequests)

  const handleApprove = (id: number) => {
    setRequests(requests.filter((req) => req.id !== id))
    // Here you would typically make an API call to approve the request
  }

  const handleReject = (id: number) => {
    setRequests(requests.filter((req) => req.id !== id))
    // Here you would typically make an API call to reject the request
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No pending friend requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={request.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {request.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{request.name}</h3>
                      <p className="text-sm text-muted-foreground">{request.email}</p>
                      <p className="text-xs text-muted-foreground">{request.mutualFriends} mutual friends</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
