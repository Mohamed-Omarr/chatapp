"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X } from "lucide-react"

const mockPendingRequests = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    sentAt: "2 days ago",
  },
  {
    id: 2,
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    sentAt: "1 week ago",
  },
  {
    id: 3,
    name: "Michael Green",
    email: "michael.green@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    sentAt: "3 days ago",
  },
]

export default function PendingRequestsPage() {
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests)

  const handleCancelRequest = (id: number) => {
    setPendingRequests(pendingRequests.filter((req) => req.id !== id))
    // Here you would typically make an API call to cancel the request
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Friend Requests</h1>

      {pendingRequests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No outgoing friend requests pending.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
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
                      <p className="text-xs text-muted-foreground">Sent {request.sentAt}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleCancelRequest(request.id)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
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
