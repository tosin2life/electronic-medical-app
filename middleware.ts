import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccess } from "./lib/routes";

const matchers = Object.keys(routeAccess).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccess[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = new URL(req.url);

  const role =
    userId && sessionClaims?.metadata?.role
      ? sessionClaims.metadata.role
      : userId
      ? "patient"
      : "sign-in";

  // If authenticated user is on sign-in or sign-up page, redirect to their dashboard
  if (userId && (url.pathname === "/sign-in" || url.pathname === "/sign-up")) {
    return NextResponse.redirect(new URL(`/${role}`, url.origin));
  }

  // If authenticated user is on home page, redirect to their dashboard
  if (userId && url.pathname === "/") {
    return NextResponse.redirect(new URL(`/${role}`, url.origin));
  }

  const matchingRoute = matchers.find(({ matcher }) => matcher(req));

  if (matchingRoute && !matchingRoute.allowedRoles.includes(role)) {
    // Redirect unauthorized roles to their respective default pages
    return NextResponse.redirect(new URL(`/${role}`, url.origin));
  }

  // Continue if the user is authorized
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
