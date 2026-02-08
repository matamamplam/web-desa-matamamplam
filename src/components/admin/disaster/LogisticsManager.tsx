"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { FiPlus, FiTrash2, FiEdit2, FiPackage, FiFilter, FiArrowUp, FiArrowDown, FiActivity, FiArrowRight } from "react-icons/fi"

interface LogisticsManagerProps {
  eventId: string
}

export default function LogisticsManager({ eventId }: LogisticsManagerProps) {
  const [items, setItems] = useState<any[]>([])
  const [poskos, setPoskos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"list" | "create" | "transaction" | "history">("list")
  
  const [selectedPosko, setSelectedPosko] = useState("")
  const [filterType, setFilterType] = useState("")
  const [editingItem, setEditingItem] = useState<any>(null)
  const [selectedItemForTransaction, setSelectedItemForTransaction] = useState<any>(null)
  const [transactionType, setTransactionType] = useState<"IN" | "OUT">("IN")

  // Fetch Poskos
  useEffect(() => {
    fetch(`/api/admin/disaster/posts?eventId=${eventId}`)
      .then(res => res.json())
      .then(data => {
        setPoskos(data)
        if(data.length > 0) setSelectedPosko(data[0].id) // Default select first
      })
      .catch(console.error)
  }, [eventId])

  const fetchItems = async () => {
    if (!selectedPosko) return
    try {
      setLoading(true)
      const url = new URL("/api/admin/disaster/logistics", window.location.origin)
      url.searchParams.append("eventId", eventId) // API might need update to filter by posko effectively OR we filter by poskoId here
      url.searchParams.append("poskoId", selectedPosko)
      if (filterType) url.searchParams.append("type", filterType)

      const res = await fetch(url.toString())
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      toast.error("Gagal memuat logistik")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [selectedPosko, filterType])

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4 md:space-y-0 md:flex justify-between items-center">
         <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="md:w-64">
                <label className="block text-xs font-medium text-gray-500 mb-1">Pilih Posko</label>
                <select 
                    value={selectedPosko} 
                    onChange={(e) => setSelectedPosko(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm font-medium"
                >
                    {poskos.length === 0 && <option value="">Belum ada Posko</option>}
                    {poskos.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            
            <div className="md:w-48">
                <label className="block text-xs font-medium text-gray-500 mb-1">Filter Kategori</label>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                    <option value="">Semua Kategori</option>
                    <option value="FOOD">Makanan & Minuman</option>
                    <option value="MEDICINE">Obat-obatan</option>
                    <option value="CLOTHING">Pakaian</option>
                    <option value="EQUIPMENT">Peralatan</option>
                    <option value="OTHER">Lainnya</option>
                </select>
            </div>
         </div>

         <button
            onClick={() => {
                setEditingItem(null)
                setActiveView("create")
            }}
            disabled={!selectedPosko}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
         >
            <FiPlus className="mr-2" /> Tambah Item Baru
         </button>
      </div>

      {activeView === "create" ? (
         <LogisticsForm 
            poskoId={selectedPosko}
            initialData={editingItem}
            onCancel={() => setActiveView("list")}
            onSuccess={() => {
                setActiveView("list")
                fetchItems()
            }}
         />
      ) : activeView === "transaction" ? (
         <TransactionForm 
            item={selectedItemForTransaction}
            type={transactionType}
            onCancel={() => setActiveView("list")}
            onSuccess={() => {
                setActiveView("list")
                fetchItems()
            }}
         />
      ) : activeView === "history" ? (
          <TransactionHistory 
             item={selectedItemForTransaction}
             onBack={() => setActiveView("list")}
          />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
                <div className="col-span-full text-center py-10 text-gray-500">Memuat data logistik...</div>
            ) : items.length === 0 ? (
                <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed">
                    Tidak ada item logistik di posko ini. Silakan tambah item baru.
                </div>
            ) : (
                items.map(item => (
                    <div key={item.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 relative group">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                    item.type === 'FOOD' ? 'bg-orange-100 text-orange-700' :
                                    item.type === 'MEDICINE' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {item.type}
                                </span>
                                <h4 className="font-semibold text-lg text-gray-900 mt-1">{item.itemName}</h4>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button 
                                    onClick={() => {
                                        setEditingItem(item)
                                        setActiveView("create")
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded bg-gray-50"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button 
                                    onClick={() => {
                                        if(confirm("Hapus item logistik ini?")) {
                                            fetch(`/api/admin/disaster/logistics?id=${item.id}`, { method: "DELETE" })
                                            .then(() => fetchItems())
                                        }
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded bg-gray-50"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-3xl font-bold text-gray-900">
                                {item.currentStock.toLocaleString('id-ID')} 
                                <span className="text-sm font-normal text-gray-500 ml-1">{item.unit}</span>
                            </div>
                            {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                             <button 
                                onClick={() => {
                                    setSelectedItemForTransaction(item)
                                    setTransactionType("IN")
                                    setActiveView("transaction")
                                }}
                                className="flex items-center justify-center py-2 px-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 border border-green-200"
                             >
                                 <FiArrowUp className="mr-1.5" /> Masuk
                             </button>
                             <button
                                onClick={() => {
                                    setSelectedItemForTransaction(item)
                                    setTransactionType("OUT")
                                    setActiveView("transaction")
                                }}
                                className="flex items-center justify-center py-2 px-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200"
                             >
                                 <FiArrowDown className="mr-1.5" /> Keluar
                             </button>
                        </div>
                        
                        <button 
                            onClick={() => {
                                setSelectedItemForTransaction(item)
                                setActiveView("history")
                            }}
                            className="w-full mt-2 py-1.5 text-xs text-center text-gray-500 hover:text-blue-600 flex items-center justify-center"
                        >
                            <FiActivity className="mr-1" /> Riwayat Transaksi
                        </button>
                    </div>
                ))
            )}
        </div>
      )}
    </div>
  )
}

// === Sub Components ===

function LogisticsForm({ poskoId, initialData, onCancel, onSuccess }: any) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: initialData || {
            itemName: "",
            unit: "Pcs",
            type: "FOOD",
            description: "",
            currentStock: 0,
            poskoId: poskoId
        }
    })

    const onSubmit = async (data: any) => {
        try {
            const url = "/api/admin/disaster/logistics"
            const method = initialData ? "PUT" : "POST"
            const payload = initialData 
                ? { ...data, id: initialData.id } 
                : { ...data, poskoId } // Ensure poskoId is sent for new items

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (!res.ok) throw new Error("Gagal menyimpan")
            toast.success("Berhasil disimpan")
            onSuccess()
        } catch (e) {
            toast.error("Gagal menyimpan data")
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg border shadow-sm max-w-xl mx-auto">
            <h3 className="text-lg font-bold mb-4">{initialData ? "Edit Item" : "Tambah Item Logistik Baru"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                    <input {...register("itemName", { required: "Wajib" })} className="w-full px-4 py-2 border rounded-lg" placeholder="Contoh: Beras Premium" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select {...register("type")} className="w-full px-4 py-2 border rounded-lg">
                            <option value="FOOD">Makanan & Minuman</option>
                            <option value="MEDICINE">Obat-obatan</option>
                            <option value="CLOTHING">Pakaian</option>
                            <option value="EQUIPMENT">Peralatan</option>
                            <option value="OTHER">Lainnya</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Satuan Dasar</label>
                        <input {...register("unit", { required: "Wajib" })} className="w-full px-4 py-2 border rounded-lg" placeholder="Kg, Dus, Pcs..." />
                     </div>
                </div>

                {!initialData && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
                        <input type="number" {...register("currentStock")} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi / Keterangan</label>
                    <textarea {...register("description")} rows={3} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded-lg">Batal</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Simpan</button>
                </div>
            </form>
        </div>
    )
}

function TransactionForm({ item, type, onCancel, onSuccess }: any) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                logisticsId: item.id,
                type: type,
                amount: parseInt(data.amount),
                description: data.description,
                date: new Date().toISOString()
            }

            const res = await fetch("/api/admin/disaster/logistics", { // We might need a specific transaction endpoint or handle it in the same route
                method: "PATCH", // Use PATCH or a specific POST transaction route
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                toast.success("Transaksi berhasil")
                onSuccess()
            } else {
                toast.error("Gagal mencatat transaksi")
            }
        } catch (e) {
            toast.error("Error")
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg border shadow-sm max-w-md mx-auto">
             <h3 className="text-lg font-bold mb-2 flex items-center">
                 {type === 'IN' ? <FiArrowUp className="text-green-600 mr-2"/> : <FiArrowDown className="text-red-600 mr-2"/>}
                 Catat Barang {type === 'IN' ? "Masuk" : "Keluar"}
             </h3>
             <p className="text-sm text-gray-500 mb-6">Item: <span className="font-semibold text-gray-800">{item.itemName}</span> ({item.unit})</p>

             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah {type === 'IN' ? "Diterima" : "Dikeluarkan"}</label>
                     <input {...register("amount", { required: true, min: 1 })} type="number" className="w-full px-4 py-2 border rounded-lg text-lg font-bold" autoFocus />
                 </div>
                 
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Sumber / Tujuan</label>
                     <textarea {...register("description", { required: true })} rows={2} className="w-full px-4 py-2 border rounded-lg" placeholder={type === 'IN' ? "Dari Donatur X..." : "Dibagikan ke Tenda A..."} />
                 </div>

                 <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded-lg">Batal</button>
                    <button type="submit" disabled={isSubmitting} className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${type === 'IN' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                        Simpan Transaksi
                    </button>
                </div>
             </form>
        </div>
    )
}

function TransactionHistory({ item, onBack }: any) {
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch specific history for item
        // Assuming API supports fetching transactions or detailed item view
        // For now, let's assume /api/admin/disaster/logistics?id=X&include_transactions=true or separate endpoint
        
        // I will assume for now I can fetch transactions.
        
        fetch(`/api/admin/disaster/logistics?id=${item.id}&include_transactions=true`)
            .then(res => res.json())
            .then(data => {
                setHistory(data.transactions || [])
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [item.id])

    return (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center gap-4 bg-gray-50">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-900">
                    <FiArrowRight className="rotate-180" />
                </button>
                <div>
                   <h3 className="font-bold text-gray-900">Riwayat Transaksi: {item.itemName}</h3>
                   <p className="text-xs text-gray-500">Total Stok Saat Ini: {item.currentStock} {item.unit}</p>
                </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">Memuat data...</td></tr>
                        ) : history.length === 0 ? (
                             <tr><td colSpan={4} className="p-8 text-center text-gray-500">Belum ada transaksi</td></tr>
                        ) : (
                            history.map((tx: any) => (
                                <tr key={tx.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-500">
                                        {new Date(tx.date).toLocaleDateString('id-ID')} {new Date(tx.date).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                    <td className="px-4 py-2 text-sm">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${tx.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                        {tx.type === 'IN' ? '+' : '-'}{tx.amount}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{tx.description || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
