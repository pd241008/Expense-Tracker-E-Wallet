import { auth } from "@clerk/nextjs/server";

/**
 * Resolves the authenticated user's Clerk id, or null for guests.
 * Every API route must call this instead of trusting a client-supplied userId.
 */
export async function getAuthUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}
