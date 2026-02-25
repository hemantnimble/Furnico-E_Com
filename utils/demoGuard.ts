// utils/demoGuard.ts
// Uses plain string literals — no dependency on Prisma generated types.
// This means it works before AND after `npx prisma generate`.

export type UserRoleType = string | null | undefined;

export function isDemoRole(role?: UserRoleType): boolean {
  return role === "DEMO_ADMIN" || role === "DEMO_USER";
}

export function isDemoAdmin(role?: UserRoleType): boolean {
  return role === "DEMO_ADMIN";
}

export function isDemoUser(role?: UserRoleType): boolean {
  return role === "DEMO_USER";
}

/**
 * Pass session.user.roles (string | string[]).
 * Returns an error message string if the user is in demo mode, otherwise null.
 *
 * Usage in an API route:
 *   const block = demoBlock(session?.user?.roles);
 *   if (block) return NextResponse.json({ message: block }, { status: 403 });
 */
export function demoBlock(roles?: string | string[] | null): string | null {
  if (!roles) return null;
  const arr = Array.isArray(roles) ? roles : [roles];
  if (arr.includes("DEMO_ADMIN") || arr.includes("DEMO_USER")) {
    return "This action is disabled in demo mode.";
  }
  return null;
}