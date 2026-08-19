import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const ADMIN_EMAIL = "radityaraizeeshan@gmail.com";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect non-admin users to home
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  return <>{children}</>;
}
