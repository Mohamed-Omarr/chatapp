import { NextRequest } from "next/server";
import { updateSession } from "./lib/supabaseHooks/supabasemiddlewarehelper";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}


export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/auth/:path*",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
