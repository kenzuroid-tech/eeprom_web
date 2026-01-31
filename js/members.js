function getJabatanPriority(jabatan) {
    const jabatanLower = (jabatan || '').toLowerCase().trim();

    if (jabatanLower === 'ketua umum') return 1;

    const bph = ['sekretaris umum', 'sekretaris 1', 'bendahara umum', 'bendahara'];
    if (bph.includes(jabatanLower)) return 2;

    if (jabatanLower.includes('kepala divisi') || jabatanLower.includes('ketua divisi')) return 3;

    if (jabatanLower.includes('wakil kepala divisi')) return 4;

    return 5;
}

/**
 * Fungsi untuk mendapatkan nama badge berdasarkan prioritas
 */
function getBadgeClass(priority) {
    if (priority < 5) return `badge-prio-${priority}`;
    return 'badge-divisi';
}

/**
 * Fungsi untuk mendapatkan status class
 */
function getStatusClass(status) {
    return status.toLowerCase() === 'active' ? 'status-active' : 'status-alumni';
}

/**
 * Fungsi untuk generate URL foto default (UI Avatars)
 */
function getPhotoUrl(member) {
    if (member.foto_url && member.foto_url.trim() !== '') {
        return member.foto_url;
    }
    const encodedName = encodeURIComponent(member.nama_lengkap);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=1A237E&color=fff`;
}

/**
 * Fungsi untuk mengelompokkan data berdasarkan generasi
 */
function groupByGeneration(members) {
    const grouped = {};
    members.forEach(member => {
        if (!grouped[member.generasi]) {
            grouped[member.generasi] = [];
        }
        grouped[member.generasi].push(member);
    });
    return grouped;
}

/**
 * Fungsi untuk mengurutkan anggota berdasarkan prioritas jabatan
 */
function sortMembersByPriority(members) {
    return members.sort((a, b) => {
        const prioA = getJabatanPriority(a.jabatan);
        const prioB = getJabatanPriority(b.jabatan);

        if (prioA === prioB) {
            return a.nama_lengkap.localeCompare(b.nama_lengkap);
        }
        return prioA - prioB;
    });
}

/**
 * Fungsi untuk membuat card member
 */
function createMemberCard(member, isLeader = false) {
    const priority = getJabatanPriority(member.jabatan);
    const statusClass = getStatusClass(member.status_keanggotaan);
    const photoUrl = getPhotoUrl(member);
    const roleDisplay = priority < 5 ? member.jabatan : member.divisi;
    const badgeClass = getBadgeClass(priority);

    if (isLeader) {
        return `
            <div class="member-card shadow-sm" style="max-width: 350px;">
                <span class="badge-status ${statusClass}">${member.status_keanggotaan}</span>
                <div class="member-img-wrapper" style="width: 150px; height: 150px;">
                    <img src="${photoUrl}" alt="${member.nama_lengkap}">
                </div>
                <h5 class="member-name">${member.nama_lengkap}</h5>
                <span class="badge badge-prio-1 px-3 py-2 rounded-pill mb-3 d-inline-block" style="font-size: 0.75rem; font-weight: 800;">
                    ${member.jabatan.toUpperCase()}
                </span>
                <br>
                <a href="/profile.html?nim=${member.nim}" class="btn-profile">View Profile <i class="bi bi-arrow-right ms-1"></i></a>
            </div>
        `;
    }

    return `
        <div class="member-card shadow-sm text-center">
            <span class="badge-status ${statusClass}">${member.status_keanggotaan}</span>
            <div class="member-img-wrapper">
                <img src="${photoUrl}" alt="${member.nama_lengkap}">
            </div>
            <h5 class="member-name text-truncate px-2">${member.nama_lengkap}</h5>
            <span class="member-nim">${member.nim}</span>
            <span class="badge ${badgeClass} d-inline-block text-truncate mb-2 px-3 py-2 rounded-pill" style="max-width: 90%; font-size: 0.65rem;">
                ${roleDisplay}
            </span>
            <br>
            <a href="/profile.html?nim=${member.nim}" class="btn-profile">View Profile <i class="bi bi-arrow-right ms-1"></i></a>
        </div>
    `;
}

/**
 * Fungsi untuk render tabs dan konten
 */
function renderContent() {
    const membersByGen = groupByGeneration(membersData);
    const generations = Object.keys(membersByGen).sort((a, b) => b - a); // Urutkan descending

    // Generate tabs
    const tabsContainer = document.getElementById('genTabs');
    const tabsHTML = generations.map((gen, index) => {
        const isActive = index === 0 ? 'active' : '';
        return `
            <li class="nav-item">
                <button class="nav-link ${isActive}" 
                    data-bs-toggle="tab" 
                    data-bs-target="#gen${gen}" 
                    type="button">
                    Gen ${gen}
                </button>
            </li>
        `;
    }).join('');
    tabsContainer.innerHTML = tabsHTML;

    // Generate tab content
    const contentContainer = document.getElementById('genTabsContent');
    const contentHTML = generations.map((gen, index) => {
        const members = sortMembersByPriority([...membersByGen[gen]]);
        const isActive = index === 0 ? 'show active' : '';

        // Pisahkan leader dan staff
        let leader = null;
        const staff = [];

        members.forEach(member => {
            if (getJabatanPriority(member.jabatan) === 1) {
                leader = member;
            } else {
                staff.push(member);
            }
        });

        return `
            <div class="tab-pane fade ${isActive}" id="gen${gen}">
                <div class="team-structure-wrapper">
                    ${leader ? `
                        <div class="leader-container">
                            ${createMemberCard(leader, true)}
                        </div>
                    ` : ''}
                    
                    <div class="staff-grid-wrapper">
                        ${staff.map(member => createMemberCard(member)).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    contentContainer.innerHTML = contentHTML;
}

// Jalankan fungsi render saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    renderContent();
});

fetch('includes/navbar.html')
    .then(response => {
        if (!response.ok) throw new Error('Gagal memuat navbar');
        return response.text();
    })
    .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error:', error));

fetch('includes/footer.html')
    .then(response => {
        if (!response.ok) throw new Error('Gagal memuat footer');
        return response.text();
    })
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error:', error));