// ============================================
// ADMIN GUARD - Proteksi Halaman Admin
// ============================================

(function() {
    'use strict';

    // Check authentication saat halaman dimuat
    window.addEventListener('DOMContentLoaded', function() {
        checkAdminAuth();
    });

    function checkAdminAuth() {
        const session = AuthHelper.getSession();

        // Jika tidak ada session, redirect ke login
        if (!session) {
            console.warn('⚠️ Tidak ada session, redirect ke login admin');
            window.location.href = 'login-admin.html';
            return;
        }

        // Jika bukan admin, redirect ke login
        if (session.role !== 'admin') {
            console.warn('⚠️ Bukan admin, akses ditolak!');
            alert('Akses ditolak! Anda tidak memiliki hak akses admin.');
            AuthHelper.clearSession();
            window.location.href = 'login-admin.html';
            return;
        }

        // Admin terverifikasi
        console.log('✅ Admin terverifikasi:', session.username);
        
        // Display admin info di navbar (jika ada element dengan id adminInfo)
        const adminInfoElement = document.getElementById('adminInfo');
        if (adminInfoElement) {
            const adminName = localStorage.getItem('adminName') || 'Administrator';
            adminInfoElement.textContent = adminName;
        }

        // Display username (jika ada element dengan id adminUsername)
        const adminUsernameElement = document.getElementById('adminUsername');
        if (adminUsernameElement) {
            adminUsernameElement.textContent = session.username;
        }
    }

    // Logout function
    window.adminLogout = function() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            AuthHelper.clearSession();
            window.location.href = 'login-admin.html';
        }
    };

    // Session timeout (30 menit)
    let sessionTimeout;
    function resetSessionTimeout() {
        clearTimeout(sessionTimeout);
        sessionTimeout = setTimeout(() => {
            alert('Session telah berakhir. Silakan login kembali.');
            adminLogout();
        }, 30 * 60 * 1000); // 30 menit
    }

    // Reset timeout saat ada aktivitas
    document.addEventListener('click', resetSessionTimeout);
    document.addEventListener('keypress', resetSessionTimeout);
    resetSessionTimeout();

})();