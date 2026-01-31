/**
 * Profile Page JavaScript
 * Menampilkan detail member berdasarkan NIM dari URL parameter
 */

// Fungsi untuk mendapatkan parameter dari URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Fungsi untuk mendapatkan foto URL
function getPhotoUrl(member) {
    if (member.foto_url && member.foto_url.trim() !== '') {
        return member.foto_url;
    }
    const encodedName = encodeURIComponent(member.nama_lengkap);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=1A237E&color=fff&size=200`;
}

// Fungsi untuk menentukan role yang ditampilkan
function getDisplayRole(member) {
    const jabatanInti = ['Ketua Umum', 'Sekretaris Umum', 'Sekretaris 1', 'Bendahara Umum', 'Bendahara'];
    
    if (jabatanInti.includes(member.jabatan)) {
        return {
            label: 'Jabatan',
            value: member.jabatan
        };
    } else if (member.jabatan && member.jabatan.toLowerCase().includes('kepala') || 
               member.jabatan && member.jabatan.toLowerCase().includes('wakil')) {
        return {
            label: 'Jabatan',
            value: member.jabatan
        };
    } else {
        return {
            label: 'Divisi',
            value: member.divisi || '-'
        };
    }
}

// Fungsi untuk render profile card utama
function renderProfileCard(member) {
    const photoUrl = getPhotoUrl(member);
    const statusClass = member.status_keanggotaan.toLowerCase() === 'active' ? 'status-active' : 'status-alumni';
    const roleInfo = getDisplayRole(member);
    
    return `
        <div class="profile-avatar-wrapper">
            <img src="${photoUrl}" alt="${member.nama_lengkap}">
        </div>

        <div class="badge-status-profile ${statusClass}">
            ${member.status_keanggotaan} Member
        </div>

        <h1 class="member-name text-truncate px-3">${member.nama_lengkap}</h1>
        <p class="small fw-bold text-muted">NIM. ${member.nim}</p>

        <div class="mini-stats-grid">
            <div class="mini-stat-box">
                <span class="detail-label">${roleInfo.label}</span>
                <span class="detail-value text-primary m-0 small">${roleInfo.value}</span>
            </div>
            <div class="mini-stat-box">
                <span class="detail-label">Generasi</span>
                <span class="detail-value text-primary m-0 small">Gen ${member.generasi}</span>
            </div>
            <div class="mini-stat-box">
                <span class="detail-label">Angkatan</span>
                <span class="detail-value text-primary m-0 small">${member.angkatan || '-'}</span>
            </div>
        </div>
    `;
}

// Fungsi untuk render konten detail
function renderProfileContent(member) {
    const social = member.social_links || {};
    const skills = member.skills ? member.skills.split(',').map(s => s.trim()).filter(s => s !== '') : [];
    
    // Render social media links
    let socialLinksHTML = '';
    if (social.instagram) {
        socialLinksHTML += `<a href="https://instagram.com/${social.instagram}" target="_blank" class="social-link-profile"><i class="fab fa-instagram"></i></a>`;
    }
    if (social.whatsapp) {
        const cleanPhone = social.whatsapp.replace(/[^0-9]/g, '');
        socialLinksHTML += `<a href="https://wa.me/${cleanPhone}" target="_blank" class="social-link-profile"><i class="fab fa-whatsapp"></i></a>`;
    }
    if (social.linkedin) {
        socialLinksHTML += `<a href="https://linkedin.com/in/${social.linkedin}" target="_blank" class="social-link-profile"><i class="fab fa-linkedin"></i></a>`;
    }
    if (!socialLinksHTML) {
        socialLinksHTML = '<p class="small text-muted mb-0">Belum ada social media yang ditambahkan.</p>';
    }
    
    // Render skills
    let skillsHTML = '';
    if (skills.length > 0) {
        skillsHTML = skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('');
    } else {
        skillsHTML = '<p class="small text-muted mb-0">Belum ada skill yang ditambahkan.</p>';
    }
    
    return `
        <div class="col-lg-3">
            <div class="info-card">
                <h3 class="section-title"><i class="bi bi-person-lines-fill"></i> Koneksi</h3>

                <span class="detail-label">Email Address</span>
                <span class="detail-value text-break small">${member.email || '-'}</span>

                <span class="detail-label">Social Media</span>
                <div class="d-flex gap-2 flex-wrap">
                    ${socialLinksHTML}
                </div>
            </div>
        </div>

        <div class="col-lg-5">
            <div class="info-card">
                <h3 class="section-title"><i class="bi bi-chat-left-quote"></i> Bio</h3>
                <p class="text-dark small mb-0" style="text-align: justify; line-height: 1.6;">
                    ${member.bio || 'Anggota ini belum menuliskan deskripsi diri.'}
                </p>
            </div>
        </div>

        <div class="col-lg-4">
            <div class="info-card">
                <h3 class="section-title"><i class="bi bi-cpu"></i> Skill</h3>
                <div class="d-flex flex-wrap gap-2">
                    ${skillsHTML}
                </div>
            </div>
        </div>
    `;
}

// Fungsi untuk menampilkan error page
function showErrorPage() {
    document.getElementById('profileCard').innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-exclamation-circle text-danger" style="font-size: 4rem;"></i>
            <h3 class="mt-3 text-dark">Member Not Found</h3>
            <p class="text-muted">Member dengan NIM tersebut tidak ditemukan.</p>
            <a href="index.html" class="btn btn-primary rounded-pill mt-3">
                <i class="bi bi-arrow-left me-2"></i>Kembali ke Members
            </a>
        </div>
    `;
    
    document.getElementById('profileContent').innerHTML = '';
}

// Fungsi utama untuk load profile
function loadProfile() {
    const nim = getUrlParameter('nim');
    
    if (!nim) {
        showErrorPage();
        return;
    }
    
    // Cari member berdasarkan NIM
    const member = membersData.find(m => m.nim === nim);
    
    if (!member) {
        showErrorPage();
        return;
    }
    
    // Update page title
    document.title = `${member.nama_lengkap} - Profile | EEPROM POLINEMA`;
    
    // Render profile card
    document.getElementById('profileCard').innerHTML = renderProfileCard(member);
    
    // Render profile content
    document.getElementById('profileContent').innerHTML = renderProfileContent(member);
}

// Load profile saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
});