
async function runTest() {
  const baseUrl = 'http://localhost:3000';

  console.log('1. Testing Public Stats (Expected: 200 OK + Standard Format)...');
  try {
    const res = await fetch(`${baseUrl}/api/public/stats`);
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log('Response Preview:', JSON.stringify(data).substring(0, 100));
    
    if (data.success === true && data.data) {
        console.log('✅ Public Stats response format is correct.');
    } else {
        console.error('❌ Public Stats response format is INCORRECT.');
    }
  } catch (e) {
      console.error('Failed to fetch public stats:', e);
  }

  console.log('\n2. Testing Admin Penduduk (Expected: 401 Unauthorized + Standard Format)...');
  try {
    const res = await fetch(`${baseUrl}/api/admin/penduduk`);
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log('Response Preview:', JSON.stringify(data));

    if (res.status === 401 && data.success === false && data.error && data.error.code === 'AUTH_001') { // AUTH_UNAUTHORIZED
         console.log('✅ Admin Penduduk error response format is correct.');
    } else {
         console.error('❌ Admin Penduduk error response format is INCORRECT.');
    }
  } catch (e) {
      console.error('Failed to fetch admin penduduk:', e);
  }
}

runTest();
