"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"

interface EditResidentModalProps {
  resident: any
  onClose: () => void
  onSuccess: () => void
}

export default function EditResidentModal({ resident, onClose, onSuccess }: EditResidentModalProps) {
  const [loading, setLoading] = useState(false)
  const [poskos, setPoskos] = useState<any[]>([])
  
  const isManual = !resident.pendudukId
  
  const [formData, setFormData] = useState({
    manualName: resident.manualName || "",
    manualAge: resident.manualAge || "",
    manualGender: resident.manualGender || "LAKI_LAKI",
    manualAddress: resident.manualAddress || "",
    
    condition: resident.condition,
    specialNeeds: resident.specialNeeds || "",
    currentLocation: resident.currentLocation || "",
    poskoId: resident.poskoId || "",
    notes: resident.notes || ""
  })

  useEffect(() => {
    // Fetch Poskos for dropdown
    const fetchPoskos = async () => {
        try {
            const res = await fetch(`/api/admin/disaster/posts?eventId=${resident.eventId}`)
            if (res.ok) {
                const data = await res.json()
                setPoskos(data)
            }
        } catch (error) {
            console.error("Failed to fetch poskos", error)
        }
    }
    fetchPoskos()
  }, [resident.eventId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
          id: resident.id,
          ...formData,
          manualAge: isManual ? parseInt(String(formData.manualAge)) : undefined,
          poskoId: (formData.condition === "DISPLACED" || formData.condition === "INJURED") && formData.poskoId ? formData.poskoId : null
      }

      const res = await fetch("/api/admin/disaster/residents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success("Data berhasil diperbarui")
        onSuccess()
      } else {
        toast.error("Gagal memperbarui data")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Edit Warga Terdampak</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Manual Entry Fields */}
          {isManual ? (
             <div className="space-y-4 bg-gray-50 p-3 rounded border">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                        <input 
                            value={formData.manualName}
                            onChange={(e) => setFormData({...formData, manualName: e.target.value})}
                            className="mt-1 w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usia</label>
                        <input 
                            type="number"
                            value={formData.manualAge}
                            onChange={(e) => setFormData({...formData, manualAge: e.target.value})}
                            className="mt-1 w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                        <select 
                            value={formData.manualGender}
                            onChange={(e) => setFormData({...formData, manualGender: e.target.value})}
                            className="mt-1 w-full px-3 py-2 border rounded-md"
                        >
                            <option value="LAKI_LAKI">Laki-laki</option>
                            <option value="PEREMPUAN">Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alamat</label>
                        <input 
                            value={formData.manualAddress}
                            onChange={(e) => setFormData({...formData, manualAddress: e.target.value})}
                            className="mt-1 w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                </div>
             </div>
          ) : (
            <div>
                <label className="block text-sm font-medium text-gray-700">Nama Warga (Database)</label>
                <div className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600 font-medium">
                    {resident.penduduk?.nama} ({resident.penduduk?.nik})
                </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-gray-700">Kondisi</label>
                 <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                 >
                    <option value="DISPLACED">Mengungsi</option>
                    <option value="SAFE">Selamat (Di Rumah)</option>
                    <option value="INJURED">Luka-luka</option>
                    <option value="MISSING">Hilang</option>
                    <option value="DECEASED">Meninggal</option>
                    <option value="NEEDS_HELP">Butuh Bantuan</option>
                 </select>
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-gray-700">Kebutuhan Khusus</label>
                 <select
                    value={formData.specialNeeds}
                    onChange={(e) => setFormData({...formData, specialNeeds: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                 >
                     <option value="">- Tidak Ada -</option>
                     <option value="LANSIA">Lansia</option>
                     <option value="BALITA">Balita</option>
                     <option value="IBU_HAMIL">Ibu Hamil</option>
                     <option value="DISABILITAS">Disabilitas</option>
                     <option value="SAKIT">Sakit</option>
                 </select>
              </div>
          </div>
        
          {(formData.condition === "DISPLACED" || formData.condition === "INJURED") && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Pilih Posko (Opsional)</label>
                <select
                    value={formData.poskoId}
                     onChange={(e) => {
                         const pid = e.target.value;
                         const selectedPosko = poskos.find(p => p.id === pid);
                         setFormData({
                             ...formData, 
                             poskoId: pid,
                             currentLocation: selectedPosko ? selectedPosko.name : ""
                         })
                     }}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                >
                    <option value="">-- Tidak di Posko / Lokasi Lain --</option>
                    {poskos.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
              </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Lokasi Saat Ini {(formData.condition === "DISPLACED" || formData.condition === "INJURED") && formData.poskoId ? "(Otomatis dari Posko)" : ""}</label>
            <input 
              value={formData.currentLocation}
              onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
              placeholder="Contoh: Posko Balai Desa, Rumah Saudara"
              className="mt-1 w-full px-3 py-2 border rounded-md"
              disabled={!!formData.poskoId} // Disable if posko selected
            />
            {formData.poskoId && <p className="text-xs text-gray-500 mt-1">Lokasi mengikuti nama posko yang dipilih.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Catatan</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="mt-1 w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
