// Data anggota EEPROM per generasi
const membersData = [
    // Generasi 1
    {
        nim: '2341720001',
        nama_lengkap: 'Ahmad Rizki Pratama',
        jabatan: 'Ketua Umum',
        divisi: 'Kepemimpinan',
        status_keanggotaan: 'Active',
        generasi: 1,
        foto_url: ''
    },
    {
        nim: '2341720002',
        nama_lengkap: 'Siti Nurhaliza',
        jabatan: 'Sekretaris Umum',
        divisi: 'Administrasi',
        status_keanggotaan: 'Active',
        generasi: 1,
        foto_url: ''
    },
    {
        nim: '2341720003',
        nama_lengkap: 'Budi Santoso',
        jabatan: 'Bendahara Umum',
        divisi: 'Keuangan',
        status_keanggotaan: 'Active',
        generasi: 1,
        foto_url: ''
    },
    {
        nim: '2341720004',
        nama_lengkap: 'Dina Amelia',
        jabatan: 'Kepala Divisi',
        divisi: 'Riset dan Pengembangan',
        status_keanggotaan: 'Active',
        generasi: 1,
        foto_url: ''
    },
    {
        nim: '2341720005',
        nama_lengkap: 'Eko Prasetyo',
        jabatan: 'Wakil Kepala Divisi',
        divisi: 'Riset dan Pengembangan',
        status_keanggotaan: 'Active',
        generasi: 1,
        foto_url: ''
    },
    {
        nim: '2341720006',
        nama_lengkap: 'Fitri Handayani',
        jabatan: 'Anggota',
        divisi: 'Media dan Publikasi',
        status_keanggotaan: 'Active',
        generasi: 1,
        foto_url: ''
    },
    {
        nim: '2341720007',
        nama_lengkap: 'Gilang Ramadhan',
        jabatan: 'Anggota',
        divisi: 'Kompetisi',
        status_keanggotaan: 'Active',
        generasi: 1,
        foto_url: ''
    },
    {
        nim: '2341720008',
        nama_lengkap: 'Hana Safitri',
        jabatan: 'Anggota',
        divisi: 'Pelatihan',
        status_keanggotaan: 'Active',
        generasi: 1,
        foto_url: ''
    },

    // Generasi 2
    {
        nim: '2341720101',
        nama_lengkap: 'Indra Gunawan',
        jabatan: 'Ketua Umum',
        divisi: 'Kepemimpinan',
        status_keanggotaan: 'Active',
        generasi: 2,
        foto_url: ''
    },
    {
        nim: '2341720102',
        nama_lengkap: 'Jihan Azzahra',
        jabatan: 'Sekretaris Umum',
        divisi: 'Administrasi',
        status_keanggotaan: 'Active',
        generasi: 2,
        foto_url: ''
    },
    {
        nim: '2341720103',
        nama_lengkap: 'Kurniawan Aditya',
        jabatan: 'Bendahara',
        divisi: 'Keuangan',
        status_keanggotaan: 'Active',
        generasi: 2,
        foto_url: ''
    },
    {
        nim: '2341720104',
        nama_lengkap: 'Lisa Permata',
        jabatan: 'Kepala Divisi',
        divisi: 'Media dan Publikasi',
        status_keanggotaan: 'Active',
        generasi: 2,
        foto_url: ''
    },
    {
        nim: '2341720105',
        nama_lengkap: 'Muhammad Fahri',
        jabatan: 'Wakil Kepala Divisi',
        divisi: 'Media dan Publikasi',
        status_keanggotaan: 'Active',
        generasi: 2,
        foto_url: ''
    },
    {
        nim: '2341720106',
        nama_lengkap: 'Nadia Putri',
        jabatan: 'Anggota',
        divisi: 'Riset dan Pengembangan',
        status_keanggotaan: 'Active',
        generasi: 2,
        foto_url: ''
    },
    {
        nim: '2341720107',
        nama_lengkap: 'Omar Syarif',
        jabatan: 'Anggota',
        divisi: 'Kompetisi',
        status_keanggotaan: 'Active',
        generasi: 2,
        foto_url: ''
    },
    {
        nim: '2341720108',
        nama_lengkap: 'Putri Maharani',
        jabatan: 'Anggota',
        divisi: 'Pelatihan',
        status_keanggotaan: 'Active',
        generasi: 2,
        foto_url: ''
    },
    {
        nim: '2341720109',
        nama_lengkap: 'Reza Ananda',
        jabatan: 'Anggota',
        divisi: 'Logistik',
        status_keanggotaan: 'Active',
        generasi: 2,
        foto_url: ''
    },

    // Generasi 3
    {
        nim: '2341720201',
        nama_lengkap: 'Sari Dewi',
        jabatan: 'Ketua Umum',
        divisi: 'Kepemimpinan',
        status_keanggotaan: 'Active',
        generasi: 3,
        foto_url: ''
    },
    {
        nim: '2341720202',
        nama_lengkap: 'Taufik Hidayat',
        jabatan: 'Sekretaris 1',
        divisi: 'Administrasi',
        status_keanggotaan: 'Active',
        generasi: 3,
        foto_url: ''
    },
    {
        nim: '2341720203',
        nama_lengkap: 'Umar Faruq',
        jabatan: 'Bendahara Umum',
        divisi: 'Keuangan',
        status_keanggotaan: 'Active',
        generasi: 3,
        foto_url: ''
    },
    {
        nim: '2341720204',
        nama_lengkap: 'Vina Malika',
        jabatan: 'Kepala Divisi',
        divisi: 'Kompetisi',
        status_keanggotaan: 'Active',
        generasi: 3,
        foto_url: ''
    },
    {
        nim: '2341720205',
        nama_lengkap: 'Wulan Sari',
        jabatan: 'Anggota',
        divisi: 'Riset dan Pengembangan',
        status_keanggotaan: 'Active',
        generasi: 3,
        foto_url: ''
    },
    {
        nim: '2341720206',
        nama_lengkap: 'Xavier Pratama',
        jabatan: 'Anggota',
        divisi: 'Media dan Publikasi',
        status_keanggotaan: 'Active',
        generasi: 3,
        foto_url: ''
    },
    {
        nim: '2341720207',
        nama_lengkap: 'Yuni Kartika',
        jabatan: 'Anggota',
        divisi: 'Pelatihan',
        status_keanggotaan: 'Active',
        generasi: 3,
        foto_url: ''
    },
    {
        nim: '2341720208',
        nama_lengkap: 'Zaki Rahman',
        jabatan: 'Anggota',
        divisi: 'Logistik',
        status_keanggotaan: 'Active',
        generasi: 3,
        foto_url: ''
    },
    {
        nim: '2341720209',
        nama_lengkap: 'Adinda Putri',
        jabatan: 'Anggota',
        divisi: 'Humas',
        status_keanggotaan: 'Active',
        generasi: 3,
        foto_url: ''
    },
    {
        nim: '2341720210',
        nama_lengkap: 'Brian Mahendra',
        jabatan: 'Anggota',
        divisi: 'Dokumentasi',
        status_keanggotaan: 'Active',
        generasi: 3,
        foto_url: ''
    }
];