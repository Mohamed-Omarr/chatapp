"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { login } from "../../../../actions/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);

  const router = useRouter();

  useEffect(() => {
    if (!state) return;

    const { message, errors, accessToken } = state;

    if (errors) {
      toast.error(message || "Login failed.", { autoClose: 1500 });
      return;
    }

    if (message && accessToken) {
      localStorage.setItem("AccessToken", accessToken);
      toast.success(message, { autoClose: 1500 , onClose: () =>router.push("/home")});
    }
  }, [state,router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to chat app
          </CardTitle>
          <p className="text-muted-foreground">Login to chat app</p>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              {state?.errors?.email && (
                <p className="text-sm text-destructive mt-1">
                  {state.errors.email[0]}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state?.errors?.password && (
                <div className="text-sm text-destructive mt-1">
                  <p>Password must:</p>
                  <ul className="list-disc list-inside">
                    {state.errors.password.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Do not have an account?{" "}
            <Link href="/auth/register" className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
