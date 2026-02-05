// login-anggota.js - Fixed version with complete session data

console.log('🔄 Login Anggota JS loaded');

// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');

if (togglePassword) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        eyeIcon.classList.toggle('bi-eye');
        eyeIcon.classList.toggle('bi-eye-slash');
    });
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const namaLengkap = document.getElementById('username').value.trim();
    const nim = document.getElementById('password').value.trim();

    console.log('📝 Login attempt:', { namaLengkap, nim });

    if (!namaLengkap || !nim) {
        showAlert('Mohon lengkapi semua field!', 'warning');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memverifikasi...';

    try {
        console.log('🔍 Checking anggota in database...');

        // Get active election first
        const { data: election, error: electionError } = await supabaseClient
            .from('elections')
            .select('id, title')
            .eq('is_active', true)
            .single();

        if (electionError || !election) {
            console.error('❌ No active election:', electionError);
            throw new Error('Tidak ada pemilihan yang sedang aktif saat ini.');
        }

        console.log('✅ Active election found:', election);

        // Check if anggota exists in database
        const { data: anggota, error: anggotaError } = await supabaseClient
            .from('anggota')
            .select('*')
            .eq('nama_lengkap', namaLengkap)
            .eq('nim', nim)
            .maybeSingle();

        console.log('📊 Anggota query result:', { anggota, anggotaError });

        if (anggotaError) {
            console.error('❌ Database error:', anggotaError);
            throw new Error('Terjadi kesalahan saat memeriksa data. Silakan coba lagi.');
        }

        if (!anggota) {
            console.warn('⚠️ Anggota not found');
            throw new Error('Nama atau NIM tidak ditemukan. Pastikan data Anda sudah terdaftar.');
        }

        console.log('✅ Anggota verified:', anggota);

        // Check if already voted
        const { data: voteData, error: voteError } = await supabaseClient
            .from('votes')
            .select('*')
            .eq('election_id', election.id)
            .eq('voter_identifier', nim)
            .maybeSingle();

        if (voteData) {
            console.warn('⚠️ Already voted!');
            throw new Error('Anda sudah melakukan voting untuk pemilihan ini!');
        }

        // Create complete session object with ALL required data
        const sessionData = {
            namaLengkap: anggota.nama_lengkap,
            nim: anggota.nim,
            divisi: anggota.divisi || 'Umum',
            jabatan: anggota.jabatan || 'Anggota',
            electionId: election.id,
            electionTitle: election.title,
            loginTime: new Date().toISOString(),
            codeVerified: false,
            userType: 'anggota'
        };

        console.log('💾 Saving session data:', sessionData);

        // Save to localStorage
        localStorage.setItem('userSession', JSON.stringify(sessionData));

        // Force localStorage to flush (untuk beberapa browser)
        try {
            localStorage.setItem('_test', '1');
            localStorage.removeItem('_test');
        } catch (e) {
            console.error('localStorage test failed');
        }

        // Verify saved data BEBERAPA KALI untuk memastikan
        let verificationAttempts = 0;
        const maxAttempts = 3;

        const verifySave = () => {
            const savedSession = localStorage.getItem('userSession');

            if (savedSession) {
                try {
                    const parsedSession = JSON.parse(savedSession);

                    // Pastikan SEMUA field penting ada
                    if (parsedSession.namaLengkap &&
                        parsedSession.nim &&
                        parsedSession.electionId) {

                        console.log('✅ Session saved and verified:', parsedSession);
                        showAlert('✓ Login berhasil! Mengalihkan...', 'success');

                        setTimeout(() => {
                            window.location.href = 'enter-code-anggota.html';
                        }, 800);

                        return true;
                    }
                } catch (e) {
                    console.error('Parse error:', e);
                }
            }

            // Retry if failed
            verificationAttempts++;
            if (verificationAttempts < maxAttempts) {
                console.warn(`⚠️ Verification attempt ${verificationAttempts} failed, retrying...`);
                setTimeout(verifySave, 200);
                return false;
            } else {
                console.error('❌ Failed to verify session after multiple attempts');
                showAlert('Gagal menyimpan sesi. Silakan coba lagi.', 'danger');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                return false;
            }
        };

        verifySave();


        function showAlert(message, type = 'info') {
            // Create alert element if not exists
            let alertBox = document.getElementById('alertBox');

            if (!alertBox) {
                alertBox = document.createElement('div');
                alertBox.id = 'alertBox';
                alertBox.style.marginBottom = '1rem';

                // Insert before form
                const form = document.getElementById('loginForm');
                form.parentNode.insertBefore(alertBox, form);
            }

            const iconMap = {
                'success': 'check-circle-fill',
                'danger': 'x-circle-fill',
                'warning': 'exclamation-triangle-fill',
                'info': 'info-circle-fill'
            };

            alertBox.className = `alert alert-${type}`;
            alertBox.innerHTML = `<i class="bi bi-${iconMap[type]} me-2"></i>${message}`;
            alertBox.style.display = 'block';

            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 5000);
        }

        // Check if already logged in
        window.addEventListener('DOMContentLoaded', function () {
            const session = localStorage.getItem('userSession');

            if (session) {
                try {
                    const sessionData = JSON.parse(session);
                    console.log('📌 Existing session found:', sessionData);

                    // If code already verified, go to voting
                    if (sessionData.codeVerified) {
                        console.log('✅ Code verified, redirecting to voting...');
                        window.location.href = '../voting/anggota/vote.html';
                        return;
                    }

                    // If session exists but code not verified, go to enter code
                    if (sessionData.namaLengkap && sessionData.nim && sessionData.electionId) {
                        console.log('⚠️ Session exists, redirecting to enter code...');
                        window.location.href = 'enter-code-anggota.html';
                        return;
                    }
                } catch (e) {
                    console.error('❌ Invalid session, clearing...', e);
                    localStorage.clear();
                }
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        showAlert(error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }

    // login-anggota.js - Fixed version with complete session data

    console.log('🔄 Login Anggota JS loaded');

    // Cek apakah supabaseClient tersedia
    if (typeof supabaseClient === 'undefined') {
        console.error('❌ FATAL: supabaseClient not loaded!');
        alert('Error: Konfigurasi database tidak ditemukan. Silakan refresh halaman.');
    }

    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (togglePassword) {
        togglePassword.addEventListener('click', function (e) {
            e.preventDefault(); // TAMBAHKAN INI
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            eyeIcon.classList.toggle('bi-eye');
            eyeIcon.classList.toggle('bi-eye-slash');
        });
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        console.error('❌ FATAL: Login form not found!');
    } else {
        console.log('✅ Login form found, attaching event listener...');

        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault(); // PENTING!
            e.stopPropagation(); // TAMBAHKAN INI

            console.log('🚀 Form submitted via JavaScript');

            const namaLengkap = document.getElementById('username').value.trim();
            const nim = document.getElementById('password').value.trim();

            console.log('📝 Login attempt:', { namaLengkap, nim });

            if (!namaLengkap || !nim) {
                showAlert('Mohon lengkapi semua field!', 'warning');
                return false; // TAMBAHKAN
            }

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memverifikasi...';

            try {
                console.log('🔍 Checking anggota in database...');

                // Get active election first
                const { data: election, error: electionError } = await supabaseClient
                    .from('elections')
                    .select('id, title')
                    .eq('is_active', true)
                    .single();

                if (electionError || !election) {
                    console.error('❌ No active election:', electionError);
                    throw new Error('Tidak ada pemilihan yang sedang aktif saat ini.');
                }

                console.log('✅ Active election found:', election);

                // Check if anggota exists in database
                const { data: anggota, error: anggotaError } = await supabaseClient
                    .from('anggota')
                    .select('*')
                    .eq('nama_lengkap', namaLengkap)
                    .eq('nim', nim)
                    .maybeSingle();

                console.log('📊 Anggota query result:', { anggota, anggotaError });

                if (anggotaError) {
                    console.error('❌ Database error:', anggotaError);
                    throw new Error('Terjadi kesalahan saat memeriksa data. Silakan coba lagi.');
                }

                if (!anggota) {
                    console.warn('⚠️ Anggota not found');
                    throw new Error('Nama atau NIM tidak ditemukan. Pastikan data Anda sudah terdaftar.');
                }

                console.log('✅ Anggota verified:', anggota);

                // Check if already voted
                const { data: voteData, error: voteError } = await supabaseClient
                    .from('votes')
                    .select('*')
                    .eq('election_id', election.id)
                    .eq('voter_identifier', nim)
                    .maybeSingle();

                if (voteData) {
                    console.warn('⚠️ Already voted!');
                    throw new Error('Anda sudah melakukan voting untuk pemilihan ini!');
                }

                // Create complete session object with ALL required data
                const sessionData = {
                    namaLengkap: anggota.nama_lengkap,
                    nim: anggota.nim,
                    divisi: anggota.divisi || 'Umum',
                    jabatan: anggota.jabatan || 'Anggota',
                    electionId: election.id,
                    electionTitle: election.title,
                    loginTime: new Date().toISOString(),
                    codeVerified: false,
                    userType: 'anggota'
                };

                console.log('💾 Saving session data:', sessionData);

                // Save to localStorage dengan konfirmasi
                localStorage.setItem('userSession', JSON.stringify(sessionData));

                // Tunggu sebentar untuk memastikan tersimpan
                await new Promise(resolve => setTimeout(resolve, 100));

                // Verify saved data
                const savedSession = localStorage.getItem('userSession');
                const parsedSession = JSON.parse(savedSession);

                console.log('✅ Session saved and verified:', parsedSession);

                // Validasi ulang
                if (!parsedSession.namaLengkap || !parsedSession.nim || !parsedSession.electionId) {
                    throw new Error('Gagal menyimpan session. Silakan coba lagi.');
                }

                showAlert('✓ Login berhasil! Mengalihkan...', 'success');

                setTimeout(() => {
                    console.log('🔄 Redirecting to enter-code page...');
                    window.location.href = 'enter-code-anggota.html';
                }, 1000);

            } catch (error) {
                console.error('❌ Login error:', error);
                showAlert(error.message, 'danger');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }

            return false; // TAMBAHKAN INI
        });
    }

    // ... sisa kode sa
});