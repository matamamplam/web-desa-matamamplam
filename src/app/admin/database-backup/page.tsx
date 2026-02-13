'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function DatabaseBackupPage() {
  const [loading, setLoading] = useState(false);

  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      toast.loading('Membuat backup database...', { id: 'backup' });

      const response = await fetch('/api/admin/backup');

      if (!response.ok) {
        throw new Error('Failed to create backup');
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `backup_${Date.now()}.json`;

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Backup berhasil dibuat dan diunduh!', { id: 'backup' });
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Gagal membuat backup', { id: 'backup' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📦 Backup Database
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Buat backup lengkap database untuk keamanan data
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                ℹ️ Informasi Backup
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Backup mencakup seluruh data database dalam format JSON</li>
                <li>• File backup akan otomatis terunduh ke komputer Anda</li>
                <li>• Simpan file backup di tempat yang aman</li>
                <li>• Direkomendasikan untuk backup secara berkala</li>
              </ul>
            </div>

            {/* Action Section */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-12 h-12 text-blue-600 dark:text-blue-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Buat Backup Baru
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Klik tombol di bawah untuk membuat backup database
                </p>
              </div>

              <button
                onClick={handleCreateBackup}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg 
                      className="animate-spin h-5 w-5" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Membuat Backup...
                  </>
                ) : (
                  <>
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                      />
                    </svg>
                    Buat Backup Sekarang
                  </>
                )}
              </button>
            </div>

            {/* Warning Section */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                ⚠️ Penting
              </h3>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                <li>• Jangan bagikan file backup kepada pihak yang tidak berwenang</li>
                <li>• File backup berisi data sensitif termasuk password (ter-hash)</li>
                <li>• Simpan di lokasi yang aman dan terenkripsi jika memungkinkan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
