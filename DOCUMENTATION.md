# Dokumentasi Lengkap Sistem Informasi Desa (SID) Mata Mamplam

Dokumentasi ini mencakup panduan lengkap seluruh fitur yang ada pada Website Gampong Mata Mamplam beserta cara penggunaannya. Sistem ini dirancang untuk memfasilitasi kebutuhan publik (warga) dan kebutuhan administratif (aparatur desa).

---

## DAFTAR ISI
1. [Fitur Halaman Publik (Front-End)](#1-fitur-halaman-publik-front-end)
2. [Fitur Admin Panel (Back-End)](#2-fitur-admin-panel-back-end)
3. [Panduan Penggunaan Fitur Utama (Bagi Admin)](#3-panduan-penggunaan-fitur-utama-bagi-admin)
4. [Panduan Teknis (Untuk Pengembang)](#4-panduan-teknis-untuk-pengembang)

---

## 1. FITUR HALAMAN PUBLIK (FRONT-END)
Halaman publik adalah antarmuka yang dapat diakses oleh siapa saja (warga dan masyarakat umum) tanpa perlu melakukan login.

1. **Beranda (Landing Page)**: Menampilkan informasi utama, statistik penduduk, berita terbaru, UMKM pilihan, dan akses cepat layanan.
2. **Profil Desa (Tentang Kami)**: Menyajikan informasi Sejarah Desa, Visi & Misi, Maksud & Tujuan, dan Demografi kependudukan.
3. **Struktur Organisasi**: Menampilkan bagan hierarkis pemerintahan gampong (Keuchik, Sekdes, Kepala Dusun, dll).
4. **Berita & Pengumuman**: Daftar artikel berita desa dan pengumuman penting bagi warga.
5. **UMKM (Usaha Mikro Kecil Menengah)**: Etalase digital untuk mempromosikan produk-produk usaha milik warga asli gampong lengkap dengan lokasi (Maps) dan kontak penjual.
6. **Portal Tanggap Bencana**: Fitur publik vital saat terjadi bencana. Menampilkan:
   - Info Cuaca & Gempa terkini (Integrasi data BMKG).
   - Data Posko Pengungsian yang sedang aktif.
   - Statistik Warga Terdampak dan Kondisi mereka.
   - Peta Lokasi Posko.
7. **Layanan & Pengaduan**: Formulir untuk warga mengirimkan pesan, saran, atau pengaduan langsung ke pihak kantor desa.

---

## 2. FITUR ADMIN PANEL (BACK-END)
Dashboard Admin diakses melalui URL `/admin` dan memerlukan *Login* menggunakan akun yang memiliki hak akses (Superadmin, Keuchik, Sekdes, Operator, dll).

Berikut adalah daftar lengkap fitur yang ada di Admin Panel:

### A. Core Master Data
1. **Administrasi Penduduk**: Modul untuk mendata seluruh warga. Terdiri dari pengelolaan **Kartu Keluarga (KK)** (Daftar No KK, Alamat, Kepala Keluarga) dan **Data Penduduk** (NIK, Nama Lengkap, Agama, Pekerjaan, Pendidikan, Status Keluarga, dll).
2. **Struktur Organisasi**: Modul untuk mengatur siapa saja yang menjabat sebagai aparatur desa. Data dari sini otomatis membentuk Bagan Organisasi di halaman publik.

### B. Layanan & Administrasi
3. **Layanan Surat Online**: Fitur administrasi otomatis pembuatan surat (SKDU, SKTM, Pengantar, dll).
   - **Template Surat**: Admin bisa membuat/mengedit format surat dinamis.
   - **Daftar Permohonan**: Melacak pengajuan surat, melakukan persetujuan (*Approval*), dan otomatis *Generate PDF* surat ber-Kop resmi yang disertai *QR Code* keabsahan surat.
4. **Bantuan Sosial (Bansos)**: Modul untuk mendata dan mengelola program bantuan dari pemerintah (BLT, PKH) beserta daftar warga yang menjadi penerima manfaat.
5. **Pembangunan Desa**: Dokumentasi proyek pembangunan gampong. Mencatat nama proyek, anggaran (RAB), persentase progres, dan dokumentasi foto 'Sebelum-Sesudah' (Before-After).

### C. Manajemen Konten
6. **Berita**: Modul untuk menulis artikel, kegiatan desa, dan pengumuman. Dilengkapi editor teks (*Rich Text*), kategori berita, dan gambar *thumbnail*.
7. **Katalog UMKM**: Menginput data usaha warga, kategori usaha, kontak pemilik, lokasi, dan foto produk umkm.
8. **Pengaduan Masyarakat**: Kotak masuk pengaduan warga. Admin dapat merespon (menjawab) dan mengubah status pengaduan (Sedang Diproses -> Selesai).
9. **Galeri**: Manajemen foto dan video kegiatan di gampong.

### D. Manajemen Bencana (Disaster Management)
10. **Kejadian Bencana**: Mencatat saat terjadi bencana (Banjir, Gempa, dll).
11. **Posko Pengungsian**: Mendata titik evakuasi, kapasitas tampung, PIC posko, dan koordinasi lokasi (Google Maps).
12. **Korban Terdampak**: Mendata kondisi warga spesifik (Aman, Mengungsi, Luka-luka, Hilang, Meninggal) dan penempatan mereka di posko mana.
13. **Kerusakan Infrastruktur**: Melaporkan data rumah/fasilitas umum yang rusak ringan, sedang, berat, hingga rusak total.
14. **Logistik**: Mengelola stok bantuan (Makanan, Obat, Pakaian) dan mencatat transaksi barang logistik masuk/keluar di tiap posko.

### E. Konfigurasi Sistem
15. **Pengaturan Situs**: Modul sentral untuk mengubah tampilan website *tanpa coding*.
    - **Umum**: Ubah Nama Situs, Tagline, Hero Background.
    - **Branding**: Upload Logo Utama, Favicon, dan Logo Kop Surat PDF.
    - **Kontak & Lokasi**: Update No WA, Email, dan Embed Google Maps wilayah desa.
    - **Profil Desa**: Update teks Visi, Misi, Sejarah, dan Wilayah.
    - **FAQ**: Menambah/hapus daftar Pertanyaan yang Sering Diajukan.
16. **Database Backup**: Fitur sekali klik untuk mem-backup seluruh data penting dari database menjadi format file untuk keamanan data.

---

## 3. PANDUAN PENGGUNAAN FITUR UTAMA (BAGI ADMIN)

### 3.1. Cara Mengelola Pengaturan Situs (Site Settings)
Semua tampilan identitas website dapat dikelola dari `Admin Panel > Pengaturan`.
1. **Mengganti Visi Misi & Sejarah**: Buka menu Pengaturan -> Pilih tab `Profil Desa/Tentang Kami`. Edit teks menggunakan editor yang disediakan. Klik Simpan.
2. **Mengganti Kontak/WhatsApp**: Buka menu Pengaturan -> Pilih tab `Kontak`. Masukkan nomor WA (gunakan format 628xxx). Ini akan memperbarui tombol "Chat WA" di seluruh website.
3. **Mengganti Logo / Kop Surat**: Buka menu Pengaturan -> Pilih tab `Branding`. Upload logo baru untuk website maupun khusus untuk stempel Kop Surat aplikasi pencetak surat PDF.

### 3.2. Cara Membuat & Memproses Layanan Surat
1. Buka menu `Layanan Surat > Daftar Permohonan`.
2. Klik tombol **Buat Surat Baru**.
3. Cari warga berdasarkan **NIK** atau **Nama**. Data identitas (Tempat Lahir, Pekerjaan, dll) akan terisi otomatis dari Database Penduduk.
4. Pilih **Jenis Surat** (misal: Surat Keterangan Tidak Mampu / SKTM).
5. Isi keperluan/tujuan surat.
6. Klik **Proses/Setujui** surat. Sistem akan mengenerate dokumen PDF secara realtime.
7. Surat PDF siap diunduh dan dicetak, lengkap berserta QR Code Tracking.

### 3.3. Cara Menginput Data Tanggap Bencana
Jika terjadi musibah, admin dapat mengaktifkan sistem bencana:
1. Buka menu `Bencana > Kejadian Bencana`. Klik **Tambah Bencana**. Isi nama bencana (Misal: Banjir Bandang 2026), lalu aktifkan.
2. Buka sub-menu `Posko Bencana`. Buat posko-posko pengungsian di titik-titik aman.
3. Buka sub-menu `Data Terdampak`. Masukkan nama-nama warga, lalu set statusnya (misal: "Mengungsi" di "Posko A").
4. Sistem otomatis akan menampilkan statistik bencana tersebut secara realtime di halaman Publik agar masyarakat dan donatur tahu kondisi terkini.

### 3.4. Cara Memasukkan UMKM Gampong
1. Buka menu `UMKM > Daftar UMKM`.
2. Klik **Tambah UMKM**.
3. Isi informasi nama UMKM, deskripsi usaha, kategori (Kuliner, Jasa, dll), dan Nama Pemilik.
4. (Penting) Isi "Nomor WA Pemilik" agar calon pembeli di web bisa langsung mengklik tombol Chat ke pemilk usaha.
5. Upload foto-foto produk (bisa lebih dari 1 foto).
6. Simpan. UMKM akan otomatis tampil pada slider di Halaman Depan.

### 3.5. Cara Mengubah Struktur Organisasi Pemerintahan
1. Buka menu `Struktur Organisasi`.
2. Untuk menambah jabatan baru, pastikan role/posisi sudah tersedia di Sistem.
3. Edit data Pejabat yang sedang menjabat dengan klik icon Pensil (Edit) pada orang tersebut.
4. Ubah Nama, upload Foto Pejabat terbaru, dan update Status Aktif.
5. Perubahan otomatis menyesuaikan ukuran bagan (garis hierarki) di halaman Halaman Front-end `/struktur-organisasi`.

### 3.6. Cara Melakukan Backup Database
1. Buka menu `Database Backup` di sidebar kiri bawah.
2. Klik tombol **"Buat Backup Sekarang"**.
3. Sistem akan memproses download file `.json` yang berisi keseluruhan data gampong (Penduduk, Surat, Berita, dll). Simpan file tersebut dengan aman.

---

## 4. PANDUAN TEKNIS (UNTUK PENGEMBANG)

### A. Struktur Folder Utama
- `src/app/(public)/*` : Berisi halaman-halaman yang dapat diakses publik (Front-end pengunjung).
- `src/app/admin/*` : Berisi halaman-halaman antarmuka Dashboard Admin (CMS).
- `src/app/api/*` : Berisi endpoint API NextJS backend.
- `src/components/*` : Berisi komponen UI React yang dapat digunakan ulang (Reusable Components).
- `prisma/schema.prisma` : Berisi desain skema database PostgreSQL secara keseluruhan.

### B. Deployment & Database
Website di-deploy menggunakan platform **Vercel** dengan Database PostgreSQL (misal: Supabase/Neon).
- Untuk menjalankan web di kumpoter lokal: `npm run dev`.
- Untuk memperbarui database struktur jika ada perubahan schema: `npx prisma db push` atau `npx prisma migrate dev`.
- Untuk mereset pengaturan ke standar pabrik, jalankan seed: `node prisma/seed-settings.js`.

### C. Caching Mechanism (Perhatian! Data tidak langsung berubah?)
Website ini menggunakan arsitektur agresif *Caching* milik NextJS 14 demi performa yang sangat cepat.
- **Data Statis**: Seperti Profil dan Berita, di-cache dengan waktu tertentu (Revalidate 300 - 3600 detik). Jika Admin merubah artikel, perubahan mungkin muncul di publik beberapa menit kemudian.
- **Data Dinamis**: Seperti Layanan Bencana dan Surat didesain _realtime_ (cache/revalidate: 0) sehingga akan secara instan berubah ketika admin menekan tombol Save.
- Pada Admin Panel, jika menemui anomali tampilan, disarankan melakukan Hard-Refresh (Ctrl+F5).
