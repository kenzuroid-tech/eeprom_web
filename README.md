# EEPROM Web Platform

Platform web interaktif untuk organisasi EEPROM dengan sistem voting, manajemen anggota, dan autentikasi berbasis peran.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi dan Setup](#instalasi-dan-setup)
- [Sistem Autentikasi](#sistem-autentikasi)
- [Panduan Penggunaan](#panduan-penggunaan)
- [Kontribusi](#kontribusi)

## ✨ Fitur Utama

### 1. **Sistem Voting Terintegrasi**
- Dashboard voting untuk anggota, alumni, dan delegasi
- Panel admin untuk mengelola pemilihan
- Manajemen kode akses untuk voting
- Hasil real-time dan statistik voting
- Kandidat management

### 2. **Autentikasi Berbasis Peran**
- Login terpisah untuk Alumni, Anggota, dan Delegasi
- Sistem login Admin untuk pengelolaan
- Guard dan helper untuk proteksi route

### 3. **Manajemen Anggota**
- Profil anggota dengan informasi lengkap
- Halaman prestasi
- Halaman member directory
- Halaman kontak

### 4. **Divisi Organisasi**
- Halaman masing-masing divisi:
  - Elektrik
  - Mekanik
  - Software
  - Humas

### 5. **Fitur Tambahan**
- Desain responsif
- Navigasi yang user-friendly
- Integrasi dengan Supabase untuk backend
- Dashboard dan analytics

## 🛠️ Teknologi yang Digunakan

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
  
- **Backend/Database:**
  - Supabase (Authentication & Database)
  
- **Tools:**
  - Node.js (untuk build tools jika diperlukan)

## 📁 Struktur Proyek

```
eeprom_web/
├── index.html                 # Halaman utama
├── members.html              # Halaman anggota
├── profile.html              # Halaman profil
├── contact.html              # Halaman kontak
├── debug-user-check.html     # Debug utility
│
├── css/                       # Stylesheet
│   ├── index.css
│   ├── members.css
│   ├── profile.css
│   ├── contact.css
│   └── auth/
│       └── select-role.css
│
├── js/                        # JavaScript files
│   ├── data.js               # Data management
│   ├── members.js
│   ├── prestasi.js
│   ├── profile.js
│   ├── config/
│   │   └── supabase-config.js
│   └── auth/
│       ├── auth-helper.js
│       ├── dmin-guard.js
│       ├── login-alumni.js
│       ├── login-anggota.js
│       └── login-delegasi.js
│
├── divisi/                    # Halaman divisi
│   ├── elektrik.html
│   ├── mekanik.html
│   ├── software.html
│   └── humas.html
│
├── voting/                    # Sistem voting
│   ├── auth/                  # Login voting
│   │   ├── login-alumni.html
│   │   ├── login-anggota.html
│   │   └── login-delegasi.html
│   ├── voting/                # Interface voting
│   │   ├── alumni/
│   │   ├── anggota/
│   │   └── delegasi/
│   └── admin/                 # Panel admin
│       ├── admin-voting-dashboard.html
│       ├── admin-candidates.html
│       ├── admin-results.html
│       └── admin-access-codes.html
│
├── includes/                  # Komponen reusable
│   ├── navbar.html
│   └── footer.html
│
├── images/                    # Asset gambar
│
└── package.json              # Project metadata
```

## 🚀 Instalasi dan Setup

### Prerequisites
- Browser modern (Chrome, Firefox, Safari, Edge)
- Akun Supabase (untuk authentikasi dan database)
- Text editor atau IDE

### Langkah Setup

1. **Clone atau Download Repository**
   ```bash
   git clone <repository-url>
   cd eeprom_web
   ```

2. **Konfigurasi Supabase**
   - Buka file `js/config/supabase-config.js`
   - Ganti `SUPABASE_URL` dan `SUPABASE_KEY` dengan credential Supabase Anda:
   ```javascript
   const SUPABASE_URL = 'your-supabase-url';
   const SUPABASE_KEY = 'your-supabase-key';
   ```

3. **Setup Database Supabase**
   - Buat tabel yang diperlukan sesuai dokumentasi Supabase
   - Setup authentication methods (Email, SSO, dll)

4. **Jalankan Aplikasi**
   - Buka `index.html` di browser
   - Atau gunakan local server (contoh: Live Server extension di VS Code)

## 🔐 Sistem Autentikasi

### Tiga Tier Pengguna

| Pengguna | Login | Akses |
|----------|-------|-------|
| **Alumni** | `login-alumni.html` | Voting, Profil, Data Anggota |
| **Anggota** | `login-anggota.html` | Voting, Profil, Data Anggota |
| **Delegasi** | `login-delegasi.html` | Voting, Profil |
| **Admin** | `admin-voting-dashboard.html` | Panel kontrol penuh, Manajemen voting |

### File Autentikasi Kunci
- `js/auth/auth-helper.js` - Helper function untuk autentikasi
- `js/auth/dmin-guard.js` - Proteksi admin routes
- `js/config/supabase-config.js` - Konfigurasi koneksi Supabase

## 📖 Panduan Penggunaan

### Untuk Anggota/Alumni/Delegasi
1. Masuk ke halaman voting yang sesuai
2. Login dengan kredensial Anda
3. Masukkan kode akses voting (diberikan oleh admin)
4. Pilih kandidat dan submit vote
5. Lihat konfirmasi hasil voting

### Untuk Admin
1. Akses `voting/admin/admin-voting-dashboard.html`
2. Login sebagai admin
3. Kelola:
   - **Candidates**: Tambah/edit kandidat
   - **Access Codes**: Generate dan manage kode akses
   - **Elections**: Buat dan kelola pemilihan
   - **Results**: Lihat hasil voting real-time

### Fitur Lainnya
- **Members**: Lihat direktori anggota organisasi
- **Divisi**: Jelajahi halaman divisi (Elektrik, Mekanik, Software, Humas)
- **Profile**: Update profil pribadi
- **Contact**: Hubungi organisasi

## 🤝 Kontribusi

Kami menerima kontribusi! Untuk berkontribusi:

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Guidelines
- Ikuti style code yang ada
- Test fitur sebelum submit
- Update dokumentasi jika perlu
- Struktur folder tetap rapi

## 📝 Lisensi

Proyek ini adalah proprietary software untuk organisasi EEPROM.

---

**Untuk pertanyaan atau support, silakan hubungi tim development EEPROM.**
