"use client"

import { signOut } from "next-auth/react"
import { useState } from "react"
import { useAdminStats } from "@/hooks/useAdminStats"
import { useSidebar } from "@/context/SidebarContext"
import { toast } from "react-hot-toast"

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
    avatar?: string | null
  }
}

export default function Header({ user }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const { stats } = useAdminStats()
  const { toggleMobileSidebar } = useSidebar()

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/auth/login" })
    } catch (error) {
       console.error("Logout failed:", error)
       toast.error("Gagal keluar. Silakan coba lagi.")
    }
  }

  return (
    <header className="flex h-16 items-center border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex flex-1 items-center justify-between">
        {/* Page Title / Breadcrumb - can be enhanced later */}
        <div>
          <div className="flex items-center gap-3">
             <button
                type="button"
                className="md:hidden -ml-2 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                onClick={toggleMobileSidebar}
             >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
             </button>
             <h2 className="text-lg font-semibold text-gray-900">
               Admin Panel
             </h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              title="Notifikasi"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {stats.total > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>

            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3 flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-900">Notifikasi</p>
                    {stats.total > 0 && (
                       <span className="text-xs font-medium bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">{stats.total} Baru</span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {stats.recent?.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        Tidak ada notifikasi baru
                      </div>
                    ) : (
                      stats.recent?.map((item) => (
                        <a
                           key={item.id}
                           href={item.link}
                           className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 bg-white border-b border-gray-50 last:border-0 transition-colors"
                        >
                           <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${item.type === 'LETTER' ? 'bg-blue-500' : 'bg-red-500'}`} />
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 leading-tight">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                {item.subtitle}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {new Date(item.time).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'})}
                              </p>
                           </div>
                        </a>
                      ))
                    )}
                  </div>
                   <div className="border-t border-gray-100 p-2 text-center">
                     <a href="/admin" className="text-xs font-medium text-blue-600 hover:text-blue-800">
                       Lihat semua di Dashboard
                     </a>
                   </div>
                </div>
              </>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user.role?.replace("_", " ")}
                </p>
              </div>
              <svg
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <a
                      href="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profil Saya
                    </a>
                    <a
                      href="/admin/pengaturan"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Pengaturan
                    </a>
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Keluar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
