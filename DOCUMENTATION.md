# Dokumentasi Lengkap Website Gampong Mata Mamplam

Dokumentasi ini mencakup panduan pengelolaan konten, pengaturan situs, dan struktur teknis dari Website Gampong Mata Mamplam.

## 1. Pengenalan
Website ini dibangun menggunakan **Next.js 14**, **Tailwind CSS**, dan **Prisma (PostgreSQL)**. Website ini dirancang untuk memberikan informasi publik kepada warga (Profil, Berita, UMKM, Transparansi Dana) serta menyediakan layanan administrasi surat menyurat secara online.

Fitur Utama:
- **Landing Page Dinamis**: Menampilkan statistik, berita terbaru, UMKM, dan peta desa.
- **Admin Panel**: Dashboard untuk mengelola semua konten website.
- **Layanan Surat**: Pengajuan surat online oleh warga dan persetujuan oleh aparatur desa.
- **Pengaturan Situs**: Pengelolaan identitas situs, kontak, media sosial, dan FAQ tanpa coding.

---

## 2. Pengelolaan Pengaturan Situs (Site Settings)

Semua informasi dasar website dapat dikelola melalui menu **Pengaturan** di Admin Panel.

### A. Informasi Umum
Masuk ke `Admin Panel > Pengaturan > Umum`.
- **Nama Situs**: Mengubah judul website yang tampil di browser dan header.
- **Tagline**: Slogan desa.
- **Deskripsi**: Meta description untuk SEO.
- **Hero Background**: Gambar besar di halaman depan.

### B. Branding
Masuk ke `Admin Panel > Pengaturan > Branding`.
- **Logo**: Logo utama yang muncul di Header dan Footer.
- **Favicon**: Ikon kecil di tab browser.
- **Logo Kop Surat**: Logo khusus yang akan otomatis tercetak pada kop surat pdf.

### C. Kontak & Lokasi
Masuk ke `Admin Panel > Pengaturan > Kontak` atau `Geografis`.
- **Informasi Kontak**: Email, No HP, WhatsApp (untuk tombol chat), dan Alamat.
- **Peta Lokasi**: Masukkan URL Embed Google Maps untuk menampilkan peta di halaman kontak dan landing page.
- **Data Wilayah**: Luas wilayah dan batas-batas desa.

### D. FAQ (Tanya Jawab)
Menambahkan pertanyaan yang sering diajukan di Halaman Depan dan halaman FAQ.
1. Masuk ke `Admin Panel > Pengaturan > FAQ`.
2. Klik **+ Tambah FAQ**.
3. Isi **Pertanyaan** dan **Jawaban**.
4. Klik **Simpan Pengaturan**.

---

## 3. Pengelolaan Data & Konten

### A. Visi & Misi
Visi Misi ditampilkan di halaman Profil. Saat ini data Visi Misi dikelola melalui **Pengaturan Situs > Tentang Kami**.
- Anda dapat menambah poin Misi sebanyak yang dibutuhkan.
- Konten "Tentang Kami" mendukung format HTML sederhana.

### B. Berita & Artikel
Masuk ke `Admin Panel > Berita`.
- Buat berita baru dengan judul, kategori, dan gambar unggulan.
- Status **Published** akan memunculkan berita di halaman depan.

### C. UMKM
Masuk ke `Admin Panel > UMKM`.
- Tambahkan data usaha warga untuk dipromosikan di website.
- Data yang aktif akan muncul di slider halaman depan.

---

## 4. Panduan Teknis (Untuk Pengembang)

### A. Struktur Folder
- `src/app/(public)`: Halaman-halaman publik (Landing page, Profil, Berita).
- `src/app/admin`: Halaman dashboard admin.
- `src/components`: Komponen UI yang digunakan ulang (Header, Sidebar, Cards).
- `src/context`: State management (SettingsContext, SidebarContext).
- `prisma/schema.prisma`: Definisi struktur database.
- `prisma/seed-settings.js`: Script untuk mengisi data awal pengaturan situs.

### B. Modifikasi Data Dasar (Seeding)
Jika Anda perlu mereset pengaturan ke default, Anda dapat memodifikasi file `prisma/seed-settings.js`.

**Cara menjalankan seed ulang:**
```bash
node prisma/seed-settings.js
```
*Catatan: Ini akan memperbarui pengaturan jika sudah ada, atau membuatnya jika belum ada.*

### C. Deployment
Aplikasi ini siap dideploy ke **Vercel**.
1. Pastikan environment variables (`DATABASE_URL`, `NEXT_PUBLIC_BASE_URL`) terisi.
2. Build command: `next build`.
3. Install command: `npm install`.

---

## 5. Troubleshooting (Masalah Umum)

**Q: Logo atau gambar tidak muncul?**
A: Pastikan URL gambar (Cloudinary/Lokal) valid. Jika menggunakan upload lokal, pastikan file berada di folder `public`.

**Q: Perubahan di database tidak muncul di web?**
A: Next.js menggunakan *caching*. Coba refresh halaman atau tunggu beberapa saat (Revalidate time: 300-600 detik). Untuk data krusial seperti bencana, revalidate diatur ke 0 (real-time).

**Q: Sidebar Admin Error / Tidak bisa diklik?**
A: Kami baru saja memperbarui `SidebarContext`. Pastikan browser sudah di-refresh sepenuhnya (Hard Refresh: Ctrl+F5) untuk memuat script terbaru.
