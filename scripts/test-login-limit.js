
const { parse } = require('cookie');

async function runTest() {
  const baseUrl = 'http://localhost:3000';
  let cookies = '';
  let csrfToken = '';

  // 1. Get CSRF Token
  console.log('1. Fetching CSRF Token...');
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const csrfData = await csrfRes.json();
  csrfToken = csrfData.csrfToken;
  
  // Extract cookies
  const setCookie = csrfRes.headers.get('set-cookie');
  if (setCookie) {
    cookies = setCookie.split(',').map(c => c.split(';')[0]).join('; ');
  }
  console.log('CSRF Token:', csrfToken);

  // 2. Perform Login Attempts
  console.log('\n2. Starting Login Spam (6 attempts)...');
  
  for (let i = 1; i <= 6; i++) {
    const start = Date.now();
    const res = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // NextAuth uses form data usually
        'Cookie': cookies
      },
      body: new URLSearchParams({
        csrfToken: csrfToken,
        email: 'attacker@example.com',
        password: 'wrongpassword123',
        json: 'true'
      })
    });

    const duration = Date.now() - start;
    console.log(`\nAttempt #${i} - Status: ${res.status} (${duration}ms)`);
    
    // Check for rate limit headers
    if (res.headers.get('X-RateLimit-Remaining')) {
      console.log(`RateLimit Remaining: ${res.headers.get('X-RateLimit-Remaining')}`);
    }

    try {
        const text = await res.text();
        console.log('Body Preview:', text.substring(0, 150)); 
    } catch (e) {
        console.log('Could not read body');
    }

    // NextAuth v5 often returns 200 even on failure, but with an error URL or error field
    // We want to see if we get a 429 eventually OR a specific error message
  }
}

runTest().catch(console.error);
