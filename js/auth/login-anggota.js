// login-anggota.js - Simplified version matching alumni login

console.log('🔄 Login Anggota JS loaded');

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (togglePassword) {
        togglePassword.addEventListener('click', function (e) {
            e.preventDefault();
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            eyeIcon.classList.toggle('bi-eye');
            eyeIcon.classList.toggle('bi-eye-slash');
        });
    }

    // Handle Form Submit
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const namaLengkap = document.getElementById('username').value.trim();
        const nim = document.getElementById('password').value.trim();

        console.log('📝 Login attempt:', { namaLengkap, nim });

        // Validasi input
        if (!namaLengkap || !nim) {
            showAlert('Mohon lengkapi semua field!', 'warning');
            return;
        }

        // Show loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
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

            // Save to localStorage (SAMA SEPERTI ALUMNI)
            localStorage.setItem('namaLengkap', anggota.nama_lengkap);
            localStorage.setItem('nim', anggota.nim);
            localStorage.setItem('divisi', anggota.divisi || 'Umum');
            localStorage.setItem('jabatan', anggota.jabatan || 'Anggota');
            localStorage.setItem('electionId', election.id);
            localStorage.setItem('electionTitle', election.title);
            localStorage.setItem('userType', 'anggota');

            console.log('✅ Data saved to localStorage');

            // Success
            showAlert('✓ Login berhasil! Mengalihkan...', 'success');

            // Redirect ke halaman enter code
            setTimeout(() => {
                window.location.href = 'enter-code-anggota.html';
            }, 1500);

        } catch (error) {
            console.error('❌ Login error:', error);
            showAlert(error.message, 'danger');

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Function untuk show alert
    function showAlert(message, type = 'info') {
        const existingAlert = document.querySelector('.alert-notification');
        if (existingAlert) existingAlert.remove();

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-notification`;
        alertDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';

        const iconMap = {
            'success': 'check-circle-fill',
            'danger': 'x-circle-fill',
            'warning': 'exclamation-triangle-fill',
            'info': 'info-circle-fill'
        };

        alertDiv.innerHTML = `
            <i class="bi bi-${iconMap[type] || 'info-circle-fill'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // Auto dismiss setelah 5 detik
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 5000);
    }
});