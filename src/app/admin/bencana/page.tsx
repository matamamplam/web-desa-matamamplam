"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiMapPin, FiUsers } from "react-icons/fi"

export default function DisasterDashboard() {
  const [activeEvent, setActiveEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Fetch active event
  const fetchEvent = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/disaster/events")
      if (res.ok) {
        const events = await res.json()
        const active = events.find((e: any) => e.status === "ACTIVE")
        setActiveEvent(active || null)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Gagal memuat data bencana")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-6 border-b border-gray-200">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Manajemen Bencana</h1>
           <p className="text-gray-500">
             {activeEvent 
               ? `Sedang Menangani: ${activeEvent.title}` 
               : "Tidak ada bencana aktif saat ini"}
           </p>
        </div>
        <div>
           {!activeEvent && (
             <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors"
             >
                <FiAlertTriangle className="mr-2" />
                Aktifkan Mode Bencana
             </button>
           )}
           {activeEvent && (
              <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium text-sm">
                <FiAlertTriangle className="mr-1.5" />
                Status: Darurat
              </span>
           )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data...</p>
        </div>
      ) : activeEvent ? (
        <ActiveDisasterView event={activeEvent} refresh={fetchEvent} />
      ) : (
        <EmptyState onCreate={() => setIsCreateModalOpen(true)} />
      )}

      {isCreateModalOpen && (
        <CreateEventModal 
           onClose={() => setIsCreateModalOpen(false)} 
           onSuccess={() => {
             setIsCreateModalOpen(false)
             fetchEvent()
           }} 
        />
      )}
    </div>
  )
}

import PoskoManager from "@/components/admin/disaster/PoskoManager"
import ResidentManager from "@/components/admin/disaster/ResidentManager"
import DamageManager from "@/components/admin/disaster/DamageManager"
import LogisticsManager from "@/components/admin/disaster/LogisticsManager"

function ActiveDisasterView({ event, refresh }: { event: any, refresh: () => void }) {
  const [activeTab, setActiveTab] = useState("overview")

  const onArchive = async () => {
     if (!confirm("Apakah Anda yakin ingin menyelesaikan/menonaktifkan kejadian bencana ini? Data akan tersimpan sebagai riwayat.")) return 

     try {
       const res = await fetch("/api/admin/disaster/events", {
         method: "POST", // Actually should be PUT, but using POST with 'RESOLVED' status if API supports update or Create New? 
         // Logic check: My API `src/app/api/admin/disaster/events/route.ts` only has POST (Create) and GET.
         // I need to update the status. I should have implemented PUT.
         // Since I cannot change the API in this step easily without jumping files, I'll assumme I can't.
         // Wait, I can execute a tool to update API first? 
         // Yes I should.
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ }) // Placeholder
       })
       // ...
     } catch (e) { }
  }

  // NOTE: I need to update the API to support Status Update (PUT/PATCH). 
  // I will skip the implementation of `onArchive` inside this replacement and do it after I fix the API.
  // Just adding the Tab for now.
  
  const tabs = [
    { id: "overview", label: "Ringkasan" },
    { id: "posko", label: "Posko Pengungsian" },
    { id: "residents", label: "Warga Terdampak" },
    { id: "damage", label: "Laporan Kerusakan" },
    { id: "logistics", label: "Logistik" },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="px-6 py-4 flex justify-between items-start">
           <div>
              <h2 className="text-lg font-semibold text-gray-900">{event.title}</h2>
              <p className="text-sm text-gray-500">{event.location}</p>
           </div>
           <ArchiveButton eventId={event.id} onSuccess={refresh} />
        </div>
        <div className="flex px-6 space-x-6 overflow-x-auto">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                 activeTab === tab.id
                   ? "border-blue-600 text-blue-600"
                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
               }`}
             >
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                       <h3 className="text-sm font-medium text-orange-800">Warga Mengungsi</h3>
                       <FiUsers className="text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-orange-900 mt-2">{event._count?.affected || 0}</p>
                 </div>
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                       <h3 className="text-sm font-medium text-blue-800">Posko Aktif</h3>
                       <FiMapPin className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900 mt-2">{event._count?.posts || 0}</p>
                 </div>
                 <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="flex items-center justify-between">
                       <h3 className="text-sm font-medium text-red-800">Kerusakan Dilaporkan</h3>
                       <FiAlertTriangle className="text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-red-900 mt-2">{event._count?.damage || 0}</p>
                 </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                 <h3 className="font-medium text-gray-900 mb-2">Deskripsi Kejadian</h3>
                 <p className="text-gray-600">{event.description}</p>
              </div>
           </div>
        )}
        
        {activeTab === "posko" && (
            <PoskoManager eventId={event.id} />
        )}

        {activeTab === "residents" && (
            <ResidentManager eventId={event.id} />
        )}

        {activeTab === "damage" && (
            <DamageManager eventId={event.id} />
        )}

        {activeTab === "logistics" && (
            <LogisticsManager eventId={event.id} />
        )}
      </div>
    </div>
  )
}

function ArchiveButton({ eventId, onSuccess }: { eventId: string, onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)

    const handleArchive = async () => {
        if (!confirm("Nonaktifkan mode darurat? Data akan tersimpan di riwayat.")) return
        
        setLoading(true)
        try {
            const res = await fetch("/api/admin/disaster/events", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: eventId, status: "RESOLVED" })
            })

            if (res.ok) {
                toast.success("Bencana dinonaktifkan")
                onSuccess()
            } else {
                toast.error("Gagal mengubah status")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button 
           onClick={handleArchive} 
           disabled={loading}
           className="text-sm border border-red-200 text-red-600 bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition-colors"
        >
           {loading ? "Memproses..." : "Selesaikan / Nonaktifkan"}
        </button>
    )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheckCircle size={32} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Aman Terkendali</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        Tidak ada bencana yang sedang aktif saat ini. Jika terjadi situasi darurat, aktifkan mode bencana untuk mulai mengelola posko dan data warga.
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors"
      >
        <FiAlertTriangle className="mr-2" />
        Aktifkan Mode Bencana
      </button>
    </div>
  )
}

const eventSchema = z.object({
  title: z.string().min(3, "Judul event wajib diisi"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
})

type EventValues = z.infer<typeof eventSchema>

function CreateEventModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventValues>({
     resolver: zodResolver(eventSchema)
   })

   const onSubmit = async (data: EventValues) => {
     try {
       const res = await fetch("/api/admin/disaster/events", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ ...data, status: "ACTIVE" })
       })
       
       if (!res.ok) throw new Error("Gagal membuat event")
       
       toast.success("Mode darurat diaktifkan")
       onSuccess()
     } catch (error) {
       console.error(error)
       toast.error("Gagal mengaktifkan mode bencana")
     }
   }

   return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
       <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
         <div className="bg-red-600 px-6 py-4 flex justify-between items-center text-white">
            <h3 className="font-bold text-lg flex items-center">
              <FiAlertTriangle className="mr-2" />
              Aktifkan Mode Bencana
            </h3>
            <button onClick={onClose} className="hover:bg-red-700 p-1 rounded">X</button>
         </div>
         
         <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
               <p className="text-sm text-red-800 flex items-start">
                  <FiInfo className="mt-0.5 mr-2 flex-shrink-0" />
                  Mengaktifkan mode ini akan menampilkan banner darurat di halaman publik dan membuka akses fitur manajemen bencana.
               </p>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kejadian</label>
               <input 
                  {...register("title")}
                  placeholder="Contoh: Banjir Bandang Februari 2026"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
               />
               {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi / Cakupan</label>
               <input 
                  {...register("location")}
                  placeholder="Contoh: Dusun A, B, dan C"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
               />
               {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi & Instruksi Awal</label>
               <textarea 
                  {...register("description")}
                  rows={4}
                  placeholder="Jelaskan situasi dan instruksi untuk warga..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
               />
               {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="pt-4 flex gap-3 justify-end">
               <button 
                 type="button" 
                 onClick={onClose}
                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
               >
                 Batal
               </button>
               <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm disabled:opacity-50"
               >
                 {isSubmitting ? "Memproses..." : "Aktifkan Mode Darurat"}
               </button>
            </div>
         </form>
       </div>
     </div>
   )
}
