const SUPABASE_URL = 'https://ypkfhbzpowqcptthdtip.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwa2ZoYnpwb3dxY3B0dGhkdGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTA3OTMsImV4cCI6MjA4NTM2Njc5M30.MYT20iLhk4K3uuoLbunex6ZKTae9AYMRrYKNAbYs4_U';

// Validasi library Supabase sudah dimuat
if (typeof window.supabase === 'undefined') {
    throw new Error('Supabase library belum dimuat! Pastikan CDN script sudah ada.');
}

// Inisialisasi Supabase Client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export ke window object
window.supabaseClient = supabaseClient;
window.SUPABASE_URL = SUPABASE_URL;

console.log('✅ Supabase Client berhasil diinisialisasi');
console.log('📍 Connected to:', SUPABASE_URL);