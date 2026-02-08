
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Site Settings...')

  const existing = await prisma.siteSettings.findFirst()
  if (existing) {
    console.log('✅ Site settings already exist. Updating...')
    await prisma.siteSettings.update({
        where: { id: existing.id },
        data: {
            settings: {
                general: {
                    siteName: 'Desa Mata Mamplam',
                    tagline: 'Maju, Sejahtera, Islami',
                    description: 'Website Resmi Pemerintah Gampong Mata Mamplam',
                    heroBackground: ''
                },
                branding: {
                    logo: '',
                    letterLogo: '',
                    favicon: ''
                },
                contact: {
                    email: 'matamamplam2026@gmail.com',
                    phone: '081234567890',
                    whatsapp: '081234567890',
                    address: 'Jalan Cot Ijue, Kecamatan Peusangan',
                    mapUrl: '',
                    operationalHours: {
                        weekdays: '08:00 - 16:00',
                        saturday: '08:00 - 12:00',
                        sunday: 'Tutup'
                    }
                },
                about: {
                    title: 'Tentang Kami',
                    content: 'Gampong Mata Mamplam adalah sebuah desa yang terletak di Kecamatan Peusangan, Kabupaten Bireuen, Aceh. Kami berkomitmen untuk memberikan pelayanan terbaik bagi masyarakat dan membangun desa yang maju serta mandiri.',
                    vision: 'Terwujudnya Gampong Mata Mamplam yang Mandiri, Sejahtera, dan Berakhlakul Karimah dengan Tata Kelola Pemerintahan yang Transparan, Akuntabel, dan Inovatif.',
                    mission: [
                        'Mewujudkan tata kelola pemerintahan desa yang jujur, transparan, dan akuntabel guna meningkatkan kualitas pelayanan publik.',
                        'Meningkatkan pembangunan infrastruktur desa yang merata dan berkelanjutan dengan memperhatikan kelestarian lingkungan.',
                        'Memberdayakan perekonomian masyarakat melalui penguatan BUMDes, UMKM, dan potensi lokal desa.',
                        'Meningkatkan kualitas sumber daya manusia melalui pendidikan, kesehatan, dan pengamalan nilai-nilai keagamaan.',
                        'Memperkuat kerukunan masyarakat dan melestarikan adat istiadat serta budaya Aceh yang berlandaskan Syariat Islam.'
                    ]
                },
                faq: [
                    { 
                        question: 'Bagaimana cara mengurus surat keterangan?', 
                        answer: 'Silahkan datang ke kantor Keuchik (Kantor Desa) dengan membawa KTP dan KK asli serta fotokopi. Anda juga bisa mengajukan surat secara online melalui menu "Layanan Surat" di website ini.' 
                    },
                    { 
                        question: 'Berapa lama proses pembuatan surat?', 
                        answer: 'Proses pembuatan surat biasanya memakan waktu 10-15 menit jika persyaratan lengkap dan pejabat yang berwenang (Keuchik/Sekdes) berada di tempat.' 
                    },
                    { 
                        question: 'Apakah ada biaya untuk pengurusan surat?', 
                        answer: 'Tidak ada biaya. Seluruh layanan administrasi kependudukan di Gampong Mata Mamplam tidak dipungut biaya (Gratis).' 
                    },
                    { 
                        question: 'Kapan jam operasional kantor desa?', 
                        answer: 'Senin - Jumat: 08:00 - 16:00 WIB, Istirahat: 12:00 - 14:00 WIB. Sabtu: 08:00 - 12:00 WIB. Minggu dan Hari Libur Nasional tutup.' 
                    },
                    { 
                        question: 'Bagaimana prosedur pindah datang/pindah keluar?', 
                        answer: 'Untuk pindah datang, lapor ke Kepala Dusun dan bawa Surat Pindah dari daerah asal. Untuk pindah keluar, bawa KTP & KK ke kantor desa untuk dibuatkan Surat Pengantar Pindah.' 
                    }
                ],
                footer: {
                    description: 'Website Resmi Pemerintah Gampong Mata Mamplam',
                    socialMedia: {
                        facebook: 'https://facebook.com',
                        instagram: 'https://instagram.com',
                        twitter: 'https://twitter.com',
                        youtube: 'https://youtube.com'
                    },
                    copyright: '© 2026 Desa Mata Mamplam'
                },
                navigation: {
                    externalLinks: []
                },
                geography: {
                    location: 'Kecamatan Peusangan',
                    area: '450 Ha',
                    boundaries: {
                        north: 'Batas Utara',
                        south: 'Batas Selatan',
                        east: 'Batas Timur',
                        west: 'Batas Barat'
                    },
                    totalDusun: '4 Dusun'
                }
            }
        }
    })
    return
  }

  await prisma.siteSettings.create({
    data: {
        settings: {
            general: {
                siteName: 'Desa Mata Mamplam',
                tagline: 'Maju, Sejahtera, Islami',
                description: 'Website Resmi Pemerintah Gampong Mata Mamplam',
                heroBackground: ''
            },
            branding: {
                logo: '',
                letterLogo: '',
                favicon: ''
            },
            contact: {
                email: 'matamamplam2026@gmail.com',
                phone: '081234567890',
                whatsapp: '081234567890',
                address: 'Jalan Cot Ijue, Kecamatan Peusangan',
                mapUrl: '',
                operationalHours: {
                    weekdays: '08:00 - 16:00',
                    saturday: '08:00 - 12:00',
                    sunday: 'Tutup'
                }
            },
            about: {
                title: 'Tentang Kami',
                content: 'Gampong Mata Mamplam adalah sebuah desa yang terletak di Kecamatan Peusangan, Kabupaten Bireuen, Aceh. Kami berkomitmen untuk memberikan pelayanan terbaik bagi masyarakat dan membangun desa yang maju serta mandiri.',
                vision: 'Terwujudnya Gampong Mata Mamplam yang Mandiri, Sejahtera, dan Berakhlakul Karimah dengan Tata Kelola Pemerintahan yang Transparan, Akuntabel, dan Inovatif.',
                mission: [
                    'Mewujudkan tata kelola pemerintahan desa yang jujur, transparan, dan akuntabel guna meningkatkan kualitas pelayanan publik.',
                    'Meningkatkan pembangunan infrastruktur desa yang merata dan berkelanjutan dengan memperhatikan kelestarian lingkungan.',
                    'Memberdayakan perekonomian masyarakat melalui penguatan BUMDes, UMKM, dan potensi lokal desa.',
                    'Meningkatkan kualitas sumber daya manusia melalui pendidikan, kesehatan, dan pengamalan nilai-nilai keagamaan.',
                    'Memperkuat kerukunan masyarakat dan melestarikan adat istiadat serta budaya Aceh yang berlandaskan Syariat Islam.'
                ]
            },
            faq: [
                { 
                    question: 'Bagaimana cara mengurus surat keterangan?', 
                    answer: 'Silahkan datang ke kantor Keuchik (Kantor Desa) dengan membawa KTP dan KK asli serta fotokopi. Anda juga bisa mengajukan surat secara online melalui menu "Layanan Surat" di website ini.' 
                },
                { 
                    question: 'Berapa lama proses pembuatan surat?', 
                    answer: 'Proses pembuatan surat biasanya memakan waktu 10-15 menit jika persyaratan lengkap dan pejabat yang berwenang (Keuchik/Sekdes) berada di tempat.' 
                },
                { 
                    question: 'Apakah ada biaya untuk pengurusan surat?', 
                    answer: 'Tidak ada biaya. Seluruh layanan administrasi kependudukan di Gampong Mata Mamplam tidak dipungut biaya (Gratis).' 
                },
                { 
                    question: 'Kapan jam operasional kantor desa?', 
                    answer: 'Senin - Jumat: 08:00 - 16:00 WIB, Istirahat: 12:00 - 14:00 WIB. Sabtu: 08:00 - 12:00 WIB. Minggu dan Hari Libur Nasional tutup.' 
                },
                { 
                    question: 'Bagaimana prosedur pindah datang/pindah keluar?', 
                    answer: 'Untuk pindah datang, lapor ke Kepala Dusun dan bawa Surat Pindah dari daerah asal. Untuk pindah keluar, bawa KTP & KK ke kantor desa untuk dibuatkan Surat Pengantar Pindah.' 
                }
            ],
            footer: {
                description: 'Website Resmi Pemerintah Gampong Mata Mamplam',
                socialMedia: {
                    facebook: 'https://facebook.com',
                    instagram: 'https://instagram.com',
                    twitter: 'https://twitter.com',
                    youtube: 'https://youtube.com'
                },
                copyright: '© 2026 Desa Mata Mamplam'
            },
            navigation: {
                externalLinks: []
            },
            geography: {
                location: 'Kecamatan Peusangan',
                area: '450 Ha',
                boundaries: {
                    north: 'Batas Utara',
                    south: 'Batas Selatan',
                    east: 'Batas Timur',
                    west: 'Batas Barat'
                },
                totalDusun: '4 Dusun'
            }
        }
    }
  })
  console.log('✅ Created default site settings')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
