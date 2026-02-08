const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding letter templates...')

  const templates = [
    {
      code: 'SKTM',
      name: 'Surat Keterangan Tidak Mampu',
      description: 'Surat keterangan untuk keluarga kurang mampu',
      template: `
<div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: black;">
  <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 5px; text-decoration: underline;">
    SURAT KETERANGAN TIDAK MAMPU
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    Nomor: {{nomorSurat}}
  </div>

  <p>Keuchik Gampong Mata Mamplam Kecamatan Peusangan Kabupaten Bireuen, dengan ini menerangkan bahwa:</p>

  <table style="width: 100%; border-collapse: collapse; margin-left: 0px;">
    <tr>
      <td style="width: 200px; padding: 2px;">Nama Lengkap</td>
      <td style="width: 10px; padding: 2px;">:</td>
      <td style="padding: 2px;"><strong>{{nama}}</strong></td>
    </tr>
    <tr>
      <td style="padding: 2px;">NIK</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{nik}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Tempat/Tanggal Lahir</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{tempatLahir}}, {{tanggalLahir}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Jenis Kelamin</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{jenisKelamin}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Pekerjaan</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{pekerjaan}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Agama</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{agama}}</td>
    </tr>
    <tr>
      <td style="padding: 2px; vertical-align: top;">Alamat</td>
      <td style="padding: 2px; vertical-align: top;">:</td>
      <td style="padding: 2px;">{{alamat}}, RT {{rt}} / RW {{rw}}, Gampong Mata Mamplam, Kec. Peusangan, Kab. Bireuen</td>
    </tr>
  </table>

  <p style="text-align: justify; margin-top: 20px;">
    Benar yang namanya tersebut di atas adalah penduduk Gampong Mata Mamplam, Kecamatan Peusangan, Kabupaten Bireuen.
    Berdasarkan pengamatan kami dan data yang ada, yang bersangkutan tergolong keluarga <strong>KURANG MAMPU / MISKIN</strong>.
  </p>
  
  <p style="text-align: justify;">
    Surat keterangan ini diberikan untuk keperluan: <strong>{{tujuan}}</strong>.
  </p>

  <p style="text-align: justify;">
    Demikian surat keterangan ini diperbuat dengan sebenarnya untuk dapat dipergunakan seperlunya.
  </p>

  <div style="margin-top: 50px; float: right; width: 45%; text-align: center;">
    <div>Mata Mamplam, {{tanggalSurat}}</div>
    <div style="font-weight: bold; margin-bottom: 80px;">{{jabatanPenandatangan}}</div>
    <div style="font-weight: bold; text-decoration: underline;">{{namaPenandatangan}}</div>
  </div>
</div>
      `,
      isActive: true,
    },
    {
      code: 'SKP',
      name: 'Surat Keterangan Penghasilan',
      description: 'Surat keterangan rincian penghasilan',
      template: `
<div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: black;">
  <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 5px; text-decoration: underline;">
    SURAT KETERANGAN PENGHASILAN
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    Nomor: {{nomorSurat}}
  </div>

  <p>Keuchik Gampong Mata Mamplam Kecamatan Peusangan Kabupaten Bireuen, dengan ini menerangkan bahwa:</p>

  <table style="width: 100%; border-collapse: collapse; margin-left: 0px;">
    <tr>
      <td style="width: 200px; padding: 2px;">Nama Lengkap</td>
      <td style="width: 10px; padding: 2px;">:</td>
      <td style="padding: 2px;"><strong>{{nama}}</strong></td>
    </tr>
    <tr>
      <td style="padding: 2px;">NIK</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{nik}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Tempat/Tanggal Lahir</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{tempatLahir}}, {{tanggalLahir}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Pekerjaan</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{pekerjaan}}</td>
    </tr>
    <tr>
      <td style="padding: 2px; vertical-align: top;">Alamat</td>
      <td style="padding: 2px; vertical-align: top;">:</td>
      <td style="padding: 2px;">{{alamat}}, RT {{rt}} / RW {{rw}}, Gampong Mata Mamplam, Kec. Peusangan, Kab. Bireuen</td>
    </tr>
  </table>

  <p style="text-align: justify; margin-top: 20px;">
    Benar waarga tersebut di atas mempunyai penghasilan rata-rata perbulan dari usaha <strong>{{sumber_penghasilan}}</strong> sebesar:
  </p>

  <div style="text-align: center; font-weight: bold; font-size: 14pt; margin: 20px 0;">
    Rp. {{penghasilan}},-
  </div>

  <p style="text-align: justify;">
    Surat keterangan ini diberikan untuk keperluan: <strong>{{tujuan}}</strong>.
  </p>

  <p style="text-align: justify;">
    Demikian surat keterangan ini diperbuat dengan sebenarnya untuk dapat dipergunakan seperlunya.
  </p>

  <div style="margin-top: 50px; float: right; width: 45%; text-align: center;">
    <div>Mata Mamplam, {{tanggalSurat}}</div>
    <div style="font-weight: bold; margin-bottom: 80px;">{{jabatanPenandatangan}}</div>
    <div style="font-weight: bold; text-decoration: underline;">{{namaPenandatangan}}</div>
  </div>
</div>
      `,
      isActive: true,
    },
    {
      code: 'SKDU',
      name: 'Surat Keterangan Domisili Usaha',
      description: 'Surat keterangan tempat usaha',
      template: `
<div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: black;">
  <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 5px; text-decoration: underline;">
    SURAT KETERANGAN DOMISILI USAHA
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    Nomor: {{nomorSurat}}
  </div>

  <p>Keuchik Gampong Mata Mamplam Kecamatan Peusangan Kabupaten Bireuen, dengan ini menerangkan bahwa:</p>

  <table style="width: 100%; border-collapse: collapse; margin-left: 0px;">
    <tr>
      <td style="width: 200px; padding: 2px;">Nama Lengkap</td>
      <td style="width: 10px; padding: 2px;">:</td>
      <td style="padding: 2px;"><strong>{{nama}}</strong></td>
    </tr>
    <tr>
      <td style="padding: 2px;">NIK</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{nik}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Tempat/Tanggal Lahir</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{tempatLahir}}, {{tanggalLahir}}</td>
    </tr>
    <tr>
      <td style="padding: 2px; vertical-align: top;">Alamat</td>
      <td style="padding: 2px; vertical-align: top;">:</td>
      <td style="padding: 2px;">{{alamat}}, RT {{rt}} / RW {{rw}}, Gampong Mata Mamplam</td>
    </tr>
  </table>

  <p style="text-align: justify; margin-top: 20px;">
    Benar yang namanya tersebut di atas membuka/memiliki usaha yang berdomisili di Gampong Mata Mamplam Kecamatan Peusangan Kabupaten Bireuen, dengan identitas usaha sebagai berikut:
  </p>

  <table style="width: 100%; border-collapse: collapse; margin-left: 0px;">
    <tr>
      <td style="width: 200px; padding: 2px;">Nama Usaha</td>
      <td style="width: 10px; padding: 2px;">:</td>
      <td style="padding: 2px;"><strong>{{nama_usaha}}</strong></td>
    </tr>
    <tr>
      <td style="padding: 2px;">Jenis Usaha</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{jenis_usaha}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Alamat Usaha</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{alamat_usaha}}</td>
    </tr>
  </table>

  <p style="text-align: justify; margin-top: 20px;">
    Demikian surat keterangan ini diperbuat dengan sebenarnya untuk dapat dipergunakan seperlunya (<strong>{{tujuan}}</strong>).
  </p>

  <div style="margin-top: 50px; float: right; width: 45%; text-align: center;">
    <div>Mata Mamplam, {{tanggalSurat}}</div>
    <div style="font-weight: bold; margin-bottom: 80px;">{{jabatanPenandatangan}}</div>
    <div style="font-weight: bold; text-decoration: underline;">{{namaPenandatangan}}</div>
  </div>
</div>
      `,
      isActive: true,
    },
    {
      code: 'SKCK',
      name: 'Surat Pengantar SKCK',
      description: 'Surat pengantar untuk pembuatan SKCK di kepolisian',
      template: `
<div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: black;">
  <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 5px; text-decoration: underline;">
    SURAT PENGANTAR SKCK
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    Nomor: {{nomorSurat}}
  </div>

  <p>Keuchik Gampong Mata Mamplam Kecamatan Peusangan Kabupaten Bireuen, dengan ini menerangkan bahwa:</p>

  <table style="width: 100%; border-collapse: collapse; margin-left: 0px;">
    <tr>
      <td style="width: 200px; padding: 2px;">Nama Lengkap</td>
      <td style="width: 10px; padding: 2px;">:</td>
      <td style="padding: 2px;"><strong>{{nama}}</strong></td>
    </tr>
    <tr>
      <td style="padding: 2px;">NIK</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{nik}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Tempat/Tanggal Lahir</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{tempatLahir}}, {{tanggalLahir}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Jenis Kelamin</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{jenisKelamin}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Pekerjaan</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{pekerjaan}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Agama</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{agama}}</td>
    </tr>
    <tr>
      <td style="padding: 2px; vertical-align: top;">Alamat</td>
      <td style="padding: 2px; vertical-align: top;">:</td>
      <td style="padding: 2px;">{{alamat}}, RT {{rt}} / RW {{rw}}, Gampong Mata Mamplam</td>
    </tr>
  </table>

  <p style="text-align: justify; margin-top: 20px;">
    Benar yang namanya tersebut di atas adalah penduduk Gampong Mata Mamplam yang berkelakuan baik dan tidak pernah tersangkut perkara Pidana.
    Surat ini diberikan sebagai pengantar untuk mengurus <strong>Surat Keterangan Catatan Kepolisian (SKCK)</strong> di Polres Bireuen.
  </p>

  <p style="text-align: justify;">
    Demikian surat keterangan ini diperbuat dengan sebenarnya untuk dapat dipergunakan seperlunya.
  </p>

  <div style="margin-top: 50px; float: right; width: 45%; text-align: center;">
    <div>Mata Mamplam, {{tanggalSurat}}</div>
    <div style="font-weight: bold; margin-bottom: 80px;">{{jabatanPenandatangan}}</div>
    <div style="font-weight: bold; text-decoration: underline;">{{namaPenandatangan}}</div>
  </div>
</div>
      `,
      isActive: true,
    },
    {
      code: 'SKD',
      name: 'Surat Keterangan Domisili',
      description: 'Surat keterangan bertempat tinggal',
      template: `
<div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: black;">
  <div style="text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 5px; text-decoration: underline;">
    SURAT KETERANGAN DOMISILI
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    Nomor: {{nomorSurat}}
  </div>

  <p>Keuchik Gampong Mata Mamplam Kecamatan Peusangan Kabupaten Bireuen, dengan ini menerangkan bahwa:</p>

  <table style="width: 100%; border-collapse: collapse; margin-left: 0px;">
    <tr>
      <td style="width: 200px; padding: 2px;">Nama Lengkap</td>
      <td style="width: 10px; padding: 2px;">:</td>
      <td style="padding: 2px;"><strong>{{nama}}</strong></td>
    </tr>
    <tr>
      <td style="padding: 2px;">NIK</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{nik}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Tempat/Tanggal Lahir</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{tempatLahir}}, {{tanggalLahir}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Jenis Kelamin</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{jenisKelamin}}</td>
    </tr>
    <tr>
      <td style="padding: 2px;">Pekerjaan</td>
      <td style="padding: 2px;">:</td>
      <td style="padding: 2px;">{{pekerjaan}}</td>
    </tr>
    <tr>
      <td style="padding: 2px; vertical-align: top;">Alamat</td>
      <td style="padding: 2px; vertical-align: top;">:</td>
      <td style="padding: 2px;">{{alamat}}, RT {{rt}} / RW {{rw}}, Gampong Mata Mamplam</td>
    </tr>
  </table>

  <p style="text-align: justify; margin-top: 20px;">
    Benar yang namanya tersebut di atas adalah penduduk yang berdomisili/bertempat tinggal di Gampong Mata Mamplam, Kecamatan Peusangan, Kabupaten Bireuen.
  </p>

  <p style="text-align: justify;">
    Surat keterangan ini diberikan untuk keperluan: <strong>{{tujuan}}</strong>.
  </p>

  <p style="text-align: justify;">
    Demikian surat keterangan ini diperbuat dengan sebenarnya untuk dapat dipergunakan seperlunya.
  </p>

  <div style="margin-top: 50px; float: right; width: 45%; text-align: center;">
    <div>Mata Mamplam, {{tanggalSurat}}</div>
    <div style="font-weight: bold; margin-bottom: 80px;">{{jabatanPenandatangan}}</div>
    <div style="font-weight: bold; text-decoration: underline;">{{namaPenandatangan}}</div>
  </div>
</div>
      `,
      isActive: true,
    }
  ]

  for (const template of templates) {
    await prisma.letterTemplate.upsert({
      where: { code: template.code },
      update: {
        template: template.template,
        name: template.name,
        description: template.description
      },
      create: template,
    })
    console.log(`✅ Upserted template: ${template.code}`)
  }

  console.log('🎉 Template seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
