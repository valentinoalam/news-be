# Checklist MVP CMS News Application

## 1. Manajemen Artikel

- [x] **CRUD Artikel**
  - [x] Buat endpoint untuk membuat artikel.
  - [x] Buat endpoint untuk membaca daftar artikel.
  - [x] Buat endpoint untuk memperbarui artikel.
  - [x] Buat endpoint untuk menghapus artikel.
- [x] **Kategori Artikel**
  - [x] CRUD kategori untuk artikel.
  - [x] Filter artikel berdasarkan kategori.
- [x] **Status Artikel**
  - [ ] Buat logika status artikel (*draft*, *published*, *archived*).
- [ ] **Tanggal Publikasi Terjadwal**
  - [ ] Implementasi fitur penjadwalan publikasi otomatis untuk artikel.

## 2. Pengelolaan Media

- [ ] **Upload dan Manajemen Gambar/Video**
  - [ ] Fitur upload gambar/video di editor artikel.
  - [ ] Pengaturan manajemen media (hapus, edit, lihat).
- [ ] **Optimasi Gambar Otomatis**
  - [ ] Skala dan kompresi otomatis gambar yang diunggah.
- [ ] **Galeri Media**
  - [ ] Buat tampilan galeri untuk melihat semua media yang diunggah.

## 3. Pengaturan SEO dan Metadata

- [x] **SEO Basic**
  - [x] Tambahkan kolom untuk metadata (judul, deskripsi, kata kunci).
- [x] **URL Ramah SEO(slug)**
  - [x] Konfigurasi untuk membuat URL otomatis berdasarkan judul artikel.

## 4. Pengaturan Pengguna dan Hak Akses

- [ ] **Pengelolaan Pengguna**
  - [ ] CRUD untuk pengguna dengan peran berbeda (admin, editor, kontributor).
- [ ] **Role dan Permission**
  - [ ] Atur izin berdasarkan peran (akses terbatas untuk setiap fitur).

## 5. Frontend Pembaca Berita

- [x] **Tampilan Artikel**
  - [x] Tampilan halaman artikel yang responsif dan menarik.
- [x] **Homepage dengan Artikel Terkini**
  - [x] Daftar artikel terkini di halaman utama, berdasarkan tanggal dan popularitas.
- [x] **Navigasi Berdasarkan Kategori**
  - [x] Menu navigasi berdasarkan kategori berita.

## 6. Pencarian dan Filter Artikel

- [x] **Fitur Pencarian**
  - [x] Fungsi pencarian artikel berdasarkan judul, kata kunci, atau penulis.
- [x] **Filter Berdasarkan Kategori dan Tanggal**
  - [x] Filter artikel berdasarkan kategori atau tanggal publikasi.

## 7. Autentikasi User

- [ ] **Fitur Pencarian**
  - [ ] Fungsi pencarian artikel berdasarkan judul, kata kunci, atau penulis.
- [ ] **Filter Berdasarkan Kategori dan Tanggal**
  - [ ] Filter artikel berdasarkan kategori atau tanggal publikasi.

## 8. Komentar dan Interaksi Pembaca

- [ ] **Fitur Komentar Pembaca**
  - [ ] Buat kolom komentar pada setiap artikel.
- [ ] **Pengaturan Moderasi Komentar**
  - [ ] Buat fitur moderasi komentar sebelum terbit (opsional).

## 9. Dashboard Analitik Dasar

- [ ] **Data Pembaca**
  - [ ] Statistik jumlah pembaca untuk setiap artikel.
- [ ] **Artikel Terpopuler**
  - [ ] Daftar artikel berdasarkan jumlah tampilan.
- [ ] **Waktu Pembaca Aktif**
  - [ ] Data waktu aktif pembaca di situs.

## 10. Pengelolaan Halaman Statis

- [ ] **Halaman Statis**
  - [ ] CRUD untuk halaman seperti *About Us* dan *Contact*.

## 11. Keamanan dan Performansi Dasar

- [ ] **Proteksi Brute Force Login**
  - [ ] Sistem keamanan login untuk menghindari serangan brute-force.
- [ ] **Caching untuk Halaman Utama dan Artikel**
  - [ ] Caching pada halaman utama dan artikel untuk meningkatkan performa.
- [ ] **Keamanan SSL dan Otentikasi JWT**
  - [ ] SSL untuk keamanan data, JWT untuk otentikasi API.
