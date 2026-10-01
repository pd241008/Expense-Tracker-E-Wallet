import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/auth(.*)"]);
const isAuthPage = createRouteMatcher(["/auth(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Signed-in users don't need the sign-in page.
  if (isAuthPage(req)) {
    if ((await auth()).userId) {
      return Response.redirect(new URL("/dashboard", req.url));
    }
    return;
  }

  // Everything else (app pages + APIs) requires a session.
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
