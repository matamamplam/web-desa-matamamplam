const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding population data...')

  // Clean up old data
  // Note: Delete in order of dependency (Dependent first)
  try {
  console.log('🧹 Cleaning up dependent data...')
  
  try { await prisma.letterRequest.deleteMany({}); console.log('  - Deleted LetterRequests'); } 
  catch(e) { console.error('  x Failed to delete LetterRequests', e.message); }

  try { await prisma.complaint.deleteMany({}); console.log('  - Deleted Complaints'); }
  catch(e) { console.error('  x Failed to delete Complaints', e.message); }

  try { await prisma.affectedResident.deleteMany({}); console.log('  - Deleted AffectedResidents'); }
  catch(e) { console.error('  x Failed to delete AffectedResidents', e.message); }

  console.log('🧹 Cleaning up population data...')
  
  try { await prisma.penduduk.deleteMany({}); console.log('  - Deleted Penduduk'); }
  catch(e) { console.error('  x Failed to delete Penduduk', e.message); }

  try { await prisma.kartuKeluarga.deleteMany({}); console.log('  - Deleted KartuKeluarga'); }
  catch(e) { console.error('  x Failed to delete KartuKeluarga', e.message); }
  
  console.log('✅ Cleanup phase finished.')
  } catch (error) {
     console.error('❌ Cleanup failed:', error)
  }

  // Data Dummy Kartu Keluarga
  const kartuKeluargaData = [
    {
      noKK: '1101010101010001',
      kepalaKeluarga: 'Abdullah',
      alamat: 'Dusun Bale Situi',
      dusun: 'Dusun Bale Situi',
      rt: '000',
      rw: '000',
      kelurahan: 'Mata Mamplam',
      kecamatan: 'Peusangan',
      kabupaten: 'Bireuen',
      provinsi: 'Aceh',
      kodePos: '24261',
    },
    {
      noKK: '1101010101010002',
      kepalaKeluarga: 'Budi Hartono',
      alamat: 'Dusun Muda Intan',
      dusun: 'Dusun Muda Intan',
      rt: '000',
      rw: '000',
      kelurahan: 'Mata Mamplam',
      kecamatan: 'Peusangan',
      kabupaten: 'Bireuen',
      provinsi: 'Aceh',
      kodePos: '24261',
    },
    {
      noKK: '1101010101010003',
      kepalaKeluarga: 'Citra Dewi',
      alamat: 'Dusun Kolam',
      dusun: 'Dusun Kolam',
      rt: '000',
      rw: '000',
      kelurahan: 'Mata Mamplam',
      kecamatan: 'Peusangan',
      kabupaten: 'Bireuen',
      provinsi: 'Aceh',
      kodePos: '24261',
    },
    // Adding more families to have diverse Dusun data
    {
      noKK: '1101010101010004',
      kepalaKeluarga: 'Zulkifli',
      alamat: 'Dusun Bale Situi',
      dusun: 'Dusun Bale Situi',
      rt: '000',
      rw: '000',
      kelurahan: 'Mata Mamplam',
      kecamatan: 'Peusangan',
      kabupaten: 'Bireuen',
      provinsi: 'Aceh',
      kodePos: '24261',
    },
    {
      noKK: '1101010101010005',
      kepalaKeluarga: 'Mariana',
      alamat: 'Dusun Kolam',
      dusun: 'Dusun Kolam',
      rt: '000',
      rw: '000',
      kelurahan: 'Mata Mamplam',
      kecamatan: 'Peusangan',
      kabupaten: 'Bireuen',
      provinsi: 'Aceh',
      kodePos: '24261',
    }
  ]

  for (const kkData of kartuKeluargaData) {
    const createdKK = await prisma.kartuKeluarga.create({
      data: kkData,
    })

    console.log(`✅ Created KK: ${createdKK.noKK} - ${createdKK.kepalaKeluarga} (${createdKK.dusun})`)

    // Data Dummy Penduduk untuk setiap KK
    let pendudukList = []

    if (createdKK.noKK === '1101010101010001') {
      pendudukList = [
        {
          nik: '1101010101900001',
          nama: 'Abdullah',
          tempatLahir: 'Bireuen',
          tanggalLahir: new Date('1980-05-12'),
          jenisKelamin: 'LAKI_LAKI',
          agama: 'ISLAM',
          pendidikan: 'S1',
          pekerjaan: 'PNS',
          statusPerkawinan: 'KAWIN',
          hubunganDalamKeluarga: 'KEPALA_KELUARGA',
          namaAyah: 'Hasan',
          namaIbu: 'Fatimah',
        },
        {
          nik: '1101010202950002',
          nama: 'Siti Aminah',
          tempatLahir: 'Lhokseumawe',
          tanggalLahir: new Date('1985-02-20'),
          jenisKelamin: 'PEREMPUAN',
          agama: 'ISLAM',
          pendidikan: 'DIPLOMA',
          pekerjaan: 'Ibu Rumah Tangga',
          statusPerkawinan: 'KAWIN',
          hubunganDalamKeluarga: 'ISTRI',
          namaAyah: 'Mahmud',
          namaIbu: 'Aisyah',
        },
        {
          nik: '1101010303150003',
          nama: 'Rizky Pratama',
          tempatLahir: 'Bireuen',
          tanggalLahir: new Date('2010-09-15'),
          jenisKelamin: 'LAKI_LAKI',
          agama: 'ISLAM',
          pendidikan: 'SMP',
          pekerjaan: 'Pelajar',
          statusPerkawinan: 'BELUM_KAWIN',
          hubunganDalamKeluarga: 'ANAK',
          namaAyah: 'Abdullah',
          namaIbu: 'Siti Aminah',
        },
      ]
    } else if (createdKK.noKK === '1101010101010002') {
      pendudukList = [
        {
          nik: '1101010404880004',
          nama: 'Budi Hartono',
          tempatLahir: 'Medan',
          tanggalLahir: new Date('1988-11-10'),
          jenisKelamin: 'LAKI_LAKI',
          agama: 'ISLAM',
          pendidikan: 'SMA',
          pekerjaan: 'Wiraswasta',
          statusPerkawinan: 'KAWIN',
          hubunganDalamKeluarga: 'KEPALA_KELUARGA',
          namaAyah: 'Suherman',
          namaIbu: 'Sri Wahyuni',
        },
        {
          nik: '1101010505900005',
          nama: 'Rina Marlina',
          tempatLahir: 'Bireuen',
          tanggalLahir: new Date('1990-07-25'),
          jenisKelamin: 'PEREMPUAN',
          agama: 'ISLAM',
          pendidikan: 'S1',
          pekerjaan: 'Guru',
          statusPerkawinan: 'KAWIN',
          hubunganDalamKeluarga: 'ISTRI',
          namaAyah: 'Rusli',
          namaIbu: 'Nurhayati',
        },
      ]
    } else if (createdKK.noKK === '1101010101010003') {
        pendudukList = [
            {
              nik: '1101010606920006',
              nama: 'Citra Dewi',
              tempatLahir: 'Bandung',
              tanggalLahir: new Date('1992-03-30'),
              jenisKelamin: 'PEREMPUAN',
              agama: 'ISLAM',
              pendidikan: 'S2',
              pekerjaan: 'Dosen',
              statusPerkawinan: 'CERAI_MATI',
              hubunganDalamKeluarga: 'KEPALA_KELUARGA',
              namaAyah: 'Deden',
              namaIbu: 'Lilis',
            },
          ]
    } else if (createdKK.noKK === '1101010101010004') {
        pendudukList = [
            {
                nik: '1101010707800007',
                nama: 'Zulkifli',
                tempatLahir: 'Bireuen',
                tanggalLahir: new Date('1980-01-01'),
                jenisKelamin: 'LAKI_LAKI',
                agama: 'ISLAM',
                pendidikan: 'SMA',
                pekerjaan: 'Petani',
                statusPerkawinan: 'KAWIN',
                hubunganDalamKeluarga: 'KEPALA_KELUARGA',
                namaAyah: 'Ismail',
                namaIbu: 'Aminah',
            }
        ]
    } else if (createdKK.noKK === '1101010101010005') {
        pendudukList = [
            {
                nik: '1101010808850008',
                nama: 'Mariana',
                tempatLahir: 'Bireuen',
                tanggalLahir: new Date('1985-05-05'),
                jenisKelamin: 'PEREMPUAN',
                agama: 'ISLAM',
                pendidikan: 'DIPLOMA',
                pekerjaan: 'Pedagang',
                statusPerkawinan: 'CERAI_HIDUP',
                hubunganDalamKeluarga: 'KEPALA_KELUARGA',
                namaAyah: 'Yusuf',
                namaIbu: 'Salmah',
            }
        ]
    }

    for (const penduduk of pendudukList) {
      await prisma.penduduk.create({
        data: {
          ...penduduk,
          kkId: createdKK.id,
        },
      })
    }
    console.log(`   ✅ Added ${pendudukList.length} members to KK ${createdKK.noKK}`)
  }

  console.log('🎉 Population data seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
