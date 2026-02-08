
import { prisma } from "../src/lib/prisma";
import slugify from "slugify";
import bcrypt from "bcryptjs";

// --- DUMMY DATA --- //

const NEWS_DATA = [
  {
    title: "Penyaluran BLT Dana Desa Tahap I Tahun 2026",
    category: "Berita Desa",
    status: "PUBLISHED",
    excerpt: "Pemerintah Desa Mata Mamplam kembali menyalurkan Bantuan Langsung Tunai (BLT) Dana Desa kepada 50 KPM.",
    content: "<p>Pemerintah Desa Mata Mamplam kembali menyalurkan <strong>Bantuan Langsung Tunai (BLT)</strong> Dana Desa tahap I tahun 2026. Kegiatan ini dilaksanakan di Aula Kantor Keuchik pada hari Senin, 2 Februari 2026.</p><p>Sebanyak 50 Keluarga Penerima Manfaat (KPM) menerima bantuan tunai sebesar Rp 300.000,- per bulan.</p>",
    thumbnail: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Jadwal Posyandu Balita dan Lansia Bulan Februari",
    category: "Pengumuman",
    status: "PUBLISHED",
    excerpt: "Diberitahukan kepada seluruh warga masyarakat bahwa kegiatan Posyandu akan dilaksanakan pada tanggal 10 Februari.",
    content: "<p>Kegiatan <strong>Posyandu Balita dan Lansia</strong> akan dilaksanakan pada tanggal 10 Februari 2026 di Polindes.</p>",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000"
  },
   {
    title: "Gotong Royong Membersihkan Saluran Irigasi",
    category: "Kegiatan",
    status: "PUBLISHED",
    excerpt: "Warga Desa Mata Mamplam antusias mengikuti gotong royong membersihkan saluran irigasi persawahan.",
    content: "<p>Puluhan warga Desa Mata Mamplam antusias mengikuti kegiatan <em>gotong royong</em> membersihkan saluran irigasi persawahan.</p>",
    thumbnail: "https://images.unsplash.com/photo-1589923188900-a58303cbc0b9?auto=format&fit=crop&q=80&w=1000"
  },
];

const PROJECTS_DATA = [
  {
    title: "Pembangunan Saluran Drainase Dusun Cot",
    description: "Pembangunan saluran drainase sepanjang 500 meter untuk mencegah banjir di musim hujan.",
    budget: 150000000,
    progress: 75,
    status: "IN_PROGRESS",
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-03-30"),
    location: "Dusun Cot, Desa Mata Mamplam",
    photoBefore: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000",
    photoAfter: ""
  },
  {
    title: "Rehabilitasi Jalan Usaha Tani",
    description: "Perbaikan jalan usaha tani untuk memudahkan akses petani mengangkut hasil panen.",
    budget: 85000000,
    progress: 100,
    status: "COMPLETED",
    startDate: new Date("2025-11-01"),
    endDate: new Date("2025-12-20"),
    location: "Area Persawahan Blok A",
    photoBefore: "https://images.unsplash.com/photo-1518115654-e0e64c3c3aab?auto=format&fit=crop&q=80&w=1000",
    photoAfter: "https://images.unsplash.com/photo-1505568113887-1959828d0b28?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Pembangunan Poskamling Dusun Meunasah",
    description: "Pembangunan pos keamanan lingkungan untuk meningkatkan keamanan warga.",
    budget: 25000000,
    progress: 0,
    status: "PLANNING",
    startDate: new Date("2026-03-01"),
    endDate: null,
    location: "Simpang Tiga Dusun Meunasah",
    photoBefore: "",
    photoAfter: ""
  }
];

const UMKM_CATEGORIES = [
  "Makanan & Minuman",
  "Kerajinan Tangan",
  "Fashion & Pakaian",
  "Jasa",
  "Pertanian & 	Peternakan"
];

const UMKM_DATA = [
  {
    name: "Keripik Pisang Maknyus",
    category: "Makanan & Minuman",
    description: "Keripik pisang renyah dengan berbagai varian rasa: coklat, balado, keju.",
    ownerName: "Ibu Nurhayati",
    ownerPhone: "081234567890",
    address: "Dusun Cot, No. 12",
    logo: "https://images.unsplash.com/photo-1599639668351-8b27593c6f05?auto=format&fit=crop&q=80&w=1000"
  },
  {
    name: "Anyaman Tikar Tradisional",
    category: "Kerajinan Tangan",
    description: "Tikar anyaman pandan berkualitas tinggi, awet dan artistik.",
    ownerName: "Pak Yusuf",
    ownerPhone: "085277889900",
    address: "Dusun Meunasah",
    logo: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1000"
  }
];

const STRUCTURE_DATA = [
  // Level 1: Pimpinan Tertinggi
  { level: 1, key: 'KEUCHIK', name: 'Keuchik Gampong', category: 'LEADERSHIP', official: 'Taufiq, ST' },
  
  // Level 2: Badan Permusyawaratan & Keagamaan
  { level: 2, key: 'TUHA_PEUT', name: 'Ketua Tuha Peut', category: 'ADVISORY', official: 'H. Ismail' },
  { level: 2, key: 'IMUM_MEUNASAH', name: 'Imum Meunasah', category: 'RELIGIOUS', official: 'Tgk. H. Abdullah' },
  
  // Level 3: Lembaga Kemasyarakatan
  { level: 3, key: 'KETUA_PKK', name: 'Ketua PKK', category: 'INSTITUTION', official: 'Hj. Fatimah' },
  { level: 3, key: 'KETUA_PEMUDA', name: 'Ketua Pemuda', category: 'INSTITUTION', official: 'Rizki Pratama' },

  // Level 4: Sekretariat
  { level: 4, key: 'SEKDES', name: 'Sekretaris Desa', category: 'SECRETARIAT', official: 'Sarah Amalia, S.Pd' },
  { level: 4, key: 'KAUR_TU', name: 'Kaur Tata Usaha & Umum', category: 'KAUR', official: 'Rahmat Hidayat' },
  { level: 4, key: 'KAUR_KEU', name: 'Kaur Keuangan', category: 'KAUR', official: 'Dewi Sartika' },
  { level: 4, key: 'KAUR_PER', name: 'Kaur Perencanaan', category: 'KAUR', official: 'Budi Santoso' },

  // Level 5: Kepala Seksi
  { level: 5, key: 'KASI_PEM', name: 'Kasi Pemerintahan', category: 'KASI', official: 'Faisal Reza' },
  { level: 5, key: 'KASI_KES', name: 'Kasi Kesejahteraan', category: 'KASI', official: 'Siti Aminah' },
  { level: 5, key: 'KASI_PEL', name: 'Kasi Pelayanan', category: 'KASI', official: 'Ahmad Zulfikar' },

  // Level 6: Kepala Dusun
  { level: 6, key: 'DUSUN_COT', name: 'Kepala Dusun Cot', category: 'DUSUN', dusun: 'Dusun Cot', official: 'M. Nasir' },
  { level: 6, key: 'DUSUN_MEUNASAH', name: 'Kepala Dusun Meunasah', category: 'DUSUN', dusun: 'Dusun Meunasah', official: 'Zulkifli' },
];

// --- MAIN FUNCTION --- //

async function main() {
  console.log("Starting Seed Process...");

  // 1. Setup Admin User (Required for Authorship)
  let admin = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });
  
  if (!admin) {
    console.log("No SUPERADMIN found. Creating default Super Admin...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    admin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "admin@desa.id",
        password: hashedPassword,
        role: "SUPERADMIN",
        isActive: true,
        nik: "1101010000000001",
        phone: "081234567890"
      }
    });
    console.log("Created Default Admin: admin@desa.id / admin123");
  }

  // 2. Seed News
  console.log("Seeding News...");
  const newsCategories = await prisma.newsCategory.findMany();
  
  // Ensure categories exist if empty (fallback)
  if (newsCategories.length === 0) {
     for (const cat of ["Berita Desa", "Pengumuman", "Kegiatan", "Artikel"]) {
        await prisma.newsCategory.create({ data: { name: cat, slug: slugify(cat, { lower: true }) }});
     }
  }
  const updatedNewsCats = await prisma.newsCategory.findMany();

  for (const item of NEWS_DATA) {
    const cat = updatedNewsCats.find(c => c.name === item.category) || updatedNewsCats[0];
    const slug = slugify(item.title, { lower: true, strict: true });

    await prisma.news.upsert({
      where: { slug },
      update: {},
      create: {
        title: item.title,
        slug,
        excerpt: item.excerpt,
        content: item.content,
        thumbnail: item.thumbnail,
        status: item.status as any,
        categoryId: cat.id,
        authorId: admin.id,
        publishedAt: new Date()
      }
    });
  }

  // 3. Seed Projects
  console.log("Seeding Projects...");
  for (const item of PROJECTS_DATA) {
    // Title is not unique in schema, but we want to avoid dups for seeding.
    // We'll check by title.
    const exists = await prisma.project.findFirst({ where: { title: item.title } });
    if (!exists) {
      await prisma.project.create({
        data: {
          title: item.title,
          description: item.description,
          budget: BigInt(item.budget),
          progress: item.progress,
          status: item.status as any,
          startDate: item.startDate,
          endDate: item.endDate,
          location: item.location,
          photoBefore: item.photoBefore,
          photoAfter: item.photoAfter,
          photoGallery: []
        }
      });
    }
  }

  // 4. Seed UMKM Categories
  console.log("Seeding UMKM Categories...");
  for (const name of UMKM_CATEGORIES) {
    const slug = slugify(name, { lower: true, strict: true });
    await prisma.uMKMCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug }
    });
  }

  // 5. Seed UMKM Data (Optional but good for checking next step)
  console.log("Seeding UMKM Data...");
  const umkmCats = await prisma.uMKMCategory.findMany();
  
  const prismaAny = prisma as any; // Cast to any to bypass potential TS errors with new fields
  
  for (const item of UMKM_DATA) {
    const cat = umkmCats.find(c => c.name === item.category);
    if (cat) {
      const exists = await prismaAny.uMKM.findFirst({ where: { name: item.name } });
      if (!exists) {
        await prismaAny.uMKM.create({
          data: {
            name: item.name,
            slug: slugify(item.name, { lower: true, strict: true }),
            description: item.description,
            categoryId: cat.id,
            ownerName: item.ownerName,
            ownerPhone: item.ownerPhone,
            address: item.address,
            mapsUrl: "https://maps.google.com/?q=" + encodeURIComponent(item.address), // Dummy Map URL
            logo: item.logo,
            isActive: true
          }
        });
      }
    }
  }

  // 6. Seed Organizational Structure
  console.log("Seeding Organizational Structure...");
  
  // Use prismaAny to bypass type error if model is not detected in types yet
  // Already casted above as prismaAny

  // Clear existing data first
  console.log("Cleaning up existing structure data...");
  if (prismaAny.villageOfficial) {
    await prismaAny.villageOfficial.deleteMany({});
  }
  if (prismaAny.villageOfficialPosition) {
    await prismaAny.villageOfficialPosition.deleteMany({});
  }
  
  let sortOrderCounter = 1;
  
  for (const item of STRUCTURE_DATA) {
    // 1. Create Position
    const positionClient = prismaAny.villageOfficialPosition || prismaAny.officialPosition;
    
    if (positionClient) {
        const position = await positionClient.create({
        data: {
            category: item.category,
            positionKey: item.key,
            positionName: item.name,
            level: item.level,
            sortOrder: sortOrderCounter++,
            dusunName: item.dusun || null
        }
        });

        // 2. Create Official for this position
        const officialClient = prismaAny.villageOfficial;
        if (officialClient) {
            await officialClient.create({
                data: {
                positionId: position.id,
                name: item.official,
                phone: "0812345678" + item.level, // Dummy phone
                isActive: true,
                photo: null // No photo for dummy data, component handles fallback
                }
            });
        }
    }
  }

  console.log("Seeding Completed Successfully.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
