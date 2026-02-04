document.addEventListener('DOMContentLoaded', function() {
    const delegasiLoginForm = document.getElementById('delegasiLoginForm');

    // Handle Form Submit
    delegasiLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const namaLengkap = document.getElementById('namaLengkap').value.trim();
        const nim = document.getElementById('nim').value.trim();
        const instansi = document.getElementById('instansi').value.trim();

        // Validasi input
        if (!namaLengkap || !nim || !instansi) {
            showAlert('Mohon isi semua field!', 'warning');
            return;
        }

        // Show loading
        const submitBtn = delegasiLoginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memverifikasi...';

        try {
            // Query ke Supabase - cari delegasi
            const { data: delegasiData, error: delegasiError } = await supabaseClient
                .from('delegasi')
                .select('*, users(*)')
                .ilike('nama_lengkap', namaLengkap)
                .eq('nim', nim)
                .ilike('instansi', instansi)
                .single();

            if (delegasiError || !delegasiData) {
                throw new Error('Data delegasi tidak ditemukan atau tidak sesuai');
            }

            // Check apakah terverifikasi
            if (!delegasiData.is_verified) {
                throw new Error('Delegasi belum diverifikasi oleh admin. Silakan hubungi panitia!');
            }

            // Check apakah user aktif
            if (!delegasiData.users.is_active) {
                throw new Error('Akun tidak aktif. Hubungi admin!');
            }

            // Check apakah sudah voting
            if (delegasiData.has_voted) {
                showAlert('Anda sudah melakukan voting sebelumnya!', 'info');
                setTimeout(() => {
                    window.location.href = '../voting/delegasi/voting-result.html';
                }, 2000);
                return;
            }

            // Set session
            AuthHelper.setSession(delegasiData.users);
            localStorage.setItem('userRole', 'delegasi');
            localStorage.setItem('namaLengkap', delegasiData.nama_lengkap);
            localStorage.setItem('nim', delegasiData.nim);
            localStorage.setItem('instansi', delegasiData.instansi);

            // Success
            showAlert('Verifikasi berhasil! Mengalihkan...', 'success');
            
            setTimeout(() => {
                AuthHelper.redirectToDashboard('delegasi');
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