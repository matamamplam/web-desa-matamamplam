"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { FiFilter, FiSearch, FiUserPlus, FiAlertCircle, FiTrash2, FiEdit2, FiCheckSquare, FiSquare, FiPlusCircle } from "react-icons/fi"
import EditResidentModal from "./EditResidentModal"

interface ResidentManagerProps {
  eventId: string
}

export default function ResidentManager({ eventId }: ResidentManagerProps) {
  const [activeView, setActiveView] = useState<"list" | "create_bulk" | "create_manual">("list")
  const [affectedList, setAffectedList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDusun, setSelectedDusun] = useState("")
  const [editingResident, setEditingResident] = useState<any | null>(null)
  
  // Fetch Affected List
  const fetchAffected = async () => {
    try {
      setLoading(true)
      const url = new URL("/api/admin/disaster/residents", window.location.origin)
      url.searchParams.append("eventId", eventId)
      if (selectedDusun) url.searchParams.append("dusun", selectedDusun)
      
      const res = await fetch(url.toString())
      if (res.ok) {
        const data = await res.json()
        setAffectedList(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAffected()
  }, [eventId, selectedDusun])

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
           <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                 value={selectedDusun}
                 onChange={(e) => setSelectedDusun(e.target.value)}
                 className="pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white min-w-[200px]"
              >
                 <option value="">Semua Dusun</option>
                 <option value="Dusun Bale Situi">Dusun Bale Situi</option>
                 <option value="Dusun Muda Intan">Dusun Muda Intan</option>
                 <option value="Dusun Kolam">Dusun Kolam</option>
                 <option value="-">Tanpa Dusun</option>
              </select>
           </div>
        </div>
        
        <div className="flex gap-2">
            <button
            onClick={() => setActiveView("create_bulk")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
            >
            <FiUserPlus />
            Pilih Data Warga
            </button>
            <button
            onClick={() => setActiveView("create_manual")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium"
            >
            <FiPlusCircle />
            Input Manual
            </button>
        </div>
      </div>

      {activeView === "create_bulk" ? (
        <BulkResidentSelector 
           eventId={eventId} 
           onCancel={() => setActiveView("list")}
           onSuccess={() => {
              setActiveView("list")
              fetchAffected()
           }}
        />
      ) : activeView === "create_manual" ? (
        <ManualResidentForm
            eventId={eventId}
            onCancel={() => setActiveView("list")}
            onSuccess={() => {
                setActiveView("list")
                fetchAffected()
            }}
        />
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
           <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama / Usia / Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat / Dusun</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi Saat Ini</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kebutuhan Khusus & Catatan</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                 </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                 {loading ? (
                    <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Memuat data...</td>
                    </tr>
                 ) : affectedList.length === 0 ? (
                    <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Tidak ada data warga terdampak sesuai filter.</td>
                    </tr>
                 ) : (
                    affectedList.map((item: any) => {
                        const isManual = !item.pendudukId;
                        const name = isManual ? item.manualName : item.penduduk.nama;
                        const nikOrAge = isManual ? `${item.manualAge} Thn` : item.penduduk.nik;
                        const gender = isManual ? item.manualGender : item.penduduk.jenisKelamin;
                        const address = isManual ? item.manualAddress : (item.penduduk.kk?.dusun || item.penduduk.kk?.alamat);

                        return (
                       <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                {name}
                                {isManual && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded border">Manual</span>}
                             </div>
                             <div className="text-xs text-gray-500">{gender === "LAKI_LAKI" ? "L" : "P"} • {nikOrAge}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                             <div className="text-sm text-gray-900">{address || "-"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.condition === 'SAFE' ? 'bg-green-100 text-green-800' :
                                item.condition === 'DISPLACED' ? 'bg-yellow-100 text-yellow-800' :
                                item.condition === 'INJURED' ? 'bg-orange-100 text-orange-800' :
                                item.condition === 'DECEASED' ? 'bg-black text-white' :
                                'bg-red-100 text-red-800'
                             }`}>
                                {item.condition}
                             </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                             {item.posko?.name || item.currentLocation || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                             {item.specialNeeds && (
                                <div className="mb-1">
                                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{item.specialNeeds}</span>
                                </div>
                             )}
                             <span className="truncate block">{item.notes || "-"}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm">
                             <div className="flex justify-end gap-2">
                                <button
                                   onClick={() => setEditingResident(item)}
                                   className="text-blue-600 hover:text-blue-800 p-1"
                                   title="Edit Data"
                                >
                                   <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                      if(confirm("Hapus data warga terdampak ini?")) {
                                          fetch(`/api/admin/disaster/residents?id=${item.id}`, { method: "DELETE" })
                                          .then(res => {
                                              if (res.ok) {
                                                  toast.success("Data dihapus")
                                                  fetchAffected()
                                              } else {
                                                  toast.error("Gagal menghapus")
                                              }
                                          })
                                      }
                                  }}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Hapus Data"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                        )
                    })
                 )}
              </tbody>
           </table>
        </div>
      )}

      {editingResident && (
         <EditResidentModal 
            resident={editingResident} 
            onClose={() => setEditingResident(null)}
            onSuccess={() => {
               setEditingResident(null)
               fetchAffected()
            }}
         />
      )}
    </div>
  )
}

function ManualResidentForm({ eventId, onCancel, onSuccess }: any) {
    const [loading, setLoading] = useState(false)
    const [poskos, setPoskos] = useState<any[]>([])
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            manualName: "",
            manualAge: "",
            manualGender: "LAKI_LAKI",
            manualAddress: "",
            condition: "DISPLACED",
            specialNeeds: "",
            poskoId: "",
            currentLocation: "",
            notes: ""
        }
    })

    const condition = watch("condition")
    const poskoId = watch("poskoId")

    useEffect(() => {
        fetch(`/api/admin/disaster/posts?eventId=${eventId}`)
            .then(res => res.json())
            .then(data => setPoskos(data))
            .catch(console.error)
    }, [eventId])

    // Update currentLocation name when posko selected
    useEffect(() => {
        if((condition === "DISPLACED" || condition === "INJURED") && poskoId) {
            const p = poskos.find(x => x.id === poskoId)
            if(p) setValue("currentLocation", p.name)
        }
    }, [poskoId, condition])

    const onSubmit = async (data: any) => {
        setLoading(true)
        try {
            const payload = {
                eventId,
                ...data,
                manualAge: parseInt(data.manualAge) || 0,
                // If posko selected, ensure poskoId is sent, else undefined
                poskoId: (data.condition === "DISPLACED" || data.condition === "INJURED") && data.poskoId ? data.poskoId : undefined
            }

            const res = await fetch("/api/admin/disaster/residents", {
                method: "POST", // New endpoint must handle single object or array
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload) 
            })

            if (res.ok) {
                toast.success("Data berhasil ditambahkan")
                onSuccess()
            } else {
                toast.error("Gagal menyimpan data")
            }
        } catch (e) {
            toast.error("Terjadi kesalahan")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white border rounded-lg p-6 max-w-2xl mx-auto shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Input Manual Warga Terdampak</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input {...register("manualName", { required: "Wajib diisi" })} className="w-full px-4 py-2 border rounded-lg" placeholder="Nama Warga" />
                        {errors.manualName && <p className="text-red-500 text-xs">{errors.manualName.message as string}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usia (Tahun)</label>
                        <input {...register("manualAge", { required: "Wajib diisi" })} type="number" className="w-full px-4 py-2 border rounded-lg" placeholder="Umur" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                        <select {...register("manualGender")} className="w-full px-4 py-2 border rounded-lg">
                            <option value="LAKI_LAKI">Laki-laki</option>
                            <option value="PEREMPUAN">Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Asal</label>
                        <input {...register("manualAddress")} className="w-full px-4 py-2 border rounded-lg" placeholder="Dusun / Desa Asal" />
                    </div>
                </div>
                
                <hr className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi</label>
                        <select {...register("condition")} className="w-full px-4 py-2 border rounded-lg">
                            <option value="DISPLACED">Mengungsi</option>
                            <option value="INJURED">Luka-luka</option>
                            <option value="SAFE">Selamat (Di Rumah)</option>
                            <option value="MISSING">Hilang</option>
                            <option value="DECEASED">Meninggal</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kebutuhan Khusus</label>
                        <select {...register("specialNeeds")} className="w-full px-4 py-2 border rounded-lg">
                             <option value="">- Tidak Ada -</option>
                             <option value="LANSIA">Lansia</option>
                             <option value="BALITA">Balita</option>
                             <option value="IBU_HAMIL">Ibu Hamil</option>
                             <option value="DISABILITAS">Disabilitas</option>
                             <option value="SAKIT">Sakit</option>
                        </select>
                    </div>
                </div>

                {(condition === "DISPLACED" || condition === "INJURED") && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Posko</label>
                        <select {...register("poskoId")} className="w-full px-4 py-2 border rounded-lg">
                            <option value="">-- Pilih Posko (Jika Ada) --</option>
                            {poskos.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Detail / Keterangan</label>
                    <input {...register("currentLocation")} className="w-full px-4 py-2 border rounded-lg" placeholder="Contoh: Tenda 1, Rumah Bpk Budi" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                    <textarea {...register("notes")} className="w-full px-4 py-2 border rounded-lg" rows={2} />
                </div>

                <div className="flex justify-end pt-4 gap-3">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded-lg">Batal</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                        {loading ? "Menyimpan..." : "Simpan Data"}
                    </button>
                </div>
            </form>
        </div>
    )
}

function BulkResidentSelector({ eventId, onCancel, onSuccess }: any) {
   const [residents, setResidents] = useState<any[]>([])
   const [loading, setLoading] = useState(false)
   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
   const [filterDusun, setFilterDusun] = useState("")
   const [search, setSearch] = useState("")
   const [bulkCondition, setBulkCondition] = useState("DISPLACED")
   const [isSubmitting, setIsSubmitting] = useState(false)

   const [poskos, setPoskos] = useState<any[]>([])
   const [selectedPoskoId, setSelectedPoskoId] = useState("")
   const [specialNeeds, setSpecialNeeds] = useState("")

   const fetchResidents = async () => {
       setLoading(true)
       try {
           const url = new URL("/api/admin/penduduk", window.location.origin)
           if (filterDusun) url.searchParams.append("dusun", filterDusun)
           if (search) url.searchParams.append("search", search)
           url.searchParams.append("page", "1") 
           url.searchParams.append("limit", "100") 
           
           const res = await fetch(url.toString())
           if (res.ok) {
               const data = await res.json()
               setResidents(data.penduduk || [])
           }
       } catch (e) {
           console.error(e)
           toast.error("Gagal memuat data penduduk")
       } finally {
           setLoading(false)
       }
   }

   // Fetch Poskos
   useEffect(() => {
     const fetchPoskos = async () => {
         try {
             const res = await fetch(`/api/admin/disaster/posts?eventId=${eventId}`)
             if (res.ok) {
                 const data = await res.json()
                 setPoskos(data)
             }
         } catch (error) {
             console.error("Failed to fetch poskos", error)
         }
     }
     fetchPoskos()
   }, [eventId])

   useEffect(() => {
       const timer = setTimeout(() => {
           fetchResidents()
       }, 300)
       return () => clearTimeout(timer)
   }, [filterDusun, search])

   const toggleSelectAll = () => {
       if (selectedIds.size === residents.length && residents.length > 0) {
           setSelectedIds(new Set())
       } else {
           const newSet = new Set<string>()
           residents.forEach(r => newSet.add(r.id))
           setSelectedIds(newSet)
       }
   }

   const toggleSelect = (id: string) => {
       const newSet = new Set(selectedIds)
       if (newSet.has(id)) newSet.delete(id)
       else newSet.add(id)
       setSelectedIds(newSet)
   }

   const handleSubmit = async () => {
       if (selectedIds.size === 0) {
           toast.error("Pilih minimal satu warga")
           return
       }

       if (!confirm(`Tambahkan ${selectedIds.size} warga dengan status ${bulkCondition}?`)) return

       setIsSubmitting(true)
       try {
           const payload = Array.from(selectedIds).map(id => ({
               eventId,
               pendudukId: id,
               condition: bulkCondition,
               currentLocation: "",
               poskoId: ((bulkCondition === "DISPLACED" || bulkCondition === "INJURED") && selectedPoskoId) ? selectedPoskoId : undefined,
               specialNeeds: specialNeeds || undefined,
               notes: ""
           }))
           
           // If payload is array, logic in API should handle check
           const res = await fetch("/api/admin/disaster/residents", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(payload)
           })

           if (res.ok) {
               toast.success("Berhasil menambahkan warga terdampak")
               onSuccess()
           } else {
               toast.error("Gagal menyimpan data")
           }
       } catch (e) {
           toast.error("Terjadi kesalahan")
       } finally {
           setIsSubmitting(false)
       }
   }

   return (
       <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
           <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
               <h3 className="font-semibold text-lg text-gray-800">Pilih Data Warga (Dari Database Penduduk)</h3>
               <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                   &times;
               </button>
           </div>
           
           <div className="p-4 space-y-4">
               {/* Filters */}
               <div className="flex flex-col md:flex-row gap-4">
                   <div className="flex-1">
                       <input
                           placeholder="Cari Nama / NIK..."
                           className="w-full px-4 py-2 border rounded-lg"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                       />
                   </div>
                   <div className="w-full md:w-48">
                      <select 
                         value={filterDusun}
                         onChange={(e) => setFilterDusun(e.target.value)}
                         className="w-full px-4 py-2 border rounded-lg"
                      >
                         <option value="">Semua Dusun</option>
                         <option value="Dusun Bale Situi">Dusun Bale Situi</option>
                         <option value="Dusun Muda Intan">Dusun Muda Intan</option>
                         <option value="Dusun Kolam">Dusun Kolam</option>
                      </select>
                   </div>
               </div>

               {/* Table */}
               <div className="border rounded-lg max-h-96 overflow-y-auto">
                   <table className="min-w-full divide-y divide-gray-200">
                       <thead className="bg-gray-50 sticky top-0">
                           <tr>
                               <th className="px-4 py-3 w-10 text-center">
                                   <input 
                                     type="checkbox" 
                                     onChange={toggleSelectAll}
                                     checked={residents.length > 0 && selectedIds.size === residents.length}
                                     className="rounded text-blue-600 focus:ring-blue-500"
                                   />
                               </th>
                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIK</th>
                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dusun</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-200">
                           {loading ? (
                               <tr><td colSpan={4} className="p-8 text-center text-gray-500">Memuat data...</td></tr>
                           ) : residents.length === 0 ? (
                               <tr><td colSpan={4} className="p-8 text-center text-gray-500">Data tidak ditemukan</td></tr>
                           ) : (
                               residents.map(r => (
                                   <tr key={r.id} className={selectedIds.has(r.id) ? "bg-blue-50" : "hover:bg-gray-50"}>
                                       <td className="px-4 py-3 text-center">
                                           <input 
                                             type="checkbox"
                                             checked={selectedIds.has(r.id)}
                                             onChange={() => toggleSelect(r.id)}
                                             className="rounded text-blue-600 focus:ring-blue-500"
                                           />
                                       </td>
                                       <td className="px-4 py-3 text-sm text-gray-900 font-medium">{r.nama}</td>
                                       <td className="px-4 py-3 text-sm text-gray-500">{r.nik}</td>
                                       <td className="px-4 py-3 text-sm text-gray-500">{r.kk?.dusun || r.kk?.alamat || "-"}</td>
                                   </tr>
                               ))
                           )}
                       </tbody>
                   </table>
               </div>

               {/* Bulk Actions */}
               <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2 border-t">
                   <div className="text-sm text-gray-600">
                       Terpilih: <b>{selectedIds.size}</b> warga
                   </div>
                   
                   <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end">
                       <span className="text-sm text-gray-600 whitespace-nowrap">Set Detail:</span>
                       <select 
                          value={bulkCondition}
                          onChange={(e) => setBulkCondition(e.target.value)}
                          className="border px-3 py-1.5 rounded-lg text-sm"
                       >
                          <option value="DISPLACED">Mengungsi</option>
                          <option value="INJURED">Luka-luka</option>
                          <option value="SAFE">Selamat (Di Rumah)</option>
                          <option value="MISSING">Hilang</option>
                          <option value="DECEASED">Meninggal</option>
                       </select>

                        <select 
                          value={specialNeeds}
                          onChange={(e) => setSpecialNeeds(e.target.value)}
                          className="border px-3 py-1.5 rounded-lg text-sm"
                       >
                             <option value="">- Tanpa Kebutuhan Khusus -</option>
                             <option value="LANSIA">Lansia</option>
                             <option value="BALITA">Balita</option>
                             <option value="IBU_HAMIL">Ibu Hamil</option>
                             <option value="DISABILITAS">Disabilitas</option>
                             <option value="SAKIT">Sakit</option>
                       </select>
                       
                       {(bulkCondition === "DISPLACED" || bulkCondition === "INJURED") && (
                           <select 
                              value={selectedPoskoId}
                              onChange={(e) => setSelectedPoskoId(e.target.value)}
                              className="border px-3 py-1.5 rounded-lg text-sm max-w-[200px]"
                           >
                              <option value="">-- Pilih Posko --</option>
                              {poskos.map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                           </select>
                       )}
                       
                       <button 
                          onClick={handleSubmit} 
                          disabled={isSubmitting || selectedIds.size === 0}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium whitespace-nowrap"
                       >
                          {isSubmitting ? "Menyimpan..." : "Simpan Terpilih"}
                       </button>
                   </div>
               </div>
           </div>
       </div>
   )
}
