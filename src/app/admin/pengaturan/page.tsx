import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/admin/settings/SettingsClient";
import { SiteSettings } from "@/types/settings";

export default async function PengaturanPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Check permissions (consistent with API)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true },
  });

  if (!user || !['SUPERADMIN', 'KEPALA_DESA'].includes(user.role)) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h1>
        <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman pengaturan ini.</p>
      </div>
    );
  }

  const settingsData = await prisma.siteSettings.findFirst();

  let initialSettings: SiteSettings | null = null;
  
  if (settingsData) {
     // Type assertion since Prisma Json type might not perfectly match SiteSettings interface automatically
     initialSettings = settingsData.settings as unknown as SiteSettings;
  }

  return <SettingsClient initialSettings={initialSettings} />;
}
