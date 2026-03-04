# Skenario Pengujian *Black Box* (Equivalence Partitioning & Boundary Value Analysis)
**Sistem Informasi Desa Terpadu (Web Desa Mata Mamplam)**

Dokumen ini berisi rancangan dan hasil pengujian *Black Box* untuk seluruh fitur utama pada Sistem Informasi Desa cerdas berbasis *Next.js*. Pengujian ini dilakukan untuk memastikan bahwa fungsi-fungsi sistem berjalan sesuai dengan spesifikasi dan kebutuhan fungsional (FR) yang telah ditentukan, baik dari sisi pengguna publik masyarakat maupun administrator. Format ini telah disesuaikan agar mudah diintegrasikan ke dalam artikel jurnal ilmiah (misalnya pada bab **Hasil dan Pembahasan - Pengujian Sistem**).

---

## 1. Pengujian Modul Autentikasi (Admin)
Modul ini mengelola hak akses administrator ke dalam dasbor utama menggunakan kredensial yang valid.

| No | Skenario Pengujian | Data Uji (Input) | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|-------------------|------------------|-----------------------|-----------------|--------|
| 1.1 | *Login* dengan kredensial valid (sukses) | Email: `admin@matamamplam...`<br>Password: `[password valid]` | Sistem memvalidasi kredensial, membuat sesi terenkripsi, dan mengarahkan pengguna ke halaman Dasbor Admin (`/admin`). | Sesuai Harapan | **Valid ✔** |
| 1.2 | *Login* dengan *password* salah | Email: `admin@matamamplam...`<br>Password: `salah123` | Sistem menolak akses dan menampilkan pesan *error* "Kredensial tidak valid" / "Email atau Password salah". | Sesuai Harapan | **Valid ✔** |
| 1.3 | *Login* dengan format email tidak valid | Email: `admin#matamamplam`<br>Password: `...` | Validasi *frontend* menahan *submit* form dan meminta format penulisan alamat email yang mengandung karakter "@" dan domain. | Sesuai Harapan | **Valid ✔** |
| 1.4 | Akses halaman rahasia (`/admin`) tanpa *login* | URL: `https://.../admin` (Diketik langsung di *browser*) | *Middleware* memblokir akses dan memaksa pengalihan (*redirect*) pengguna kembali ke halaman `/auth/login`. | Sesuai Harapan | **Valid ✔** |
| 1.5 | Pemulihan kata sandi (*Forgot Password*) email terdaftar | Email: `admin@matamamplam...` | Sistem mengirimkan *link* atau instruksi _reset password_ ke alamat surel terkait jika server SMTP terkonfigurasi aktif. | Sesuai Harapan | **Valid ✔** |

## 2. Pengujian Modul Layanan Administrasi (Surat Menyurat)
Modul ini memungkinkan masyarakat desa untuk memohon surat pengantar secara mandiri dan mengecek status *progress*-nya.

| No | Skenario Pengujian | Data Uji (Input) | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|-------------------|------------------|-----------------------|-----------------|--------|
| 2.1 | Akses *list* templat formulir surat | Klik menu **Layanan Surat** | Sistem menampilkan daftar berbagai jenis permohonan surat administrasi desa yang tersedia (Keterangan Domisili, Tidak Mampu, dsb). | Sesuai Harapan | **Valid ✔** |
| 2.2 | Mengajukan Surat dengan Input Valid | NIK: `1111222233334444`<br>Nama: `Budi`<br>Keperluan: `Beasiswa` | Data berhasil disimpan ke pangkalan data, sistem men-*generate* kode pelacakan (*Tracking Code*/Resi), dan menampilkan halaman sukses. | Sesuai Harapan | **Valid ✔** |
| 2.3 | Mengajukan Surat tanpa mengisi fild *Required* | NIK: `[Kosong]`<br>Nama: `[Kosong]` | Sistem tidak memproses klik tombol *Submit*, melainkan menampilkan notifikasi "Field ini wajib diisi" (*Form HTML5 Validation*). | Sesuai Harapan | **Valid ✔** |
| 2.4 | Pengecekan Status Surat (Resi Valid) | Input Kode Pelacakan (Resi): `SURAT-123XYZ` | Sistem mengambil data dari layanan dan memunculkan panel informatif tentang proges pengajuan surat (Menunggu, Diproses, Selesai). | Sesuai Harapan | **Valid ✔** |
| 2.5 | Pengecekan Status Surat (Resi Tidak Ada) | Input Kode Pelacakan (Resi): `INVALID-404` | Sistem memberikan balasan berupa _state_ kosong atau *alert* bahwa data surat tidak ditemukan dalam *database*. | Sesuai Harapan | **Valid ✔** |

## 3. Pengujian Modul Layanan Pengaduan Masyarakat
Fitur yang secara transparan menyalurkan laporan atau aspirasi masyarakat menuju sistem balai desa.

| No | Skenario Pengujian | Data Uji (Input) | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|-------------------|------------------|-----------------------|-----------------|--------|
| 3.1 | Pembuatan Laporan Pengaduan Valid | NIK: `1111222233334444`<br>Kategori: `Fasilitas`<br>Judul: `Lampu Jalan Padam` | Notifikasi sukses dikirimkan, lalu basis data diperbarui untuk mencatat tiket aduan masuk yang bisa dikelola Admin. | Sesuai Harapan | **Valid ✔** |
| 3.2 | *Upload Error Boundary* (File terlalu besar) | Lampiran file gambar `.jpg` dengan ukuran melebihi batas batas wajar (misalnya > 5 MB) | Frontend menolak unggahan sebelum merusak memori, sistem akan menampilkan _toast_ peringatan ukuran berkas. | Sesuai Harapan | **Valid ✔** |

## 4. Pengujian Modul Transparansi & Publikasi Teras Desa
Fungsi esensial yang menghubungkan sistem integrasi publik, seperti Modul Transparansi Dana, Bencana dan UMKM

| No | Skenario Pengujian | Data Uji (Input) | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|-------------------|------------------|-----------------------|-----------------|--------|
| 4.1 | Pemuatan Berita (*Pagination* & *Routing*) | Klik tombol artikel "Gotong Royong" | Sistem mengubah struktur perutean menggunakan parameter URL (Slug) menuju bacaan *detail* tanpa merefresh ulang halaman sepenuhnya (*SSR/SSG*). | Sesuai Harapan | **Valid ✔** |
| 4.2 | Pemuatan API Eksternal (Widget Cuaca/Gempa) | _Landing Page Request_ | Sistem melakukan peramalan (*fetch*) ke API BMKG & _Open-Meteo_ secara asinkronus, _widget_ berhasil _render_ UI Cuaca Terkini. | Sesuai Harapan | **Valid ✔** |
| 4.3 | Filter Kategori Pembangunan/Bencana | Pilih klik "Kategori Pembangunan x" | Antarmuka interaktif menyortir daftar *list* kartu proyek pembangunan per kategori tanpa merusak tatanan *Grid UI layout*. | Sesuai Harapan | **Valid ✔** |
| 4.4 | Detail Katalog Produk UMKM Desa | Klik produk UMKM Desa "Keripik Melinjo" | Muncul halaman produk tunggal lengkap dengan deskripsi, gambar dan tombol integrasi interaktif WhatsApp penjual. | Sesuai Harapan | **Valid ✔** |

## 5. Pengujian Modul CMS Interaktif Dasbor Administrator (*Back-Office*)
Modul operasi untuk pegawai gampong melakukan *Crude, Read, Update, Delete* (CRUD).

| No | Skenario Pengujian | Data Uji (Input) | Hasil yang Diharapkan | Hasil Pengujian | Status |
|----|-------------------|------------------|-----------------------|-----------------|--------|
| 5.1 | Tambah (*Create*) Data Perangkat Desa (Struktur) | Nama: `Bpk. Taufiq`, Jabatan: `Keuchik`. | Entitas *Node* pada menu Struktur Pemdes berhasil diciptakan dan merefleksikan hierarki jabatannya di _Tree Chart_ publik | Sesuai Harapan | **Valid ✔** |
| 5.2 | Tolak (*Reject/Delete*) Permohonan Surat | Pilih item permohonan "SURAT-123", klik Edit status menjadi "Ditolak / Selesai" | Status pada relasi *database* Prisma termodifikasi, masyarakat pengecek kode mendapatkan status "Ditolak/Selesai" *Real-time*. | Sesuai Harapan | **Valid ✔** |
| 5.3 | Manipulasi (*Update*) Data Pengaturan Desa | Rubah Visi & Misi, Ganti Logo Surat melalui navigasi `Settings` | Modifikasi terapkan dan menimpa *row* unik *settings* pada tabel. Logo surat akan terubah ketika membuat berkas PDF baru. | Sesuai Harapan | **Valid ✔** |
| 5.4 | Ekspor Rekapitulasi (*Download*) File | Unduh Lampiran Berkas PDF Surat Pemohon pada Dasbor | Server mensintesis format file PDF (*Print Layout*) dari templat permohonan lalu mendistribusikannya sebagai `blob` unduhan. | Sesuai Harapan | **Valid ✔** |
| 5.5 | Pemblokiran Manipulasi Injeksi Database (SQLI) | Input pencarian Admin: `‘ OR 1=1;--` | Sistem ORM Prisma mensterilisasi kueri teks menjadi parameter *safe-string* biasa, eksploitasi peretasan *bypass* tergagalkan. | Sesuai Harapan | **Valid ✔** |

---

**Kesimpulan:**
Berdasarkan matriks uji di atas yang mengandalkan teknik *Black Box Testing*, keseluruhan arsitektur antarmuka dan *backend router* pada **Sistem Informasi Web Desa Mata Mamplam** telah lulus validasi pengujian operasional standar. Sistem berfungsi optimal dengan parameter keamanan sanitasi input yang berjalan baik, validasi UX yang _responsif_, dan tidak direkomendasikan perbaikan kode berjenis *major bug* karena seluruh kasus (*Test Case*) berjalan **Sesuai Harapan (Valid)**.
