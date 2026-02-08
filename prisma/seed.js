
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ============================================
  // 1. USER & AUTHENTICATION
  // ============================================
  const hashedPassword = await bcrypt.hash('kkm-matamamplam2026', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'matamamplam2026@gmail.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'matamamplam2026@gmail.com',
      password: hashedPassword,
      role: 'SUPERADMIN',
      nik: '1111111111111111',
      phone: '081234567890',
      isActive: true,
    },
  })
  console.log('✅ Created admin:', admin.email)

  /* 
  // REMOVED: Operator will be created manually by Admin
  const operator = await prisma.user.upsert({
    where: { email: 'operator@matamamplam.id' },
    update: {},
    create: {
      name: 'Operator Desa',
      email: 'operator@matamamplam.id',
      password: hashedPassword,
      role: 'OPERATOR',
      phone: '081234567891',
      isActive: true,
    },
  })
  console.log('✅ Created operator:', operator.email)
  */

  // ============================================
  // 2. LETTER TEMPLATES (RESTORED)
  // ============================================
  const letterTemplates = [
    {
      code: 'SKDU',
      name: 'Surat Keterangan Domisili Usaha',
      description: 'Surat keterangan untuk mendirikan usaha di wilayah desa',
      template: '<h1>Surat Keterangan Domisili Usaha</h1><p>Yang bertanda tangan di bawah ini, Kepala Desa Mata Mamplam...</p>',
      isActive: true,
    },
    {
      code: 'SKD',
      name: 'Surat Keterangan Domisili',
      description: 'Surat keterangan tempat tinggal',
      template: '<h1>Surat Keterangan Domisili</h1><p>Yang bertanda tangan di bawah ini...</p>',
      isActive: true,
    },
    {
      code: 'SKTM',
      name: 'Surat Keterangan Tidak Mampu',
      description: 'Surat keterangan untuk bantuan sosial',
      template: '<h1>Surat Keterangan Tidak Mampu</h1><p>Yang bertanda tangan di bawah ini...</p>',
      isActive: true,
    },
    {
      code: 'SKCK',
      name: 'Surat Pengantar SKCK',
      description: 'Surat pengantar untuk mengurus SKCK',
      template: '<h1>Surat Pengantar SKCK</h1><p>Yang bertanda tangan di bawah ini...</p>',
      isActive: true,
    },
    {
        code: 'SKU',
        name: 'Surat Keterangan Usaha',
        description: 'Surat keterangan kepemilikan usaha bagi warga',
        template: '<h1>Surat Keterangan Usaha</h1><p>Menerangkan bahwa...</p>',
        isActive: true,
    }
  ]

  for (const template of letterTemplates) {
    await prisma.letterTemplate.upsert({
      where: { code: template.code },
      update: {},
      create: template,
    })
  }
  console.log('✅ Created/Restored letter templates')

  // ============================================
  // 3. VILLAGE PROFILE
  // ============================================
  await prisma.villageProfile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      sejarah: 'Gampong Mata Mamplam didirikan pada tahaun 1920...',
      visi: 'Terwujudnya Gampong Mata Mamplam yang Islami, Maju, Sejahtera, dan Mandiri.',
      misi: '1. Meningkatkan pengamalan Syariat Islam.\n2. Meningkatkan kualitas SDM.\n3. Mengembangkan ekonomi kerakyatan.',
      wilayah: {
        luas: '450 Ha',
        batas: {
            utara: 'Gampong Cot Bada',
            selatan: 'Gampong Meunasah Blang',
            timur: 'Gampong Blang Pulo',
            barat: 'Gampong Ujong Blang'
        }
      },
      potensi: {
          pertanian: 'Padi, Kacang, Jagung',
          perkebunan: 'Melinjo (Mamplam)',
          peternakan: 'Sapi, Kambing'
      }
    },
  })
  console.log('✅ Created village profile')

  // ============================================
  // 4. NEWS & CATEGORIES (WITH DUMMY DATA)
  // ============================================
  const newsCategories = [
    { name: 'Berita Desa', slug: 'berita-desa' },
    { name: 'Pembangunan', slug: 'pembangunan' },
    { name: 'Sosial', slug: 'sosial' },
    { name: 'Pengumuman', slug: 'pengumuman' },
  ]

  for (const cat of newsCategories) {
    await prisma.newsCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Create Dummy News
  const newsCat = await prisma.newsCategory.findFirst({ where: { slug: 'berita-desa' } })
  if (newsCat) {
      await prisma.news.createMany({
          data: [
              {
                  title: 'Gotong Royong Membersihkan Saluran Irigasi',
                  slug: 'gotong-royong-irigasi',
                  excerpt: 'Warga Gampong Mata Mamplam antusias melaksanakan gotong royong.',
                  content: '<p>Hari ini seluruh warga berkumpul untuk membersihkan saluran irigasi...</p>',
                  categoryId: newsCat.id,
                  authorId: admin.id,
                  status: 'PUBLISHED',
                  publishedAt: new Date(),
              },
              {
                  title: 'Pembagian BLT Dana Desa Tahap I',
                  slug: 'pembagian-blt-tahap-1',
                  excerpt: 'Penyaluran Bantuan Langsung Tunai berjalan lancar.',
                  content: '<p>Pemerintah Gampong telah menyalurkan BLT kepada 50 KPM...</p>',
                  categoryId: newsCat.id,
                  authorId: admin.id,
                  status: 'PUBLISHED',
                  publishedAt: new Date(),
              }
          ],
          skipDuplicates: true
      })
  }
  console.log('✅ Created news categories & dummy news')

  // ============================================
  // 5. UMKM (WITH DUMMY DATA)
  // ============================================
  const umkmCategories = [
    { name: 'Kuliner', slug: 'kuliner' },
    { name: 'Kerajinan', slug: 'kerajinan' },
    { name: 'Jasa', slug: 'jasa' },
  ]

  for (const cat of umkmCategories) {
    await prisma.uMKMCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  const kulinerCat = await prisma.uMKMCategory.findFirst({ where: { slug: 'kuliner' } })
  if (kulinerCat) {
      await prisma.uMKM.create({
          data: {
              name: 'Keripik Melinjo Mak Nyak',
              slug: 'keripik-melinjo-mak-nyak',
              description: 'Keripik melinjo renyah khas Mata Mamplam.',
              categoryId: kulinerCat.id,
              ownerName: 'Ibu Aminah',
              ownerPhone: '0852xxxxxxx',
              address: 'Dusun Tunong',
              isActive: true,
              products: {
                  create: [
                      { name: 'Keripik Masin (250g)', price: 15000 },
                      { name: 'Keripik Manis (250g)', price: 15000 }
                  ]
              }
          }
      })
  }
  console.log('✅ Created UMKM & dummy data')

  // ============================================
  // 6. PROJECTS (PEMBANGUNAN - DUMMY)
  // ============================================
  await prisma.project.createMany({
      data: [
          {
              title: 'Pembangunan Rabat Beton Jalan Tani',
              description: 'Pembangunan jalan usaha tani sepanjang 500 meter.',
              budget: 150000000,
              progress: 75,
              startDate: new Date('2026-01-10'),
              location: 'Dusun Baroh',
              status: 'IN_PROGRESS'
          },
          {
              title: 'Renovasi Posyandu',
              description: 'Perbaikan atap dan pengecatan gedung Posyandu.',
              budget: 25000000,
              progress: 100,
              startDate: new Date('2025-11-01'),
              endDate: new Date('2025-12-15'),
              location: 'Komp. Meunasah',
              status: 'COMPLETED'
          }
      ]
  })
  console.log('✅ Created dummy projects')

  // ============================================
  // 7. PUBLIC COMPLAINTS (CATEGORIES ONLY)
  // ============================================
  const complaintCats = ['Infrastruktur', 'Administrasi', 'Keamanan', 'Lainnya']
  for (const name of complaintCats) {
      await prisma.complaintCategory.upsert({
          where: { slug: name.toLowerCase() },
          update: {},
          create: { name, slug: name.toLowerCase() }
      })
  }
  console.log('✅ Created complaint categories')

  // ============================================
  // 8. GALLERY (CATEGORIES & DUMMY)
  // ============================================
  const galleryCats = [
      { name: 'Kegiatan Desa', slug: 'kegiatan' },
      { name: 'Pembangunan', slug: 'pembangunan-fisik' }
  ]
  for (const cat of galleryCats) {
      await prisma.galleryCategory.upsert({
          where: { slug: cat.slug },
          update: {},
          create: cat
      })
  }
  console.log('✅ Created gallery categories')

  // ============================================
  // 9. ORGANIZATIONAL STRUCTURE (VILLAGE OFFICIALS)
  // ============================================
  // Define positions hierarchy
  const positions = [
      { key: 'KEUCHIK', name: 'Keuchik Gampong', level: 1, sort: 1, category: 'LEADERSHIP' },
      { key: 'SEKDES', name: 'Sekretaris Gampong', level: 4, sort: 1, category: 'SECRETARIAT' },
      { key: 'KAUR_KEUANGAN', name: 'Kaur Keuangan', level: 4, sort: 2, category: 'SECRETARIAT' },
      { key: 'KAUR_UMUM', name: 'Kaur Umum & Perencanaan', level: 4, sort: 3, category: 'SECRETARIAT' },
      { key: 'KASI_PEMERINTAHAN', name: 'Kasi Pemerintahan', level: 5, sort: 1, category: 'TECHNICAL' },
      { key: 'KASI_KESEJAHTERAAN', name: 'Kasi Kesejahteraan', level: 5, sort: 2, category: 'TECHNICAL' },
      { key: 'KADUS_TUNONG', name: 'Kepala Dusun Tunong', level: 6, sort: 1, category: 'DUSUN', dusun: 'Dusun Tunong' },
      { key: 'KADUS_BAROH', name: 'Kepala Dusun Baroh', level: 6, sort: 2, category: 'DUSUN', dusun: 'Dusun Baroh' },
  ]

  for (const pos of positions) {
      const position = await prisma.villageOfficialPosition.upsert({
          where: { positionKey: pos.key },
          update: {},
          create: {
              category: pos.category,
              positionKey: pos.key,
              positionName: pos.name,
              level: pos.level,
              sortOrder: pos.sort,
              dusunName: pos.dusun
          }
      })

      // Assign dummy official
      await prisma.villageOfficial.upsert({
          where: { positionId: position.id },
          update: {},
          create: {
              positionId: position.id,
              name: `Pejabat ${pos.name}`, // Placeholder name
              phone: '0812xxxxxxxx',
              address: 'Mata Mamplam',
              isActive: true
          }
      })
  }
  console.log('✅ Created organizational structure')

  // ============================================
  // 10. DISASTER MANAGEMENT (DUMMY DATA)
  // ============================================
  const event = await prisma.disasterEvent.create({
      data: {
          title: 'Banjir Luapan 2026',
          description: 'Banjir akibat curah hujan tinggi yang menyebabkan luapan sungai.',
          status: 'ACTIVE',
          location: 'Seluruh Wilayah Desa',
          startDate: new Date(),
          posts: {
              create: [
                  {
                      name: 'Posko Utama Meunasah',
                      location: 'Halaman Meunasah Desa',
                      capacity: 200,
                      picName: 'Bpk. Keuchik',
                      picPhone: '0811xxxxxx',
                      isActive: true,
                      logistics: {
                          create: [
                              { itemName: 'Beras', unit: 'Sack', currentStock: 50, type: 'FOOD' },
                              { itemName: 'Mie Instan', unit: 'Box', currentStock: 100, type: 'FOOD' },
                              { itemName: 'Air Mineral', unit: 'Box', currentStock: 80, type: 'FOOD' }
                          ]
                      }
                  },
                  {
                      name: 'Posko Kesehatan',
                      location: 'Polindes',
                      capacity: 50,
                      picName: 'Bidan Desa',
                      picPhone: '0812xxxxxx',
                      isActive: true,
                      logistics: {
                          create: [
                              { itemName: 'Obat-obatan Dasar', unit: 'Paket', currentStock: 20, type: 'MEDICINE' },
                              { itemName: 'Masker', unit: 'Box', currentStock: 10, type: 'MEDICINE' }
                          ]
                      }
                  }
              ]
          },
          damage: {
              create: [
                  {
                      title: 'Jembatan Gantung Rusak Ringan',
                      description: 'Pondasi jembatan sedikit tergerus air.',
                      type: 'INFRASTRUCTURE',
                      severity: 'LIGHT',
                      location: 'Dusun Baroh',
                      status: 'REPORTED'
                  }
              ]
          }
      }
  })
  console.log('✅ Created dummy disaster event:', event.title)

  // ============================================
  // 11. SITE SETTINGS (DEFAULT)
  // ============================================
  await prisma.siteSettings.create({
    data: {
        settings: {
            siteName: 'Desa Mata Mamplam',
            siteDescription: 'Website Resmi Pemerintah Gampong Mata Mamplam',
            contactEmail: 'matamamplam2026@gmail.com',
            contactPhone: '081234567890',
            address: 'Jalan Cot Ijue, Kecamatan Peusangan',
            socialMedia: {
                facebook: 'https://facebook.com',
                instagram: 'https://instagram.com',
                twitter: 'https://twitter.com',
                youtube: 'https://youtube.com'
            },
            features: {
                enableComments: true,
                enablePublicComplaints: true,
                enableSurveys: false
            }
        }
    }
  })
  console.log('✅ Created default site settings')

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('📝 Default Admin: matamamplam2026@gmail.com / kkm-matamamplam2026')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
