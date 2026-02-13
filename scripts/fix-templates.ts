import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEMPLATES = [
  {
    code: "SKU",
    name: "Surat Keterangan Usaha",
    description: "Surat keterangan kepemilikan usaha bagi warga gampong.",
    template: `
<div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000;">
  <!-- Title -->
  <div style="text-align: center; margin-bottom: 20px;">
    <span style="font-weight: bold; font-size: 14pt; text-decoration: underline; text-transform: uppercase;">SURAT KETERANGAN USAHA</span>
    <br />
    <span>Nomor: {{nomorSurat}}</span>
  </div>

  <!-- Opening -->
  <p style="text-align: justify; text-indent: 40px; margin-bottom: 10px;">
    Keuchik Gampong Mata Mamplam, Kecamatan Peusangan, Kabupaten Bireuen, dengan ini menerangkan bahwa:
  </p>

  <!-- Bio -->
  <table style="width: 100%; margin-left: 20px; margin-bottom: 10px;">
    <tr><td style="width: 160px; vertical-align: top;">Nama Lengkap</td><td style="width: 10px; vertical-align: top;">:</td><td><strong>{{nama}}</strong></td></tr>
    <tr><td style="vertical-align: top;">NIK</td><td style="vertical-align: top;">:</td><td>{{nik}}</td></tr>
    <tr><td style="vertical-align: top;">Tempat/Tgl Lahir</td><td style="vertical-align: top;">:</td><td>{{tempatLahir}}, {{tanggalLahir}}</td></tr>
    <tr><td style="vertical-align: top;">Jenis Kelamin</td><td style="vertical-align: top;">:</td><td>{{jenisKelamin}}</td></tr>
    <tr><td style="vertical-align: top;">Pekerjaan</td><td style="vertical-align: top;">:</td><td>{{pekerjaan}}</td></tr>
    <tr><td style="vertical-align: top;">Alamat</td><td style="vertical-align: top;">:</td><td>{{alamat}}</td></tr>
  </table>

  <!-- Content -->
  <p style="text-align: justify; text-indent: 40px; margin-bottom: 10px;">
    Benar nama tersebut di atas adalah warga Gampong Mata Mamplam dan menurut pengamatan kami benar ia memiliki Usaha sebagai berikut:
  </p>

  <table style="width: 100%; margin-left: 20px; margin-bottom: 10px;">
    <tr><td style="width: 160px; vertical-align: top;">Nama Usaha</td><td style="width: 10px; vertical-align: top;">:</td><td><strong>{{nama_usaha}}</strong></td></tr>
    <tr><td style="vertical-align: top;">Jenis Usaha</td><td style="vertical-align: top;">:</td><td>{{jenis_usaha}}</td></tr>
    <tr><td style="vertical-align: top;">Lokasi Usaha</td><td style="vertical-align: top;">:</td><td>{{lokasi_usaha}}</td></tr>
    <tr><td style="vertical-align: top;">Lama Usaha</td><td style="vertical-align: top;">:</td><td>{{lama_usaha}}</td></tr>
  </table>

  <p style="text-align: justify; text-indent: 40px; margin-bottom: 10px;">
    Surat keterangan ini diberikan untuk keperluan: <strong>{{tujuan}}</strong>.
  </p>

  <!-- Closing -->
  <p style="text-align: justify; text-indent: 40px; margin-bottom: 30px;">
    Demikian surat keterangan ini diperbuat dengan sebenarnya agar dapat dipergunakan seperlunya.
  </p>

  <!-- Signature -->
  <div style="float: right; width: 40%; text-align: center;">
    <p>Mata Mamplam, {{tanggalSurat}}<br/>Keuchik Gampong,</p>
    <br/><br/><br/><br/>
    <p style="font-weight: bold; text-decoration: underline;">( {{namaPenandatangan}} )</p>
  </div>
  <div style="clear: both;"></div>
</div>
    `
  },
  {
    code: "SKTM",
    name: "Surat Keterangan Tidak Mampu",
    description: "Surat keterangan bagi warga kurang mampu untuk keperluan bantuan/beasiswa.",
    template: `
<div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000;">
  <!-- Title -->
  <div style="text-align: center; margin-bottom: 20px;">
    <span style="font-weight: bold; font-size: 14pt; text-decoration: underline; text-transform: uppercase;">SURAT KETERANGAN TIDAK MAMPU</span>
    <br />
    <span>Nomor: {{nomorSurat}}</span>
  </div>

  <!-- Opening -->
  <p style="text-align: justify; text-indent: 40px; margin-bottom: 10px;">
    Keuchik Gampong Mata Mamplam, Kecamatan Peusangan, Kabupaten Bireuen, dengan ini menerangkan bahwa:
  </p>

  <!-- Bio -->
  <table style="width: 100%; margin-left: 20px; margin-bottom: 10px;">
    <tr><td style="width: 160px; vertical-align: top;">Nama Lengkap</td><td style="width: 10px; vertical-align: top;">:</td><td><strong>{{nama}}</strong></td></tr>
    <tr><td style="vertical-align: top;">NIK</td><td style="vertical-align: top;">:</td><td>{{nik}}</td></tr>
    <tr><td style="vertical-align: top;">Tempat/Tgl Lahir</td><td style="vertical-align: top;">:</td><td>{{tempatLahir}}, {{tanggalLahir}}</td></tr>
    <tr><td style="vertical-align: top;">Jenis Kelamin</td><td style="vertical-align: top;">:</td><td>{{jenisKelamin}}</td></tr>
    <tr><td style="vertical-align: top;">Pekerjaan</td><td style="vertical-align: top;">:</td><td>{{pekerjaan}}</td></tr>
    <tr><td style="vertical-align: top;">Alamat</td><td style="vertical-align: top;">:</td><td>{{alamat}}</td></tr>
  </table>

  <!-- Content -->
  <p style="text-align: justify; text-indent: 40px; margin-bottom: 10px;">
    Nama tersebut di atas benar warga Gampong Mata Mamplam dan berdasarkan data serta pengamatan kami yang bersangkutan tergolong keluarga <strong>KURANG MAMPU / MISKIN</strong>.
  </p>

  <p style="text-align: justify; text-indent: 40px; margin-bottom: 10px;">
    Surat keterangan ini diberikan untuk keperluan: <strong>{{tujuan}}</strong>.
  </p>

  <!-- Closing -->
  <p style="text-align: justify; text-indent: 40px; margin-bottom: 30px;">
    Demikian surat keterangan ini diperbuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.
  </p>

  <!-- Signature -->
  <div style="float: right; width: 40%; text-align: center;">
    <p>Mata Mamplam, {{tanggalSurat}}<br/>Keuchik Gampong,</p>
    <br/><br/><br/><br/>
    <p style="font-weight: bold; text-decoration: underline;">( {{namaPenandatangan}} )</p>
  </div>
  <div style="clear: both;"></div>
</div>
    `
  },
  {
    code: "SKD",
    name: "Surat Keterangan Domisili",
    description: "Surat keterangan tempat tinggal/domisili warga.",
    template: `
<div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000;">
  <!-- Title -->
  <div style="text-align: center; margin-bottom: 20px;">
    <span style="font-weight: bold; font-size: 14pt; text-decoration: underline; text-transform: uppercase;">SURAT KETERANGAN DOMISILI</span>
    <br />
    <span>Nomor: {{nomorSurat}}</span>
  </div>

  <!-- Opening -->
  <p style="text-align: justify; text-indent: 40px; margin-bottom: 10px;">
    Keuchik Gampong Mata Mamplam, Kecamatan Peusangan, Kabupaten Bireuen, dengan ini menerangkan bahwa:
  </p>

  <!-- Bio -->
  <table style="width: 100%; margin-left: 20px; margin-bottom: 10px;">
    <tr><td style="width: 160px; vertical-align: top;">Nama Lengkap</td><td style="width: 10px; vertical-align: top;">:</td><td><strong>{{nama}}</strong></td></tr>
    <tr><td style="vertical-align: top;">NIK</td><td style="vertical-align: top;">:</td><td>{{nik}}</td></tr>
    <tr><td style="vertical-align: top;">Tempat/Tgl Lahir</td><td style="vertical-align: top;">:</td><td>{{tempatLahir}}, {{tanggalLahir}}</td></tr>
    <tr><td style="vertical-align: top;">Jenis Kelamin</td><td style="vertical-align: top;">:</td><td>{{jenisKelamin}}</td></tr>
    <tr><td style="vertical-align: top;">Pekerjaan</td><td style="vertical-align: top;">:</td><td>{{pekerjaan}}</td></tr>
    <tr><td style="vertical-align: top;">Alamat Asal</td><td style="vertical-align: top;">:</td><td>{{alamat}}</td></tr>
  </table>

  <!-- Content -->
  <p style="text-align: justify; text-indent: 40px; margin-bottom: 10px;">
    Benar nama tersebut di atas adalah warga yang saat ini berdomisili / bertempat tinggal di Gampong Mata Mamplam Kecamatan Peusangan Kabupaten Bireuen.
  </p>

  <p style="text-align: justify; text-indent: 40px; margin-bottom: 10px;">
    Surat keterangan ini diberikan untuk keperluan: <strong>{{tujuan}}</strong>.
  </p>

  <!-- Closing -->
  <p style="text-align: justify; text-indent: 40px; margin-bottom: 30px;">
    Demikian surat keterangan ini diperbuat dengan sebenarnya agar dapat dipergunakan seperlunya.
  </p>

  <!-- Signature -->
  <div style="float: right; width: 40%; text-align: center;">
    <p>Mata Mamplam, {{tanggalSurat}}<br/>Keuchik Gampong,</p>
    <br/><br/><br/><br/>
    <p style="font-weight: bold; text-decoration: underline;">( {{namaPenandatangan}} )</p>
  </div>
  <div style="clear: both;"></div>
</div>
    `
  }
];

async function main() {
  console.log("Start fixing templates...");
  
  for (const t of TEMPLATES) {
    console.log(`Updating template: ${t.code} - ${t.name}`);
    
    // Check if exists
    const existing = await prisma.letterTemplate.findUnique({
      where: { code: t.code }
    });

    if (existing) {
      await prisma.letterTemplate.update({
        where: { code: t.code },
        data: {
          name: t.name,
          template: t.template,
          description: t.description,
          isActive: true
        }
      });
      console.log(`Updated ${t.code}`);
    } else {
      await prisma.letterTemplate.create({
        data: {
          code: t.code,
          name: t.name,
          template: t.template,
          description: t.description,
          isActive: true
        }
      });
      console.log(`Created ${t.code}`);
    }
  }
  
  console.log("Templates fixed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
