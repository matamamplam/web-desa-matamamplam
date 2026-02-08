'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import DeleteButton from '@/components/admin/penduduk/DeleteButton';
import { toast } from 'react-hot-toast';

interface Penduduk {
  id: string;
  nik: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: Date;
  jenisKelamin: string;
  pekerjaan: string;
  kk: {
    dusun?: string;
    alamat: string;
  };
}

interface PendudukTableProps {
  penduduk: Penduduk[];
  totalCount: number;
  currentPage: number;
  perPage: number;
  searchParams: {
    search?: string;
    dusun?: string;
  };
}

export default function PendudukTable({
  penduduk,
  totalCount,
  currentPage,
  perPage,
  searchParams,
}: PendudukTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const skip = (currentPage - 1) * perPage;
  const totalPages = Math.ceil(totalCount / perPage);

  // Handle individual checkbox toggle
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    setSelectAllPages(false); // Reset select all pages if individual toggle
  };

  // Handle select all on current page
  const toggleSelectAll = () => {
    if (selectAllPages) {
      // If all pages selected, unselect all
      setSelectedIds(new Set());
      setSelectAllPages(false);
    } else if (selectedIds.size === penduduk.length) {
      // If current page selected, unselect current page
      setSelectedIds(new Set());
    } else {
      // Select current page
      setSelectedIds(new Set(penduduk.map((p) => p.id)));
    }
  };

  // Handle select all across all pages
  const handleSelectAllPages = async () => {
    setIsDeleting(true);
    try {
      // Build query params for filtering
      const params = new URLSearchParams();
      if (searchParams.search) params.append('search', searchParams.search);
      if (searchParams.dusun) params.append('dusun', searchParams.dusun);
      
      // Fetch all IDs matching current filters
      const response = await fetch(`/api/admin/penduduk/ids?${params}`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      
      const data = await response.json();
      setSelectedIds(new Set(data.ids));
      setSelectAllPages(true);
      toast.success(`${data.ids.length} data penduduk dipilih`);
    } catch (error) {
      console.error('Error fetching all IDs:', error);
      toast.error('Gagal memilih semua data');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/admin/penduduk/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menghapus data');
      }

      toast.success(`Berhasil menghapus ${selectedIds.size} data penduduk`);
      setSelectedIds(new Set());
      setSelectAllPages(false);
      setShowDeleteModal(false);
      
      // Reload page to refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting penduduk:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus data');
    } finally {
      setIsDeleting(false);
    }
  };

  const allCurrentPageSelected = selectedIds.size === penduduk.length && penduduk.length > 0;
  const someSelected = selectedIds.size > 0;

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allCurrentPageSelected || selectAllPages}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  NIK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  TTL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  L/P
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Dusun / Alamat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pekerjaan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {penduduk.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                    Tidak ada data penduduk
                  </td>
                </tr>
              ) : (
                penduduk.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-900">
                      {p.nik}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {p.nama}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {p.tempatLahir}, {formatDate(p.tanggalLahir, 'dd/MM/yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {p.jenisKelamin === 'LAKI_LAKI' ? 'L' : 'P'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {p.kk.dusun || p.kk.alamat || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.pekerjaan}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm space-x-3">
                      <Link
                        href={`/admin/penduduk/${p.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={p.id} name={p.nama} type="penduduk" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Select All Pages Banner */}
        {allCurrentPageSelected && !selectAllPages && totalCount > perPage && (
          <div className="border-t border-gray-200 bg-blue-50 px-6 py-2 text-sm">
            <span className="text-blue-900">
              {penduduk.length} data di halaman ini dipilih.{' '}
            </span>
            <button
              onClick={handleSelectAllPages}
              disabled={isDeleting}
              className="font-semibold text-blue-600 hover:text-blue-800 underline"
            >
              Pilih semua {totalCount} data penduduk
            </button>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {someSelected && (
          <div className="border-t border-gray-200 bg-blue-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-blue-900">
                {selectAllPages 
                  ? `Semua ${selectedIds.size} penduduk dipilih` 
                  : `${selectedIds.size} penduduk dipilih`}
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Hapus Terpilih
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
            <div className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">{skip + 1}</span> -{' '}
              <span className="font-medium">{Math.min(skip + perPage, totalCount)}</span> dari{' '}
              <span className="font-medium">{totalCount}</span> data
            </div>
            <div className="flex space-x-2">
              {currentPage > 1 && (
                <Link
                  href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage - 1) })}`}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage + 1) })}`}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Penghapusan</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus {selectedIds.size} data penduduk?
                </p>
              </div>
            </div>
            <p className="text-sm text-red-600 mb-6">
              ⚠️ Tindakan ini tidak dapat dibatalkan!
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
