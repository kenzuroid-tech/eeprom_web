document.addEventListener('DOMContentLoaded', function () {
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            eyeIcon.classList.toggle('bi-eye');
            eyeIcon.classList.toggle('bi-eye-slash');
        });
    }

    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const nim = document.getElementById('password').value.trim();
    const submitBtn = e.target.querySelector('button[type="submit"]');

    if (!username || !nim) {
        showAlert('Nama lengkap dan NIM harus diisi!', 'warning');
        return;
    }

    // Disable button dan ubah text
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Memproses...';

    try {
        console.log('🔐 Attempting login for:', username, nim);

        // 1. Cari user berdasarkan nama dan nim di tabel anggota
        const { data: anggotaData, error: anggotaError } = await supabaseClient
            .from('anggota')
            .select('*, users!inner(*)')
            .eq('nama_lengkap', username)
            .eq('nim', nim)
            .maybeSingle();

        if (anggotaError) {
            console.error('❌ Error fetching anggota:', anggotaError);
            throw new Error('Terjadi kesalahan saat mengecek data anggota');
        }

        if (!anggotaData) {
            console.warn('⚠️ Anggota not found');
            showAlert('Nama lengkap atau NIM tidak ditemukan!', 'danger');
            return;
        }

        console.log('✅ Anggota found:', anggotaData);

        // 2. Cek apakah user aktif
        if (!anggotaData.users.is_active) {
            showAlert('Akun Anda tidak aktif. Hubungi admin!', 'danger');
            return;
        }

        // 3. Ambil pemilihan yang sedang aktif
        const { data: activeElection, error: electionError } = await supabaseClient
            .from('elections')
            .select('*')
            .eq('is_active', true)
            .eq('allow_anggota', true)
            .maybeSingle();

        if (electionError) {
            console.error('❌ Error fetching election:', electionError);
            throw new Error('Terjadi kesalahan saat mengecek pemilihan');
        }

        if (!activeElection) {
            showAlert('Tidak ada pemilihan yang sedang berlangsung untuk anggota!', 'warning');
            return;
        }

        console.log('📊 Active election:', activeElection);

        // 4. CEK APAKAH SUDAH VOTE - berdasarkan voter_identifier (NIM)
        const { data: existingVote, error: voteError } = await supabaseClient
            .from('votes')
            .select('*')
            .eq('election_id', activeElection.id)
            .eq('voter_identifier', nim)
            .maybeSingle();

        if (voteError) {
            console.error('❌ Error checking vote:', voteError);
            throw new Error('Terjadi kesalahan saat mengecek status voting');
        }

        // BLOKIR LOGIN JIKA SUDAH VOTE
        if (existingVote) {
            console.warn('⚠️ User already voted!');
            showAlert(
                'Anda sudah melakukan voting pada pemilihan ini! Akses ditolak.',
                'danger',
                5000
            );
            return;
        }

        console.log('✅ User has not voted yet, login allowed');

        // 5. Simpan session ke localStorage
        const sessionData = {
            userId: anggotaData.user_id,
            anggotaId: anggotaData.id,
            username: anggotaData.users.username,
            role: anggotaData.users.role,
            namaLengkap: anggotaData.nama_lengkap,
            nim: anggotaData.nim,
            prodi: anggotaData.prodi,
            angkatan: anggotaData.angkatan,
            divisi: anggotaData.divisi,
            jabatan: anggotaData.jabatan,
            electionId: activeElection.id,
            electionTitle: activeElection.title,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('userSession', JSON.stringify(sessionData));
        console.log('✅ Session saved:', sessionData);

        // 6. Log activity
        try {
            await supabaseClient.from('activity_logs').insert({
                user_id: anggotaData.user_id,
                action: 'LOGIN',
                description: `Anggota ${anggotaData.nama_lengkap} login untuk voting`,
                entity_type: 'election',
                entity_id: activeElection.id
            });
        } catch (logError) {
            console.warn('⚠️ Failed to log activity:', logError);
        }

        // 7. Redirect ke halaman voting
        showAlert('Login berhasil! Mengalihkan ke halaman voting...', 'success', 2000);
        
        setTimeout(() => {
            window.location.href = 'enter-code-anggota.html';
        }, 1500);

    } catch (error) {
        console.error('❌ Login error:', error);
        showAlert(error.message || 'Terjadi kesalahan saat login', 'danger');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function showAlert(message, type = 'info', duration = 4000) {
    // Hapus alert sebelumnya jika ada
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show custom-alert`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;

    const icons = {
        success: 'bi-check-circle-fill',
        danger: 'bi-x-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };

    alertDiv.innerHTML = `
        <i class="bi ${icons[type]} me-2"></i>
        <strong>${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto remove
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, duration);
}

// Add animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);