"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { settings } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true);
        toast.success("Link reset password telah dikirim ke email Anda");
      } else {
        toast.error(data.error || "Terjadi kesalahan saat mengirim email");
      }
    } catch (error) {
      toast.error("Gagal mengirim email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-xl">
        <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg mb-4">
              {settings?.branding?.logo ? (
                <Image
                  src={settings.branding.logo}
                  alt={settings.general?.siteName || "Logo"}
                  width={64}
                  height={64}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600">
                  <svg
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              )}
            </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Lupa Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masukkan email Anda untuk menerima link reset password {settings?.general?.siteName ? `akun ${settings.general.siteName}` : ''}
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
              Email reset password telah dikirim ke <strong>{email}</strong>. Silakan cek inbox atau folder spam Anda.
            </div>
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Email address"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {loading ? "Mengirim..." : "Kirim Link Reset Password"}
              </button>
            </div>
            
            <div className="text-center text-sm">
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Kembali ke Login
                </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
