require('dotenv').config({ path: './backend/.env' });

console.log('\n🎵 Spotify Configuration Check\n');
console.log('================================\n');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

console.log('✅ Client ID:', clientId ? `${clientId.substring(0, 10)}...` : '❌ MISSING');
console.log('✅ Client Secret:', clientSecret ? `${clientSecret.substring(0, 10)}...` : '❌ MISSING');
console.log('✅ Redirect URI:', redirectUri || '❌ MISSING');

console.log('\n📋 IMPORTANT: Add this EXACT URI to Spotify Dashboard:\n');
console.log(`   ${redirectUri}`);
console.log('\n🔗 Spotify Dashboard: https://developer.spotify.com/dashboard\n');

console.log('Steps to fix:');
console.log('1. Go to https://developer.spotify.com/dashboard');
console.log('2. Click on your app');
console.log('3. Click "Settings"');
console.log('4. Under "Redirect URIs", add EXACTLY:');
console.log(`   ${redirectUri}`);
console.log('5. Click "Add" then "Save"');
console.log('\n⚠️  The URI must match EXACTLY (including http:// and port)\n');
