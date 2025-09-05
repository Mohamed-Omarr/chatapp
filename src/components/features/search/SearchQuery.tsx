"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { UserPlus } from "lucide-react"
import { useUser } from "@/hooks/UserContext"
import { supabaseClient } from "@/lib/supabaseHooks/supabaseClient"
import { sendFriendRequest } from "../../../../actions/features/friendRequest/sendFriendRequest"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface SearchParams {
  query: string
  limit?: number
}

interface User {
  id: string
  username: string
  avatar?: string
}

const supabase = supabaseClient

const searchNonFriends = async (
  params: SearchParams,
  currentUserId: string
): Promise<User[]> => {
  const { query, limit = 4 } = params

  try {
    // 1. find friend requests involving current user
    const { data: requests, error: reqError } = await supabase
      .from("friend_requests")
      .select("from_user, to_user")
      .or(`from_user.eq."${currentUserId}",to_user.eq."${currentUserId}"`)


    if (reqError) throw reqError

    // 2. collect excluded ids
    const excludedIds = new Set<string>()
    requests?.forEach((r) => {
      if (r.from_user !== currentUserId) excludedIds.add(r.from_user)
      if (r.to_user !== currentUserId) excludedIds.add(r.to_user)
    })

    // 3. search profiles
    let supabaseQuery = supabase
      .from("profiles")
      .select("id, username")
      .ilike("username", `%${query}%`)
      .limit(limit)
      .neq("id", currentUserId)

    if (excludedIds.size > 0) {
      supabaseQuery = supabaseQuery.not("id", "in", [...excludedIds])
    }

    const { data: users, error } = await supabaseQuery
    if (error) throw error

    return (users || []).map((user) => ({
      id: user.id,
      username: user.username,
    }))
  } catch (error) {
    console.error("Search error:", error)
    return []
  }
}


function SearchQuery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [addingFriend, setAddingFriend] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const { user } = useUser()

  const currentUserId = useMemo(() => user?.id ?? "", [user?.id])

  const handleAddFriend = useCallback(
    async (personId: string) => {
      setAddingFriend(personId)

      try {
        await sendFriendRequest(personId) // ✅ now uses server action

        setSearchResults((prev) =>
          prev.filter((person) => person.id !== personId)
        )
      } catch (error) {
        console.error("Error sending friend request:", error)
      } finally {
        setAddingFriend(null)
      }
    },
    []
  )

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        const results = await searchNonFriends(
          { query: searchQuery, limit: 5 },
          currentUserId
        )
        setSearchResults(results)
        setIsSearching(false)
      } else {
        setSearchResults([])
      }
    }

    const timeoutId = setTimeout(performSearch, 300) // debounce
    return () => clearTimeout(timeoutId)
  }, [searchQuery, currentUserId])

  return (
    <div>
      <Input
        placeholder="Search people to add..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 p-3">
          <p className="text-sm text-muted-foreground">Searching...</p>
        </div>
      )}

      {searchResults.length > 0 && !isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {searchResults.map((person) => (
            <div
              key={person.id}
              className="flex items-center gap-3 p-3 hover:bg-muted/50 border-b last:border-b-0"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={person.avatar} alt={person.username} />
                <AvatarFallback>
                  {person.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {person.username}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddFriend(person.id)}
                disabled={addingFriend === person.id}
                className="shrink-0"
              >
                <UserPlus className="h-3 w-3 mr-1" />
                {addingFriend === person.id ? "Adding..." : "Add"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {searchQuery.trim() &&
        searchResults.length === 0 &&
        !isSearching && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 p-3">
            <p className="text-sm text-muted-foreground">No users found</p>
          </div>
        )}
    </div>
  )
}

export default SearchQuery
