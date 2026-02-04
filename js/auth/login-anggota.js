document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#password');
    const eyeIcon = document.querySelector('#eyeIcon');

    // Toggle Password Visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            eyeIcon.classList.toggle('bi-eye');
            eyeIcon.classList.toggle('bi-eye-slash');
        });
    }

    // Handle Form Submit
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const namaLengkap = document.getElementById('username').value.trim();
        const nim = document.getElementById('password').value.trim();

        // Validasi input
        if (!namaLengkap || !nim) {
            showAlert('Mohon isi semua field!', 'warning');
            return;
        }

        // Show loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';

        try {
            // Query ke Supabase - cari anggota berdasarkan nama dan NIM
            const { data: anggotaData, error: anggotaError } = await supabaseClient
                .from('anggota')
                .select('*, users(*)')
                .ilike('nama_lengkap', namaLengkap) // Case insensitive
                .eq('nim', nim)
                .single();

            if (anggotaError || !anggotaData) {
                throw new Error('Data anggota tidak ditemukan atau NIM tidak sesuai');
            }

            // Check apakah user aktif
            if (!anggotaData.users.is_active) {
                throw new Error('Akun tidak aktif. Hubungi admin!');
            }

            // Check apakah sudah voting
            if (anggotaData.has_voted) {
                showAlert('Anda sudah melakukan voting sebelumnya!', 'info');
                setTimeout(() => {
                    window.location.href = '../voting/anggota/voting-result.html';
                }, 2000);
                return;
            }

            // Set session
            AuthHelper.setSession(anggotaData.users);
            localStorage.setItem('userRole', 'anggota');
            localStorage.setItem('username', anggotaData.users.username);
            localStorage.setItem('nim', anggotaData.nim);
            localStorage.setItem('namaLengkap', anggotaData.nama_lengkap);
            localStorage.setItem('anggotaId', anggotaData.id);
            localStorage.setItem('divisi', anggotaData.divisi || '-');
            localStorage.setItem('jabatan', anggotaData.jabatan || 'Anggota');
            localStorage.setItem('prodi', anggotaData.prodi || '-');

            // Bagian dalam success try block
            showAlert('Login berhasil! Mengalihkan...', 'success');

            setTimeout(() => {
                // Gunakan path absolut (diawali /) agar tidak terjadi double folder di URL
                window.location.href = 'enter-code-anggota.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            showAlert(error.message, 'danger');

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    function showAlert(message, type = 'info') {
        const existingAlert = document.querySelector('.alert-notification');
        if (existingAlert) existingAlert.remove();

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-notification`;
        alertDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    }
});