// login-delegasi.js

console.log('🔄 Login Delegasi JS loaded');

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('delegasiLoginForm');

    // Handle Form Submit
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Normalisasi: hapus spasi berlebih, case tidak diubah (disimpan apa adanya)
        const namaLengkap = document.getElementById('namaLengkap').value.replace(/\s+/g, ' ').trim();
        const nim = document.getElementById('nim').value.trim();
        const asalDelegasi = document.getElementById('asalDelegasi').value.replace(/\s+/g, ' ').trim();

        console.log('📝 Login attempt:', { namaLengkap, nim, asalDelegasi });

        // Validasi input
        if (!namaLengkap || !nim || !asalDelegasi) {
            showAlert('Mohon lengkapi semua field!', 'warning');
            return;
        }

        // Show loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memverifikasi...';

        try {
            console.log('🔍 Processing delegasi login...');

            // Get active election first (tambahkan start_date & end_date)
            const { data: election, error: electionError } = await supabaseClient
                .from('elections')
                .select('id, title, start_date, end_date')
                .eq('is_active', true)
                .single();

            if (electionError || !election) {
                console.error('❌ No active election:', electionError);
                throw new Error('Tidak ada pemilihan yang sedang aktif saat ini.');
            }

            console.log('✅ Active election found:', election);

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

            // Check if already voted using NIM as identifier
            const { data: voteData, error: voteError } = await supabaseClient
                .from('votes')
                .select('*')
                .eq('election_id', election.id)
                .eq('voter_identifier', nim)
                .eq('voter_role', 'delegasi')
                .maybeSingle();

            if (voteData) {
                console.warn('⚠️ Already voted!');
                throw new Error('NIM ini sudah melakukan voting untuk pemilihan ini!');
            }

            // Generate unique access code for delegasi
            const accessCode = generateDelegasiCode(asalDelegasi);
            console.log('🔑 Generated access code:', accessCode);

            // Save to localStorage (SAMA SEPERTI ALUMNI & ANGGOTA)
            localStorage.setItem('namaLengkap', namaLengkap);
            localStorage.setItem('nim', nim);
            localStorage.setItem('asalDelegasi', asalDelegasi);
            localStorage.setItem('electionId', election.id);
            localStorage.setItem('electionTitle', election.title);
            localStorage.setItem('userType', 'delegasi');
            localStorage.setItem('accessCode', accessCode);

            console.log('✅ Data saved to localStorage');

            // Success
            showAlert('✓ Login berhasil! Kode akses telah dibuat. Mengalihkan...', 'success');

            // Redirect ke halaman enter code
            setTimeout(() => {
                window.location.href = 'enter-code-delegasi.html';
            }, 1500);

        } catch (error) {
            console.error('❌ Login error:', error);
            showAlert(error.message, 'danger');

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Function untuk generate kode delegasi
    function generateDelegasiCode(asalDelegasi) {
        // Format: DELEGASI-[SINGKATAN]-[RANDOM]
        // Contoh: DELEGASI-HMTI-A7B9
        const prefix = 'DELEGASI';
        const orgShort = asalDelegasi.toUpperCase().substring(0, 4).replace(/\s/g, '');
        const randomPart = generateRandomString(4);
        return `${prefix}-${orgShort}-${randomPart}`;
    }

    // Function untuk generate random string
    function generateRandomString(length) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Tanpa huruf yang mirip: I, O, 0, 1
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

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