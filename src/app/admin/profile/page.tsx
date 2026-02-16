import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/admin/profile/ProfileClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      phone: true,
      role: true,
      avatar: true,
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  // Ensure all fields are strings (though they should be from DB or null)
  const profileData = {
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    avatar: user.avatar,
  };

  return <ProfileClient initialProfile={profileData} />;
}
