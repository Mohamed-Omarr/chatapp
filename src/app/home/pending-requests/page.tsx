"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { getSentFriendRequests } from "../../../../actions/features/friendRequest/getSentRequest";
import { cancelFriendRequest } from "../../../../actions/features/friendRequest/cancelFriendRequest";

type SentRequest = {
  id: number;
  status: "pending" | "accepted" | "declined";
  to_user: {
    id: string;
    username: string | null;
    email: string;
    avatar_url: string | null;
  };
};

export default function PendingRequestsPage() {
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      const requests = await getSentFriendRequests();
      setSentRequests(requests);
      setLoading(false);
    }
    fetchRequests();
  }, []);

  const handleCancelRequest = async (id: number) => {
    const res = await cancelFriendRequest(id);
    if (res.success) {
      setSentRequests(sentRequests.filter((req) => req.id !== id));
    } else {
      console.error(res.error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading sent requests...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sent Friend Requests</h1>

      {sentRequests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No outgoing friend requests.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sentRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={request.to_user.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {request.to_user.username
                        ? request.to_user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{request.to_user.username || "Unknown"}</h3>
                    <p className="text-sm text-muted-foreground">{request.to_user.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {request.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelRequest(request.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
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
  );
}
