// src/app/auth/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth screen renders standalone on the shared theme; no navbar/sidebar.
  return <>{children}</>;
}
