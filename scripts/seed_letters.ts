const LETTER_TEMPLATES = [
  {
    code: 'SKTM',
    name: 'Surat Keterangan Tidak Mampu',
    description: 'Surat keterangan untuk keperluan beasiswa, bantuan sosial, atau keringanan biaya pengobatan.',
    template: `
<style>
  @media print {
    body { margin: 0; }
  }
</style>

<div style="font-family: Arial, sans-serif; line-height: 1.4; font-size: 14px;">

  <!-- HEADER -->
  <div style="display:flex; align-items:center; justify-content:center; border-bottom:2px solid black; padding-bottom:8px; margin-bottom:15px;">
    <img src="/logo-gampong.png" style="width:70px; margin-right:12px;" />
    <div style="text-align:center; line-height:1.2;">
      <div style="font-weight:bold; font-size:16px;">PEMERINTAH KABUPATEN BIREUEN</div>
      <div style="font-weight:bold;">KECAMATAN PEUSANGAN</div>
      <div style="font-weight:bold; font-size:18px;">GAMPONG MATA MAMPLAM</div>
      <div style="font-size:12px;">Alamat: Jl. Cot Iju, Kode Pos 24261</div>
    </div>
  </div>

  <div style="text-align:center; margin-bottom:12px;">
    <div style="text-decoration:underline; font-weight:bold;">SURAT KETERANGAN TIDAK MAMPU</div>
    <div>Nomor: {{nomor_surat}}</div>
  </div>

  <p>Keuchik Gampong Mata Mamplam Kecamatan Peusangan Kabupaten Bireuen, dengan ini menerangkan bahwa:</p>

  <table style="width:100%; margin-left:10px; border-collapse:collapse;">
    <tr><td style="width:150px; padding:2px 0;">Nama Lengkap</td><td>: <strong>{{nama}}</strong></td></tr>
    <tr><td style="padding:2px 0;">NIK</td><td>: {{nik}}</td></tr>
    <tr><td style="padding:2px 0;">Tempat/Tgl Lahir</td><td>: {{tempat_lahir}}, {{tanggal_lahir}}</td></tr>
    <tr><td style="padding:2px 0;">Jenis Kelamin</td><td>: {{jenis_kelamin}}</td></tr>
    <tr><td style="padding:2px 0;">Pekerjaan</td><td>: {{pekerjaan}}</td></tr>
    <tr><td style="padding:2px 0;">Alamat</td><td>: {{alamat}}</td></tr>
  </table>

  <p>Nama tersebut di atas benar warga Gampong Mata Mamplam Kecamatan Peusangan Kabupaten Bireuen dan tergolong keluarga <strong>KURANG MAMPU / MISKIN</strong>.</p>
  <p>Surat ini diberikan untuk keperluan: <strong>{{keperluan}}</strong>.</p>

  <div style="margin-top:30px; width:250px; text-align:center; float:right; page-break-inside:avoid;">
    <div>Mata Mamplam, {{tanggal_surat}}</div>
    <div>Keuchik Gampong,</div>
    <div style="height:60px;"></div>
    <div><strong>( TAUFIQ, ST )</strong></div>
  </div>

  <div style="clear:both;"></div>
</div>
`
  },

  {
    code: 'SKU',
    name: 'Surat Keterangan Usaha',
    description: 'Surat keterangan usaha.',
    template: `
<style>
  @media print {
    body { margin: 0; }
  }
</style>

<div style="font-family: Arial, sans-serif; line-height: 1.4; font-size: 13px;">

  ${/* HEADER SAMA */''}
  <div style="display:flex; align-items:center; justify-content:center; border-bottom:2px solid black; padding-bottom:8px; margin-bottom:15px;">
    <img src="/logo-gampong.png" style="width:70px; margin-right:12px;" />
    <div style="text-align:center; line-height:1.2;">
      <div style="font-weight:bold; font-size:16px;">PEMERINTAH KABUPATEN BIREUEN</div>
      <div style="font-weight:bold;">KECAMATAN PEUSANGAN</div>
      <div style="font-weight:bold; font-size:18px;">GAMPONG MATA MAMPLAM</div>
      <div style="font-size:12px;">Alamat: Jl. Cot Iju, Kode Pos 24261</div>
    </div>
  </div>

  <div style="text-align:center; margin-bottom:12px;">
    <div style="text-decoration:underline; font-weight:bold;">SURAT KETERANGAN USAHA</div>
    <div>Nomor: {{nomor_surat}}</div>
  </div>

  <p>Dengan ini menerangkan bahwa:</p>

  <table style="width:100%; margin-left:10px;">
    <tr><td style="width:150px; padding:2px 0;">Nama</td><td>: <strong>{{nama}}</strong></td></tr>
    <tr><td style="padding:2px 0;">NIK</td><td>: {{nik}}</td></tr>
    <tr><td style="padding:2px 0;">Alamat</td><td>: {{alamat}}</td></tr>
  </table>

  <p>Memiliki usaha:</p>

  <table style="width:100%; margin-left:10px;">
    <tr><td style="width:150px; padding:2px 0;">Nama Usaha</td><td>: <strong>{{nama_usaha}}</strong></td></tr>
    <tr><td style="padding:2px 0;">Jenis Usaha</td><td>: {{jenis_usaha}}</td></tr>
    <tr><td style="padding:2px 0;">Lokasi</td><td>: {{lokasi_usaha}}</td></tr>
    <tr><td style="padding:2px 0;">Lama Usaha</td><td>: {{lama_usaha}}</td></tr>
  </table>

  <p>Surat ini untuk keperluan: <strong>{{keperluan}}</strong>.</p>

  <div style="margin-top:30px; width:250px; text-align:center; float:right; page-break-inside:avoid;">
    <div>Mata Mamplam, {{tanggal_surat}}</div>
    <div>Keuchik Gampong,</div>
    <div style="height:60px;"></div>
    <div><strong>( TAUFIQ, ST )</strong></div>
  </div>

  <div style="clear:both;"></div>
</div>
`
  },

  {
    code: 'SKD',
    name: 'Surat Keterangan Domisili',
    description: 'Surat keterangan domisili.',
    template: `
<style>
  @media print {
    body { margin: 0; }
  }
</style>

<div style="font-family: Arial, sans-serif; line-height: 1.4; font-size: 14px;">

  <div style="display:flex; align-items:center; justify-content:center; border-bottom:2px solid black; padding-bottom:8px; margin-bottom:15px;">
    <img src="/logo-gampong.png" style="width:70px; margin-right:12px;" />
    <div style="text-align:center; line-height:1.2;">
      <div style="font-weight:bold; font-size:16px;">PEMERINTAH KABUPATEN BIREUEN</div>
      <div style="font-weight:bold;">KECAMATAN PEUSANGAN</div>
      <div style="font-weight:bold; font-size:18px;">GAMPONG MATA MAMPLAM</div>
      <div style="font-size:12px;">Alamat: Jl. Cot Iju, Kode Pos 24261</div>
    </div>
  </div>

  <div style="text-align:center; margin-bottom:12px;">
    <div style="text-decoration:underline; font-weight:bold;">SURAT KETERANGAN DOMISILI</div>
    <div>Nomor: {{nomor_surat}}</div>
  </div>

  <p>Dengan ini menerangkan bahwa:</p>

  <table style="width:100%; margin-left:10px;">
    <tr><td style="width:150px; padding:2px 0;">Nama</td><td>: <strong>{{nama}}</strong></td></tr>
    <tr><td style="padding:2px 0;">NIK</td><td>: {{nik}}</td></tr>
    <tr><td style="padding:2px 0;">TTL</td><td>: {{tempat_lahir}}, {{tanggal_lahir}}</td></tr>
    <tr><td style="padding:2px 0;">Pekerjaan</td><td>: {{pekerjaan}}</td></tr>
  </table>

  <p>Berdomisili di:</p>
  <p style="margin-left:10px; font-weight:bold;">{{alamat_domisili}}</p>

  <p>Untuk keperluan: <strong>{{keperluan}}</strong>.</p>

  <div style="margin-top:30px; width:250px; text-align:center; float:right; page-break-inside:avoid;">
    <div>Mata Mamplam, {{tanggal_surat}}</div>
    <div>Keuchik Gampong,</div>
    <div style="height:60px;"></div>
    <div><strong>( TAUFIQ, ST )</strong></div>
  </div>

  <div style="clear:both;"></div>
</div>
`
  }
];
