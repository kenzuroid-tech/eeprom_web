// Helper functions untuk autentikasi
const AuthHelper = {
    // Hash password sederhana (untuk production gunakan bcrypt di backend)
    hashPassword: async (password) => {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // Simpan session ke localStorage
    setSession: (userData) => {
        localStorage.setItem('userSession', JSON.stringify({
            userId: userData.id,
            username: userData.username,
            role: userData.role,
            loginTime: new Date().toISOString()
        }));
    },

    // Ambil session dari localStorage
    getSession: () => {
        const session = localStorage.getItem('userSession');
        return session ? JSON.parse(session) : null;
    },

    // Hapus session (logout)
    clearSession: () => {
        localStorage.removeItem('userSession');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
    },

    // Check apakah user sudah login
    isAuthenticated: () => {
        return localStorage.getItem('userSession') !== null;
    },

    // Check role user
    checkRole: (requiredRole) => {
        const session = AuthHelper.getSession();
        return session && session.role === requiredRole;
    },

    // Redirect ke dashboard sesuai role
    redirectToDashboard: (role) => {
        const dashboardRoutes = {
            'anggota': '../voting/anggota/voting-dashboard-anggota.html',
            'alumni': '../voting/alumni/voting-dashboard-alumni.html',
            'delegasi': '../voting/delegasi/voting-dashboard-delegasi.html',
            'admin': '../admin/admin-voting-dashboard.html'
        };
        
        window.location.href = dashboardRoutes[role] || 'select-role.html';
    }
};

// Export global
window.AuthHelper = AuthHelper;