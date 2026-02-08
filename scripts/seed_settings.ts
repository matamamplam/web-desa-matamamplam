import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding site settings...');

  const defaultSettings = {
    general: {
      siteName: 'Website Desa Mata Mamplam',
      tagline: 'Melayani dengan Hati, Membangun dengan Inovasi',
      description:
        'Portal resmi Desa Mata Mamplam yang menyediakan informasi, layanan, dan berita terkini untuk masyarakat.',
      heroBackground: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070', // Dummy village/rice field image
    },
    branding: {
      logo: '/images/logo.png', // Default logo path
      favicon: '/images/favicon.ico', // Default favicon path
    },
    contact: {
      email: 'desa@matamamplam.id',
      phone: '(0123) 456-7890',
      whatsapp: '081234567890',
      address: 'Jalan Cot Iju, Kecamatan Peusangan, Kabupaten Bireuen, Provinsi Aceh',
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12105.920084140022!2d96.74471967374723!3d5.227302734632815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3047682c06be8af5%3A0x1fb981f0e1d25c64!2sMata%20Mamplam%2C%20Kec.%20Peusangan%2C%20Kabupaten%20Bireuen%2C%20Aceh!5e1!3m2!1sid!2sid!4v1770189194972!5m2!1sid!2sid',
    },
    about: {
      title: 'Tentang Desa Mata Mamplam',
      content: `
        <p>Desa Mata Mamplam adalah desa yang terletak di wilayah yang strategis dengan potensi alam dan budaya yang kaya. 
        Kami berkomitmen untuk memberikan pelayanan terbaik kepada masyarakat melalui pemanfaatan teknologi digital.</p>
        
        <p>Website ini dibuat sebagai upaya transformasi digital dalam tata kelola pemerintahan desa yang lebih transparan, 
        efisien, dan mudah diakses oleh seluruh masyarakat.</p>
      `,
      vision:
        'Mewujudkan Desa Mata Mamplam yang maju, sejahtera, dan berdaya saing melalui pemanfaatan teknologi digital dan pemberdayaan masyarakat.',
      mission: [
        'Meningkatkan kualitas pelayanan publik melalui digitalisasi',
        'Memberdayakan masyarakat dalam bidang ekonomi kreatif dan UMKM',
        'Menjaga dan melestarikan budaya lokal',
        'Meningkatkan transparansi dan akuntabilitas pemerintahan desa',
        'Membangun infrastruktur desa yang berkelanjutan',
      ],
    },
    faq: [
      {
        question: 'Bagaimana cara mengajukan surat online?',
        answer:
          'Anda dapat mengajukan surat secara online melalui menu Layanan Surat. Login terlebih dahulu, pilih jenis surat yang dibutuhkan, isi formulir, dan kirimkan permohonan. Petugas akan memproses dan Anda akan menerima notifikasi.',
      },
      {
        question: 'Berapa lama proses pembuatan surat?',
        answer:
          'Waktu pemrosesan surat bervariasi tergantung jenis surat dan kelengkapan dokumen. Umumnya 1-3 hari kerja setelah permohonan disetujui.',
      },
      {
        question: 'Apakah ada biaya untuk layanan surat online?',
        answer:
          'Layanan surat online tidak dipungut biaya administrasi. Namun untuk beberapa jenis surat tertentu mungkin ada biaya materai sesuai ketentuan yang berlaku.',
      },
      {
        question: 'Bagaimana cara melaporkan pengaduan?',
        answer:
          'Anda dapat melaporkan pengaduan melalui menu Pengaduan. Isi formulir dengan lengkap dan sertakan foto jika diperlukan. Tim kami akan menindaklanjuti setiap laporan yang masuk.',
      },
    ],
    footer: {
      description:
        'Website resmi Desa Mata Mamplam. Menyediakan informasi, layanan administrasi, dan transparansi pemerintahan desa untuk seluruh masyarakat.',
      socialMedia: {
        facebook: 'https://facebook.com/desamatamamplam',
        instagram: 'https://instagram.com/desamatamamplam',
        twitter: 'https://twitter.com/desamatamamplam',
        youtube: 'https://youtube.com/@desamatamamplam',
      },
      copyright: `© ${new Date().getFullYear()} Desa Mata Mamplam. All rights reserved.`,
    },
    navigation: {
      externalLinks: [
        {
          label: 'Portal Kementerian Desa',
          url: 'https://kemendesa.go.id',
          openInNewTab: true,
        },
        {
          label: 'Website Kabupaten',
          url: '#',
          openInNewTab: true,
        },
      ],
    },
  };

  // Check if settings already exist
  const existingSettings = await prisma.siteSettings.findFirst();

  if (existingSettings) {
    console.log('Settings already exist. Updating...');
    await prisma.siteSettings.update({
      where: { id: existingSettings.id },
      data: { settings: defaultSettings },
    });
    console.log('✅ Settings updated successfully!');
  } else {
    console.log('Creating new settings...');
    await prisma.siteSettings.create({
      data: { settings: defaultSettings },
    });
    console.log('✅ Settings created successfully!');
  }
}

main()
  .catch((e) => {
    console.error('Error seeding settings:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
