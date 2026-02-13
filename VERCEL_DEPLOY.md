# 🚀 Deployment Instructions - Vercel

## Langkah-langkah Deploy ke Vercel

### 1️⃣ Setup Environment Variables di Vercel

1. **Buka Vercel Dashboard**:
   - Go to: https://vercel.com/dashboard
   - Pilih project yang sedang di-deploy
   - Go to: **Settings** → **Environment Variables**

2. **Tambahkan Environment Variables** berikut:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.rjwyazisrouqiahdgeqs:mata_mamplam_2026@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=2` | Production, Preview, Development |
| `DIRECT_URL` | `postgresql://postgres.rjwyazisrouqiahdgeqs:mata_mamplam_2026@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres` | Production, Preview, Development |
| `NEXTAUTH_URL` | **REPLACE dengan domain production Anda**<br>(contoh: `https://desa-matamamplam.vercel.app`) | Production |
| `NEXTAUTH_SECRET` | **GENERATE BARU!**<br>Jalankan: `openssl rand -base64 32` | Production, Preview, Development |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dsgizpjxr` | Production, Preview, Development |
| `CLOUDINARY_API_KEY` | `879737839349843` | Production, Preview, Development |
| `CLOUDINARY_API_SECRET` | `o0_o0-IyRS8NIzBdkn-Plk_ESW8` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_NAME` | `SID Mata Mamplam` | Production, Preview, Development |
| `NEXT_PUBLIC_VILLAGE_NAME` | `Desa Mata Mamplam` | Production, Preview, Development |
| `NEXT_PUBLIC_DISTRICT` | `Kecamatan Peusangan` | Production, Preview, Development |
| `NEXT_PUBLIC_REGENCY` | `Kabupaten Bireuen` | Production, Preview, Development |
| `NEXT_PUBLIC_PROVINCE` | `Provinsi Aceh` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

> [!IMPORTANT]
> **WAJIB UPDATE:**
> - ✅ `NEXTAUTH_URL` → Ganti dengan domain Vercel production Anda
> - ✅ `NEXTAUTH_SECRET` → Generate baru untuk security
> 
> **Cara Generate NEXTAUTH_SECRET:**
> ```bash
> openssl rand -base64 32
> ```
> Copy output dan paste ke Vercel Environment Variables

> [!WARNING]
> **PENTING: `connection_limit=1` untuk Production**
> 
> Perhatikan bahwa `DATABASE_URL` di production menggunakan `connection_limit=1` (berbeda dengan lokal yang `connection_limit=10`).
> 
> **Kenapa?**
> - Vercel build process spawn banyak parallel requests
> - Connection pool limit rendah mencegah timeout
> - ISR (Incremental Static Regeneration) mengurangi beban database

---

### 2️⃣ Push Code ke Repository

Pastikan semua perubahan sudah di-commit dan push:

```bash
git add .
git commit -m "fix: optimize production build for Vercel deployment"
git push origin main
```

---

### 3️⃣ Trigger Deployment

**Option A: Auto Deploy (Recommended)**
- Vercel akan otomatis deploy setelah Anda push ke branch main

**Option B: Manual Redeploy**
1. Buka Vercel Dashboard → Deployments
2. Klik "..." pada deployment terakhir
3. Klik **"Redeploy"**
4. Pilih **"Redeploy with existing Build Cache"** atau **"Redeploy from scratch"**

---

### 4️⃣ Monitor Build Process

1. **Buka Build Logs**:
   - Vercel Dashboard → Deployments → Latest Deployment → **Build Logs**

2. **Check untuk Error**:
   - ❌ **SEBELUMNYA**: Akan muncul `PrismaClientKnownRequestError`
   - ✅ **SEKARANG**: Seharusnya tidak ada error Prisma
   - ✅ **Log yang benar**: 
     ```
     ✓ Collecting page data
     ✓ Generating static pages
     ✓ Finalizing page optimization
     ```

3. **Jika masih ada error**:
   - Screenshot error log
   - Pastikan semua environment variables sudah benar
   - Check connection string tidak ada typo

---

### 5️⃣ Verify Deployment

Setelah deployment selesai:

1. **✅ Check Homepage**:
   - Buka production URL
   - **Hero Background**: Harus terlihat gambar background (jika sudah di-set di admin)
   - **Jika belum set**: Akan tampil gradient fallback (biru-ungu)

2. **✅ Check Map Section**:
   - Scroll ke bawah sampai section "Lokasi Desa"
   - **Map**: Harus tampil Google Maps embed (jika sudah di-set di admin)
   - **Jika belum set**: Akan tampil fallback "Peta Belum Tersedia"

3. **✅ Check Console (F12)**:
   - Buka Developer Tools (F12) → Console
   - Seharusnya tidak ada error merah
   - Boleh ada warning kuning (tidak masalah)

4. **✅ Check Network Tab**:
   - Developer Tools → Network tab
   - Reload page (Ctrl+Shift+R)
   - Check tidak ada failed requests (status 404/500)

5. **✅ Test ISR (Data Refresh)**:
   - Wait 60 detik
   - Hard refresh (Ctrl+Shift+R)
   - Data dari database seharusnya ter-update

---

## 🔧 Troubleshooting

### Problem: Masih ada Prisma Error di Build Log

**Solution:**
1. Check `DATABASE_URL` di Vercel environment variables
2. Pastikan ada `&connection_limit=1` di akhir URL
3. Redeploy from scratch (hapus build cache)

---

### Problem: Background Image Tidak Muncul

**Possible Causes:**
1. **Belum di-set di Admin Panel**
   - Login ke `/admin/settings`
   - Upload hero background image
   - Save settings

2. **Cloudinary Configuration**
   - Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` sudah benar
   - Check image URL valid di database

3. **Next.js Image Optimization**
   - Check build logs untuk image optimization errors
   - Fallback: gradient background akan tampil

---

### Problem: Map Tidak Muncul

**Possible Causes:**
1. **Belum di-set di Admin Panel**
   - Login ke `/admin/settings`
   - Isi Google Maps Embed URL
   - Save settings

2. **Invalid Embed URL**
   - Pastikan menggunakan **embed URL**, bukan share URL
   - Format: `https://www.google.com/maps/embed?pb=...`

---

## ✅ Success Checklist

Deployment berhasil jika:

- [x] Build logs tidak ada Prisma error
- [x] Production site bisa diakses
- [x] Hero section tampil (dengan background atau gradient)
- [x] Map section tampil (dengan map atau fallback)
- [x] No console errors di browser
- [x] Page load time < 3 detik
- [x] All functionality works (login, CRUD, etc)

---

## 📝 Changes Made

Summary perubahan yang sudah dilakukan:

1. **✅ Database Connection Optimization**
   - Created Prisma singleton pattern (`src/lib/singleton.ts`)
   - Set `connection_limit=1` untuk production
   - Added connection pool management

2. **✅ Error Handling & Fallbacks**
   - `getPublicSettings()`: Return default settings instead of null
   - `getData()`: Complete fallback structure
   - Components: Graceful degradation when data missing

3. **✅ Next.js Configuration**
   - Added `output: 'standalone'` for optimal Vercel deployment
   - Maintained CPU/worker limits for build stability

4. **✅ Component Improvements**
   - `HeroSection`: Image error handling + unoptimized fallback
   - `VillageMap`: Iframe error handling
   - Better console logging for debugging

5. **✅ Data Fetching Optimization (New!)**
   - **Sequencing**: Settings fetched first (critical), then others in parallel
   - **Retry Logic**: `getPublicSettings` auto-retries 3x on failure
   - **Impact**: Reduces initial DB load and handles transient connection errors

7. **✅ Environment Setup**
   - Created `.env.production` template
   - Documented all required variables
   - Added deployment instructions

8. **✅ Build Optimization**
   - Excluded `scripts/` from `tsconfig.json` to prevent build failures from dev tools
   - Verified local build passed with `npm run build`
   - Ensured `output: 'standalone'` is set correctly
