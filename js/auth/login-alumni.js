document.addEventListener('DOMContentLoaded', function () {
    const alumniLoginForm = document.getElementById('alumniLoginForm');

    // Handle Form Submit
    alumniLoginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const namaLengkap = document.getElementById('identifier').value.trim();
        const generasi = document.getElementById('generasi').value.trim();

        // Validasi input
        if (!namaLengkap || !generasi) {
            showAlert('Mohon isi semua field!', 'warning');
            return;
        }

        // Validasi generasi harus angka
        if (isNaN(generasi) || parseInt(generasi) < 1) {
            showAlert('Generasi harus berupa angka positif!', 'warning');
            return;
        }

        // Show loading
        const submitBtn = alumniLoginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memverifikasi...';

        try {
            // ✅ Ambil data election aktif beserta waktu
            const { data: election, error: electionError } = await supabaseClient
                .from('elections')
                .select('id, title, start_date, end_date')
                .eq('is_active', true)
                .single();

            if (electionError || !election) {
                throw new Error('Tidak ada pemilihan yang sedang aktif saat ini.');
            }

            // ✅ Validasi waktu pemilihan
            const now = new Date();
            const start = new Date(election.start_date);
            const end = new Date(election.end_date);

            if (now < start) {
                const diffMs = start - now;
                const diffH = Math.floor(diffMs / 3600000);
                const diffM = Math.floor((diffMs % 3600000) / 60000);
                const sisaWaktu = diffH > 0 ? `${diffH} jam ${diffM} menit` : `${diffM} menit`;
                throw new Error(`Pemilihan belum dimulai. Voting akan dibuka dalam ${sisaWaktu}.`);
            }

            if (now > end) {
                throw new Error('Pemilihan sudah berakhir. Terima kasih atas partisipasi Anda.');
            }

            // Normalisasi nama: hapus spasi berlebih antar kata
            const normalizedNama = namaLengkap.replace(/\s+/g, ' ').trim();

            // Query ke Supabase - cari alumni berdasarkan nama dan generasi
            // .ilike() = case-insensitive: "budi", "BUDI", "Budi" semua cocok
            const { data: alumniData, error: alumniError } = await supabaseClient
                .from('alumni')
                .select('*, users(*)')
                .ilike('nama_lengkap', normalizedNama)
                .eq('generasi', parseInt(generasi))
                .single();

            if (alumniError || !alumniData) {
                throw new Error('Data alumni tidak ditemukan atau generasi tidak sesuai. Periksa kembali nama dan generasi Anda.');
            }

            // Check apakah user aktif
            if (!alumniData.users.is_active) {
                throw new Error('Akun tidak aktif. Silakan hubungi admin!');
            }

            // Check apakah sudah voting
            if (alumniData.has_voted) {
                showAlert('Anda sudah melakukan voting sebelumnya!', 'info');
                setTimeout(() => {
                    window.location.href = '../voting/alumni/voting-result.html';
                }, 2000);
                return;
            }

            // Set session dan data ke localStorage
            AuthHelper.setSession(alumniData.users);
            localStorage.setItem('userRole', 'alumni');
            localStorage.setItem('namaLengkap', alumniData.nama_lengkap);
            localStorage.setItem('generasi', alumniData.generasi);
            localStorage.setItem('alumniId', alumniData.id);
            localStorage.setItem('electionId', election.id);
            localStorage.setItem('electionTitle', election.title);

            // Simpan data tambahan
            localStorage.setItem('divisi', alumniData.divisi || '-');
            localStorage.setItem('jabatan', alumniData.jabatan || '-');
            localStorage.setItem('tahunLulus', alumniData.tahun_lulus || '-');

            // Success
            showAlert('Login berhasil! Selamat datang Kakak Alumni!', 'success');

            // Redirect ke halaman enter code
            setTimeout(() => {
                window.location.href = 'enter-code-alumni.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
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

    const prefillName = sessionStorage.getItem('prefill_alumni_name');
    const prefillGen = sessionStorage.getItem('prefill_alumni_generasi');
    if (prefillName) {
        document.getElementById('identifier').value = prefillName;
        sessionStorage.removeItem('prefill_alumni_name');
    }
    if (prefillGen) {
        document.getElementById('generasi').value = prefillGen;
        sessionStorage.removeItem('prefill_alumni_generasi');
    }
});