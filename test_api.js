
async function testApi() {
  try {
    const res = await fetch("http://localhost:3000/api/public/penduduk/check?nik=1101010101900001");
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testApi();
