
import { prisma } from "../src/lib/prisma";
import slugify from "slugify";

// --- DUMMY DATA --- //

const GALLERY_CATEGORIES = [
  "Kegiatan Desa",
  "Pemandangan Alam",
  "Fasilitas Umum",
  "Seni & Budaya"
];

const GALLERY_ITEMS = [
  {
    title: "Panen Raya Padi 2025",
    description: "Kegiatan panen raya padi bersama Bapak Bupati di area persawahan Dusun Cot.",
    category: "Kegiatan Desa",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1625246333195-092996d93616?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Keindahan Sungai Mamplam",
    description: "Sungai jernih yang melintasi desa, potensi wisata air.",
    category: "Pemandangan Alam",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Gedung Serbaguna Baru",
    description: "Gedung serbaguna yang baru selesai dibangun untuk kegiatan masyarakat.",
    category: "Fasilitas Umum",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
  }
];

// --- MAIN FUNCTION --- //

async function main() {
  console.log("Starting Seed Process for Gallery...");

  // 1. Seed Gallery Categories
  console.log("Seeding Gallery Categories...");
  for (const name of GALLERY_CATEGORIES) {
    const slug = slugify(name, { lower: true, strict: true });
    await prisma.galleryCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug }
    });
  }
  
  const categories = await prisma.galleryCategory.findMany();

  // 2. Seed Gallery Items
  console.log("Seeding Gallery Items...");
  for (const item of GALLERY_ITEMS) {
    const cat = categories.find(c => c.name === item.category);
    if (cat) {
       const exists = await prisma.galleryItem.findFirst({ where: { title: item.title } });
       if (!exists) {
         await prisma.galleryItem.create({
           data: {
             title: item.title,
             description: item.description,
             categoryId: cat.id,
             mediaType: item.mediaType as any,
             mediaUrl: item.mediaUrl
           }
         });
       }
    }
  }

  console.log("Gallery Seeding Completed.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
