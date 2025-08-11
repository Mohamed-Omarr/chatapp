export function WelcomeScreen() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div className="text-6xl">💬</div>
        <h2 className="text-2xl font-semibold">Welcome to Chat App</h2>
        <p className="text-muted-foreground max-w-md">
          Select a friend from the sidebar to start chatting, or check your friend requests to connect with new people.
        </p>
      </div>
    </div>
  )
}
