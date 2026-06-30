# PROPOSAL PROYEK AKHIR

---

## ASPIRA
### Aplikasi Sistem Presensi dan Informasi
### SMK Perpajakan Riau

**Diajukan sebagai Proyek Pengembangan Sistem Informasi**

---

**SMK PERPAJAKAN RIAU**  
Jl. Purnama No. 05, Pandau Jaya, Kec. Siak Hulu, Kabupaten Kampar, Riau  
Tahun 2026

---

## BAB I — PENDAHULUAN

---

### 1.1 Latar Belakang

Perkembangan teknologi informasi yang semakin pesat di era digitalisasi saat ini memberikan dampak besar terhadap berbagai sektor kehidupan, termasuk dunia pendidikan. Lembaga pendidikan dituntut untuk dapat beradaptasi dan memanfaatkan teknologi sebagai alat untuk meningkatkan efisiensi serta kualitas pelayanan administrasi akademik.

SMK Perpajakan Riau merupakan satu-satunya sekolah menengah kejuruan yang berbasis perpajakan di Provinsi Riau, dengan visi menjadi lembaga pendidikan yang mampu menghasilkan lulusan yang kompeten, profesional, dan berintegritas. Sebagai sekolah yang terus berkembang, SMK Perpajakan Riau memiliki kebutuhan yang tinggi terhadap sistem pengelolaan data yang akurat, efisien, dan mudah diakses.

Salah satu proses administrasi yang paling krusial dalam kegiatan belajar mengajar adalah pencatatan kehadiran (presensi) siswa. Presensi bukan sekadar formalitas administratif, melainkan merupakan indikator penting dalam mengukur kedisiplinan, partisipasi aktif, dan kemajuan belajar seorang siswa. Berdasarkan ketentuan Kemendikdasmen, ketidakhadiran siswa yang melebihi batas yang ditentukan dapat mempengaruhi nilai akhir hingga berujung pada tidak diperkenankannya siswa mengikuti ujian akhir.

Saat ini, proses pencatatan kehadiran di SMK Perpajakan Riau masih dilakukan secara konvensional, yakni dengan memanfaatkan lembar daftar hadir fisik (kertas) yang diisi oleh guru pengajar di setiap pertemuan. Metode ini menimbulkan berbagai permasalahan, seperti risiko data hilang atau rusak, sulitnya proses rekap data secara berkala, keterlambatan penyampaian informasi kepada orang tua, serta tidak adanya akses daring yang memungkinkan pemantauan kehadiran secara *real-time*.

Bertolak dari permasalahan tersebut, dibutuhkan sebuah solusi teknologi berbasis web yang mampu mengotomatisasi proses pencatatan, pengelolaan, dan pelaporan data presensi secara terpusat, efisien, dan dapat diakses dari berbagai perangkat — baik komputer *desktop* maupun perangkat *mobile* Android. Oleh karena itu, dikembangkanlah **ASPIRA (Aplikasi Sistem Presensi dan Informasi SMK Perpajakan Riau)** sebagai jawaban atas kebutuhan digitalisasi administrasi akademik yang modern, andal, dan sesuai dengan identitas institusi.

---

### 1.2 Identifikasi Masalah

Berdasarkan uraian latar belakang di atas, dapat diidentifikasi sejumlah permasalahan yang ada di SMK Perpajakan Riau terkait sistem presensi saat ini, yaitu:

1. **Tidak efisiennya proses pencatatan presensi secara manual** yang masih menggunakan lembar kertas, sehingga memakan waktu dan berpotensi menimbulkan kesalahan pencatatan (*human error*).

2. **Sulitnya proses rekap dan kompilasi data kehadiran** yang dilakukan secara periodik (mingguan/bulanan/semester) karena harus dikerjakan secara manual oleh guru atau staf tata usaha.

3. **Tidak adanya sistem pelaporan otomatis** kepada pihak yang berkepentingan (kepala sekolah, wali kelas, atau orang tua) apabila terjadi ketidakhadiran yang melebihi ambang batas yang telah ditentukan.

4. **Tidak tersedianya akses informasi kehadiran secara daring** (*real-time*) bagi siswa untuk memantau rekam jejak presensi mereka sendiri secara mandiri.

5. **Tidak adanya sistem pengelolaan data guru, siswa, kelas, dan jadwal pelajaran** yang terintegrasi dalam satu platform digital yang terpusat dan mudah dioperasikan.

6. **Risiko kehilangan dan kerusakan data** akibat penyimpanan yang masih berbasis fisik (kertas) dan belum didukung cadangan data digital (*data backup*) yang sistematis.

---

### 1.3 Rumusan Masalah

Berdasarkan identifikasi masalah yang telah dijabarkan, maka rumusan masalah dalam proyek ini adalah sebagai berikut:

1. Bagaimana merancang dan membangun sistem presensi berbasis web yang dapat menggantikan proses pencatatan kehadiran secara manual di SMK Perpajakan Riau?

2. Bagaimana mengimplementasikan sistem manajemen data terpadu yang mencakup pengelolaan data guru, siswa, kelas, mata pelajaran, dan jadwal pelajaran dalam satu platform?

3. Bagaimana menyediakan fitur pelaporan dan rekap data absensi secara otomatis yang dapat diakses oleh masing-masing *role* pengguna (admin, guru, dan siswa) sesuai dengan hak aksesnya?

4. Bagaimana membangun antarmuka pengguna (*user interface*) yang responsif sehingga aplikasi dapat digunakan secara optimal baik di perangkat *desktop* maupun perangkat *mobile* Android?

---

### 1.4 Batasan Masalah

Agar pembahasan dalam proyek ini lebih terarah dan terstruktur, maka ditetapkan batasan-batasan sebagai berikut:

1. Sistem yang dikembangkan **hanya mencakup lingkup SMK Perpajakan Riau** dan tidak dimaksudkan untuk diimplementasikan pada institusi pendidikan lain.

2. Pengguna sistem dibatasi pada tiga *role* pengguna, yaitu:
   - **Administrator** (Super Admin): Memiliki akses penuh untuk mengelola seluruh data master sistem, termasuk data guru, siswa, kelas, mata pelajaran, jadwal, dan pengguna.
   - **Guru**: Memiliki akses untuk melakukan pencatatan presensi kelas, memantau riwayat absensi, dan melihat statistik kehadiran siswa pada kelas yang diampunya.
   - **Siswa**: Memiliki akses terbatas untuk memantau rekam jejak kehadiran pribadi mereka sendiri.

3. Sistem presensi yang dibangun adalah **presensi berbasis rekam data digital oleh guru** melalui antarmuka web dan tidak mencakup teknologi biometrik (sidik jari/wajah) maupun QR Code.

4. Laporan yang dihasilkan sistem mencakup laporan **harian, mingguan, bulanan, dan per semester**, dalam format yang dapat dicetak atau diekspor.

5. Teknologi yang digunakan dalam pengembangan sistem ini adalah:
   - **Front-end Framework**: Vue.js 3 dengan Composition API
   - **Back-end & Database**: Supabase (berbasis PostgreSQL *cloud*)
   - **Build Tool**: Vite
   - **Bahasa Pemrograman**: JavaScript (ES6+)

6. Pengujian sistem dilakukan secara fungsional pada **jaringan lokal (LAN/Wi-Fi)** dan tidak mencakup penerapan (*deployment*) di server publik (*web hosting*) dalam lingkup proyek ini.

---

### 1.5 Tujuan dan Manfaat

#### 1.5.1 Tujuan

Tujuan dari pengembangan proyek ASPIRA ini adalah:

1. Merancang dan membangun sebuah aplikasi sistem presensi dan informasi berbasis web yang modern untuk SMK Perpajakan Riau dengan nama **ASPIRA (Aplikasi Sistem Presensi dan Informasi SMK Perpajakan Riau)**.

2. Mengimplementasikan sistem manajemen data akademik yang terintegrasi, meliputi pengelolaan data guru, siswa, kelas, mata pelajaran, dan jadwal pelajaran dalam satu platform terpadu.

3. Menghadirkan fitur pencatatan presensi secara digital oleh guru yang dapat diakses dari perangkat *desktop* maupun perangkat *mobile* Android secara responsif.

4. Menyediakan sistem pelaporan dan rekap kehadiran yang otomatis dan dapat diakses sesuai hak akses masing-masing pengguna (admin, guru, siswa).

5. Meningkatkan efisiensi, akurasi, dan transparansi dalam proses pengelolaan data kehadiran di lingkungan SMK Perpajakan Riau.

#### 1.5.2 Manfaat

Pengembangan aplikasi ASPIRA ini diharapkan dapat memberikan manfaat nyata bagi berbagai pihak, di antaranya:

**a. Bagi Sekolah (Institusi)**
- Mewujudkan digitalisasi administrasi akademik yang selaras dengan program transformasi digital pendidikan nasional.
- Tersedianya data presensi yang akurat, terpusat, dan mudah diakses sebagai dasar pengambilan keputusan manajerial.
- Mengurangi beban kerja administratif staf tata usaha dalam proses rekap dan pembuatan laporan kehadiran secara berkala.
- Meningkatkan citra sekolah sebagai institusi pendidikan yang modern dan berbasis teknologi.

**b. Bagi Guru**
- Memudahkan proses pencatatan presensi siswa secara cepat, efisien, dan akurat tanpa bergantung pada media kertas.
- Menyediakan akses statistik dan riwayat kehadiran kelas yang dapat dipantau secara langsung (*real-time*).
- Mempermudah proses pembuatan dan pengelolaan laporan kehadiran per kelas, per mata pelajaran, maupun per periode waktu.

**c. Bagi Siswa**
- Memberikan transparansi kepada siswa untuk secara mandiri memantau rekam jejak kehadiran mereka melalui portal daring.
- Mendorong kesadaran dan kedisiplinan siswa terhadap kehadiran sebagai bagian dari pembentukan karakter dan etos kerja yang profesional.

**d. Bagi Pengembang**
- Memberikan pengalaman nyata dalam merancang, membangun, dan mengimplementasikan sistem informasi berbasis web yang terintegrasi dengan teknologi *cloud* modern.
- Meningkatkan kompetensi teknis di bidang pengembangan aplikasi web menggunakan *framework* Vue.js 3, Supabase, dan ekosistem pengembangan modern.
- Menghasilkan karya nyata yang dapat dijadikan portofolio pengembangan aplikasi pendidikan berbasis teknologi.

---

*Dokumen ini merupakan bagian dari proposal pengembangan proyek sistem informasi akademik SMK Perpajakan Riau — ASPIRA Tahun 2026.*

---

## BAB II — TINJAUAN PUSTAKA

---

### 2.1 Sistem Informasi

Sistem informasi adalah sekumpulan komponen yang saling berinteraksi untuk mengumpulkan, memproses, menyimpan, dan mendistribusikan informasi guna mendukung pengambilan keputusan dan pengendalian dalam sebuah organisasi (Laudon & Laudon, 2020). Dalam konteks institusi pendidikan, sistem informasi berperan penting dalam mengelola data akademik, administrasi, dan operasional sekolah secara terpadu dan efisien.

### 2.2 Sistem Presensi Digital

Presensi digital adalah metode pencatatan kehadiran yang memanfaatkan teknologi informasi sebagai media utama pengganti lembar hadir fisik. Menurut Jogiyanto (2017), sistem presensi berbasis teknologi memiliki keunggulan berupa akurasi yang lebih tinggi, kemudahan akses, serta kemampuan untuk menghasilkan laporan secara otomatis dan real-time dibandingkan metode manual.

Beberapa bentuk sistem presensi digital yang umum digunakan antara lain:
- **Presensi berbasis web**: Guru mencatat kehadiran melalui antarmuka aplikasi berbasis browser.
- **Presensi QR Code**: Siswa melakukan *check-in* dengan memindai kode QR yang disediakan guru.
- **Presensi Biometrik**: Menggunakan sidik jari atau pengenalan wajah untuk verifikasi kehadiran.

Dalam proyek ASPIRA, pendekatan yang digunakan adalah **presensi berbasis web** yang dioperasikan oleh guru, karena dianggap paling praktis, mudah diimplementasikan, dan tidak memerlukan perangkat keras tambahan.

### 2.3 Aplikasi Berbasis Web

Aplikasi berbasis web (*web-based application*) adalah perangkat lunak yang dapat diakses melalui peramban (*browser*) internet tanpa perlu diinstal secara lokal pada perangkat pengguna. Menurut Pressman (2014), aplikasi web modern memiliki karakteristik utama berupa aksesibilitas tinggi, kemudahan pembaruan (*update*), serta kemampuan diakses dari berbagai jenis perangkat (*cross-platform*).

### 2.4 Teknologi yang Digunakan

#### 2.4.1 Vue.js 3

Vue.js adalah *framework* JavaScript progresif yang digunakan untuk membangun antarmuka pengguna (*user interface*) berbasis web. Vue.js 3 menghadirkan **Composition API** yang memungkinkan penulisan kode yang lebih terstruktur, *reusable*, dan mudah dipelihara. Vue.js dikenal memiliki kurva belajar yang rendah namun tetap mampu mendukung pengembangan aplikasi berskala besar (Vue.js Documentation, 2024).

**Keunggulan Vue.js 3:**
- Reaktivitas data yang efisien dengan sistem *Virtual DOM*
- Composition API untuk pengelolaan logika yang lebih modular
- Ekosistem yang lengkap (Vue Router, Pinia)
- Ukuran *bundle* yang ringan dan performa tinggi

#### 2.4.2 Supabase

Supabase adalah platform *Backend-as-a-Service* (BaaS) *open-source* yang menyediakan layanan database PostgreSQL, autentikasi pengguna, penyimpanan file, dan API secara real-time. Supabase sering disebut sebagai alternatif *open-source* dari Firebase yang menawarkan kemampuan pengelolaan data relasional yang lebih kuat (Supabase Documentation, 2024).

**Keunggulan Supabase:**
- Database PostgreSQL yang handal dan mendukung relasi data kompleks
- *Row Level Security* (RLS) untuk pengamanan data per baris
- API RESTful yang otomatis dibuat dari skema database
- *Real-time* subscriptions untuk sinkronisasi data langsung
- *Dashboard* manajemen database yang intuitif

#### 2.4.3 Vite

Vite adalah *build tool* generasi berikutnya untuk pengembangan aplikasi web modern. Vite memanfaatkan modul ES (*ES Modules*) secara langsung di browser selama pengembangan, menghasilkan waktu *startup* server yang hampir instan dan pembaruan HMR (*Hot Module Replacement*) yang sangat cepat (Vite Documentation, 2024).

#### 2.4.4 PostgreSQL

PostgreSQL adalah sistem manajemen basis data relasional (*RDBMS*) yang bersifat *open-source* dan memiliki kemampuan yang sangat handal. PostgreSQL mendukung tipe data yang beragam, transaksi ACID, serta memiliki performa yang sangat baik untuk pengelolaan data dalam skala besar. Dalam proyek ini, PostgreSQL digunakan sebagai lapisan database melalui layanan Supabase.

### 2.5 Responsive Web Design

*Responsive Web Design* (RWD) adalah pendekatan desain antarmuka web yang memastikan tampilan dan fungsionalitas aplikasi dapat beradaptasi secara optimal pada berbagai ukuran layar, mulai dari *desktop*, tablet, hingga perangkat *mobile* (Marcotte, 2010). Penerapan RWD dalam ASPIRA memungkinkan aplikasi untuk digunakan secara nyaman baik di komputer sekolah maupun di perangkat *smartphone* Android guru dan siswa.

Teknik utama yang digunakan dalam RWD antara lain:
- ***Media Queries* CSS**: Aturan CSS yang diterapkan berdasarkan lebar layar perangkat
- **Fluid Grid**: Tata letak berbasis persentase yang fleksibel
- **Flexible Images**: Gambar yang menyesuaikan lebar kontainernya

### 2.6 Penelitian Terdahulu

| No | Peneliti / Tahun | Judul | Teknologi | Keterkaitan |
|----|-----------------|-------|-----------|-------------|
| 1 | Purnama, et al. (2021) | Sistem Informasi Presensi Siswa Berbasis Web di SMK Negeri 1 Pekanbaru | PHP, MySQL | Konsep sistem presensi berbasis web untuk SMK |
| 2 | Hidayat & Setiawan (2022) | Rancang Bangun Aplikasi Absensi Digital Menggunakan Framework Vue.js | Vue.js 2, Laravel | Penggunaan Vue.js sebagai *front-end* sistem absensi |
| 3 | Andriani, et al. (2023) | Implementasi Supabase sebagai Backend Sistem Informasi Sekolah | Vue.js 3, Supabase | Kombinasi Vue.js 3 dan Supabase untuk sistem informasi |

Berdasarkan penelitian-penelitian di atas, proyek ASPIRA hadir dengan kebaruan berupa integrasi teknologi **Vue.js 3 + Supabase** secara penuh untuk sistem presensi yang mencakup manajemen multi-*role* (Admin, Guru, Siswa) dan antarmuka yang responsif untuk perangkat *mobile* Android, khususnya diterapkan di SMK Perpajakan Riau.

---

## BAB III — METODOLOGI PENGEMBANGAN

---

### 3.1 Metode Pengembangan Sistem

Proyek ASPIRA dikembangkan menggunakan pendekatan **metode *Waterfall*** yang merupakan model pengembangan perangkat lunak secara berurutan dan terstruktur. Metode ini dipilih karena kebutuhan sistem telah dapat didefinisikan secara jelas sejak awal, sehingga setiap tahapan dapat dieksekusi secara sistematis sebelum beralih ke tahapan berikutnya.

```
┌───────────────────────────────────────────────────────┐
│  1. Analisis Kebutuhan                                │
│         ↓                                             │
│  2. Perancangan Sistem (Desain)                       │
│         ↓                                             │
│  3. Implementasi (Coding)                             │
│         ↓                                             │
│  4. Pengujian (Testing)                               │
│         ↓                                             │
│  5. Pemeliharaan (Maintenance)                        │
└───────────────────────────────────────────────────────┘
```

### 3.2 Tahapan Pengembangan

#### 3.2.1 Analisis Kebutuhan

Pada tahap ini dilakukan pengumpulan informasi mengenai kebutuhan sistem melalui:
- **Observasi langsung**: Mengamati proses pencatatan presensi yang berjalan saat ini di SMK Perpajakan Riau.
- **Wawancara**: Mengumpulkan informasi dari guru, staf tata usaha, dan siswa mengenai kebutuhan dan harapan terhadap sistem baru.
- **Studi dokumentasi**: Mengkaji dokumen administrasi akademik yang ada untuk memahami alur data yang berlaku.

Hasil analisis menghasilkan dua jenis kebutuhan:

**a. Kebutuhan Fungsional**

| No | Kebutuhan | Role |
|----|-----------|------|
| 1 | Login dan autentikasi berdasarkan role | Semua |
| 2 | Manajemen data guru (CRUD) | Admin |
| 3 | Manajemen data siswa (CRUD) | Admin |
| 4 | Manajemen data kelas & mata pelajaran | Admin |
| 5 | Manajemen jadwal pelajaran | Admin |
| 6 | Pencatatan presensi harian | Guru |
| 7 | Riwayat dan statistik absensi kelas | Guru |
| 8 | Laporan rekap kehadiran (filter periode) | Admin, Guru |
| 9 | Pemantauan rekam kehadiran pribadi | Siswa |
| 10 | Dashboard statistik ringkasan | Semua |

**b. Kebutuhan Non-Fungsional**

| No | Kebutuhan |
|----|-----------|
| 1 | Antarmuka responsif (Desktop & Mobile Android) |
| 2 | Keamanan data dengan sistem autentikasi berbasis token |
| 3 | Performa loading halaman yang cepat (< 3 detik) |
| 4 | Kompatibel dengan browser modern (Chrome, Firefox, Edge) |
| 5 | Data tersimpan di cloud (Supabase) dengan keamanan RLS |

#### 3.2.2 Perancangan Sistem

Tahap perancangan mencakup:

**a. Perancangan Arsitektur Sistem**

```
┌─────────────────────────────────────────────────────────┐
│                    PENGGUNA                             │
│   (Admin / Guru / Siswa — Browser Desktop & Android)   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/HTTPS
┌──────────────────────▼──────────────────────────────────┐
│              FRONT-END (Vue.js 3 + Vite)               │
│  - Halaman Login        - Dashboard Admin               │
│  - Portal Guru          - Portal Siswa                  │
│  - Manajemen Data       - Laporan & Rekap               │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API / Supabase Client
┌──────────────────────▼──────────────────────────────────┐
│           BACK-END (Supabase BaaS)                      │
│  - Auth (JWT Token)     - Row Level Security (RLS)      │
│  - REST API Auto-gen    - Real-time Subscriptions       │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              DATABASE (PostgreSQL)                      │
│  users │ guru │ siswa │ kelas │ mapel │ jadwal │ absensi│
└─────────────────────────────────────────────────────────┘
```

**b. Perancangan Database**

Database ASPIRA terdiri dari 8 tabel utama dengan relasi antar tabel sebagai berikut:

| Tabel | Fungsi |
|-------|--------|
| `users` | Menyimpan data akun pengguna beserta role |
| `guru` | Data lengkap guru pengajar |
| `siswa` | Data lengkap siswa aktif |
| `kelas` | Data kelas/rombel (X, XI, XII) |
| `mata_pelajaran` | Data mata pelajaran yang diajarkan |
| `jadwal_pelajaran` | Relasi guru-mapel-kelas beserta hari/jam |
| `tahun_ajaran` | Periode tahun ajaran aktif |
| `absensi` | Rekam data presensi harian siswa per sesi |

**c. Perancangan Antarmuka (UI/UX)**

Desain antarmuka ASPIRA terinspirasi dari gaya akademik **SPADA UIR** dengan menggunakan palet warna:
- **Warna Utama**: Hijau forest (`#0a5c36`) — identitas akademik
- **Warna Aksen**: Emas (`#f1c40f`) — lambang prestasi
- **Latar**: Abu-abu terang (`#f4f6f9`) — kesan bersih dan profesional

#### 3.2.3 Implementasi (Coding)

Pengembangan ASPIRA dilaksanakan menggunakan *stack* teknologi berikut:

| Komponen | Teknologi |
|----------|-----------|
| Framework Front-end | Vue.js 3 (Composition API) |
| State Management | Pinia |
| Routing | Vue Router 4 |
| Build Tool | Vite 8 |
| Database & Auth | Supabase (PostgreSQL) |
| Visualisasi Data | Chart.js + Vue-ChartJS |
| Styling | Vanilla CSS (Custom Design System) |

Proses implementasi dilakukan secara bertahap:
1. **Setup proyek** dan konfigurasi koneksi Supabase
2. **Pembangunan sistem autentikasi** (login, logout, guard router)
3. **Pengembangan layout** tiga role (Admin, Guru, Siswa) yang responsif
4. **Pembuatan halaman manajemen data** (CRUD Guru, Siswa, Kelas, Mapel, Jadwal)
5. **Fitur pencatatan presensi** dan rekap data absensi
6. **Dashboard visualisasi** dengan grafik statistik kehadiran
7. **Pengujian fungsional** dan perbaikan (*debugging*)

#### 3.2.4 Pengujian (Testing)

Pengujian dilakukan menggunakan metode **Black-Box Testing**, yaitu pengujian yang berfokus pada fungsionalitas sistem tanpa melihat kode internal. Aspek yang diuji meliputi:

| No | Aspek Pengujian | Metode |
|----|----------------|--------|
| 1 | Fungsi login & autentikasi | Black-Box |
| 2 | Manajemen data (CRUD) semua modul | Black-Box |
| 3 | Pencatatan dan rekap presensi | Black-Box |
| 4 | Akses sesuai role (Admin/Guru/Siswa) | Black-Box |
| 5 | Tampilan responsif di Mobile Android | UI Testing |
| 6 | Koneksi dan sinkronisasi database Supabase | Integration Testing |

#### 3.2.5 Pemeliharaan (Maintenance)

Setelah sistem dinyatakan lulus uji, tahap pemeliharaan meliputi:
- Pembaruan data seeding awal (data guru, siswa, kelas, dan jadwal)
- Dokumentasi penggunaan sistem untuk setiap role pengguna
- Panduan teknis untuk pengembang jika diperlukan pengembangan lanjutan

### 3.3 Jadwal Pengerjaan Proyek

| No | Kegiatan | Minggu 1 | Minggu 2 | Minggu 3 | Minggu 4 |
|----|----------|:--------:|:--------:|:--------:|:--------:|
| 1 | Analisis Kebutuhan | ✅ | | | |
| 2 | Perancangan Sistem & Database | ✅ | ✅ | | |
| 3 | Setup Proyek & Autentikasi | | ✅ | | |
| 4 | Implementasi Fitur Utama | | ✅ | ✅ | |
| 5 | Pengujian & Debugging | | | ✅ | ✅ |
| 6 | Dokumentasi & Laporan | | | | ✅ |

### 3.4 Alat dan Bahan Pengembangan

**Perangkat Keras (*Hardware*):**
- Laptop/Komputer dengan spesifikasi minimum: RAM 8 GB, Processor Intel Core i5 / setara
- Perangkat Android untuk pengujian tampilan *mobile*
- Koneksi internet untuk akses Supabase *cloud*

**Perangkat Lunak (*Software*):**
- **Visual Studio Code** — Editor kode utama
- **Node.js v18+** — *Runtime* JavaScript
- **npm** — Manajer paket
- **Git** — Versi kontrol kode
- **Google Chrome** — Browser utama untuk pengujian
- **Supabase Dashboard** — Pengelolaan database *cloud*

---

*Dokumen ini merupakan bagian dari proposal pengembangan proyek sistem informasi akademik SMK Perpajakan Riau — ASPIRA Tahun 2026.*

---

## BAB IV — HASIL DAN PEMBAHASAN

---

### 4.1 Hasil Perancangan Sistem

Hasil dari tahap perancangan menghasilkan sebuah aplikasi web bernama **ASPIRA** yang dibangun menggunakan Vue.js 3 sebagai *front-end* dan Supabase (PostgreSQL) sebagai *backend* dan database. Sistem ini berhasil diimplementasikan sesuai dengan rancangan yang telah ditetapkan sebelumnya, mencakup tiga level akses pengguna dan berbagai modul manajemen data akademik.

### 4.2 Antarmuka Pengguna (User Interface)

#### 4.2.1 Halaman Login

Halaman login merupakan pintu masuk utama ke sistem ASPIRA. Halaman ini dirancang dengan tampilan yang bersih, profesional, dan beridentitas kuat sebagai sistem milik SMK Perpajakan Riau. Elemen-elemen yang terdapat pada halaman login antara lain:

- **Logo resmi SMK Perpajakan Riau** yang ditampilkan secara prominan
- **Nama aplikasi ASPIRA** dengan tagline lengkap (*Aplikasi Sistem Presensi & Informasi*)
- **Form login** dengan kolom *username* dan *password*
- **Statistik ringkas** (500+ Siswa Aktif, 30+ Guru Pengajar, Akses 24/7)
- **Tombol demo** untuk memudahkan pengujian setiap role

Desain halaman login terinspirasi dari gaya akademik portal **SPADA UIR** dengan menggunakan palet warna hijau forest dan aksen emas yang mencerminkan identitas akademik yang profesional.

#### 4.2.2 Dashboard Administrator

Dashboard Admin menampilkan ringkasan data statistik secara menyeluruh dalam satu layar, terdiri dari:

| Komponen | Deskripsi |
|----------|-----------|
| **Kartu Statistik** | Total Guru, Total Siswa, Total Kelas, Sesi Absensi Hari Ini |
| **Grafik Tren Kehadiran** | Grafik garis mingguan yang menampilkan tingkat kehadiran (Chart.js) |
| **Diagram Status Absensi** | Diagram lingkaran distribusi Hadir / Sakit / Izin / Alpha |
| **Menu Navigasi Lengkap** | Akses ke semua modul: Guru, Siswa, Kelas, Mapel, Jadwal, Absensi, Laporan |

#### 4.2.3 Portal Guru

Portal Guru menyediakan fitur utama bagi guru pengajar, meliputi:
- **Dashboard Guru**: Ringkasan jadwal mengajar hari ini dan statistik kehadiran kelas
- **Jadwal Mengajar**: Daftar jadwal mengajar berdasarkan hari dan jam
- **Isi Absensi**: Form pencatatan presensi siswa dengan pilihan status (Hadir/Sakit/Izin/Alpha)
- **Riwayat Absensi**: Rekap historis pencatatan presensi yang telah dilakukan
- **Statistik**: Grafik dan data statistik kehadiran per kelas

#### 4.2.4 Portal Siswa

Portal Siswa menampilkan informasi kehadiran pribadi siswa, meliputi:
- **Dashboard Siswa**: Ringkasan persentase kehadiran dan grafik absensi personal
- **Absensi Saya**: Tabel riwayat kehadiran lengkap dengan filter tanggal
- **Profil Saya**: Informasi data diri siswa yang tersimpan di sistem

#### 4.2.5 Modul Manajemen Data (Admin)

| Modul | Fitur |
|-------|-------|
| **Manajemen Guru** | Tambah, lihat, edit, hapus data guru; pencarian dan filter |
| **Manajemen Siswa** | Tambah, lihat, edit, hapus data siswa; filter berdasarkan kelas |
| **Manajemen Kelas** | Tambah dan kelola data kelas/rombel beserta wali kelas |
| **Mata Pelajaran** | Pengelolaan data mata pelajaran dan jurusan terkait |
| **Jadwal Pelajaran** | Pembuatan jadwal mingguan relasi guru-mapel-kelas |
| **Data Absensi** | Rekap dan filter data presensi seluruh siswa |
| **Laporan** | Filter laporan berdasarkan periode, kelas, guru, dan mata pelajaran |
| **Manajemen Users** | Pengelolaan akun pengguna dan pengaturan role |

### 4.3 Hasil Pengujian Sistem

Pengujian sistem dilakukan menggunakan metode **Black-Box Testing** terhadap seluruh fitur utama ASPIRA. Berikut adalah hasil pengujian yang telah dilaksanakan:

#### 4.3.1 Pengujian Autentikasi

| No | Skenario Uji | Data Masukan | Hasil yang Diharapkan | Hasil Aktual | Status |
|----|-------------|-------------|----------------------|--------------|--------|
| 1 | Login Admin valid | username: `admin`, password: `admin123` | Masuk ke Dashboard Admin | Berhasil masuk ke Dashboard Admin | ✅ **Lulus** |
| 2 | Login Guru valid | username: `guru1`, password: `guru123` | Masuk ke Portal Guru | Berhasil masuk ke Portal Guru | ✅ **Lulus** |
| 3 | Login Siswa valid | username: `siswa1`, password: `siswa123` | Masuk ke Portal Siswa | Berhasil masuk ke Portal Siswa | ✅ **Lulus** |
| 4 | Login dengan password salah | username: `admin`, password: `salah` | Muncul pesan error | Pesan error ditampilkan | ✅ **Lulus** |
| 5 | Akses halaman admin tanpa login | Langsung akses `/admin/dashboard` | Diarahkan ke halaman login | Redirect ke `/login` | ✅ **Lulus** |
| 6 | Logout | Klik tombol Keluar | Kembali ke halaman login | Berhasil logout dan redirect | ✅ **Lulus** |

#### 4.3.2 Pengujian Manajemen Data

| No | Skenario Uji | Hasil Aktual | Status |
|----|-------------|--------------|--------|
| 1 | Tambah data guru baru | Data tersimpan dan tampil di tabel | ✅ **Lulus** |
| 2 | Edit data siswa | Perubahan tersimpan dan terupdate | ✅ **Lulus** |
| 3 | Hapus data kelas | Data terhapus dari tabel dan database | ✅ **Lulus** |
| 4 | Pencarian data dengan filter | Hasil filter sesuai dengan kata kunci | ✅ **Lulus** |
| 5 | Validasi form (kolom kosong) | Pesan error validasi ditampilkan | ✅ **Lulus** |

#### 4.3.3 Pengujian Presensi

| No | Skenario Uji | Hasil Aktual | Status |
|----|-------------|--------------|--------|
| 1 | Guru mengisi absensi kelas | Data tersimpan dan muncul di rekap | ✅ **Lulus** |
| 2 | Siswa melihat riwayat hadir pribadi | Data kehadiran pribadi tampil | ✅ **Lulus** |
| 3 | Admin melihat rekap absensi seluruh kelas | Rekap data tampil dengan filter | ✅ **Lulus** |
| 4 | Filter laporan berdasarkan tanggal | Hasil filter sesuai range tanggal | ✅ **Lulus** |

#### 4.3.4 Pengujian Responsivitas (Mobile)

| No | Perangkat | Ukuran Layar | Tampilan | Status |
|----|----------|-------------|----------|--------|
| 1 | Desktop/Laptop | 1280px ke atas | Sidebar muncul penuh, konten lebar | ✅ **Lulus** |
| 2 | Tablet | 768–1280px | Grid menyesuaikan (2 kolom) | ✅ **Lulus** |
| 3 | Smartphone Android | 375–767px | Sidebar tersembunyi, tombol menu muncul | ✅ **Lulus** |
| 4 | Smartphone kecil | Di bawah 480px | Semua grid jadi 1 kolom, teks terbaca | ✅ **Lulus** |

### 4.4 Analisis Perbandingan Sistem

| Aspek | Sistem Manual (Sebelumnya) | ASPIRA (Sesudah) |
|-------|--------------------------|-----------------|
| **Media Pencatatan** | Kertas / lembar hadir fisik | Aplikasi web digital |
| **Kecepatan Rekap** | 1–3 hari (manual) | Instan (otomatis) |
| **Risiko Kehilangan Data** | Tinggi (fisik bisa hilang/rusak) | Sangat rendah (cloud backup) |
| **Akses Siswa** | Tidak tersedia | Tersedia via portal daring |
| **Laporan** | Manual oleh TU | Otomatis dengan filter |
| **Akses Mobile** | Tidak tersedia | Mendukung Android |
| **Pemantauan Real-time** | Tidak ada | Ya, langsung dari database |
| **Biaya Operasional** | Kertas, tinta, arsip fisik | Gratis (open-source + Supabase free tier) |

### 4.5 Pembahasan

Berdasarkan hasil implementasi dan pengujian, aplikasi ASPIRA berhasil menjawab seluruh rumusan masalah yang telah ditetapkan:

1. **Rumusan Masalah 1** *(Sistem presensi digital)*: ASPIRA berhasil menggantikan proses pencatatan kehadiran manual dengan sistem digital berbasis web yang dapat dioperasikan oleh guru dari perangkat apa pun yang memiliki browser.

2. **Rumusan Masalah 2** *(Manajemen data terpadu)*: Seluruh data akademik — guru, siswa, kelas, mata pelajaran, jadwal, dan presensi — berhasil diintegrasikan dalam satu platform dengan database terpusat di Supabase PostgreSQL.

3. **Rumusan Masalah 3** *(Pelaporan otomatis per role)*: Sistem berhasil mengimplementasikan pembatasan akses (*role-based access control*) yang ketat, di mana setiap pengguna hanya dapat mengakses fitur dan data sesuai perannya masing-masing.

4. **Rumusan Masalah 4** *(Antarmuka responsif)*: ASPIRA berhasil diuji dan berjalan dengan baik di perangkat desktop maupun smartphone Android dengan tampilan yang menyesuaikan ukuran layar secara otomatis.

---

## BAB V — PENUTUP

---

### 5.1 Kesimpulan

Berdasarkan proses perancangan, implementasi, dan pengujian yang telah dilaksanakan, maka dapat ditarik beberapa kesimpulan sebagai berikut:

1. **ASPIRA (Aplikasi Sistem Presensi dan Informasi SMK Perpajakan Riau)** berhasil dirancang dan diimplementasikan sebagai sistem presensi digital berbasis web menggunakan teknologi Vue.js 3 dan Supabase (PostgreSQL), menggantikan sistem pencatatan kehadiran manual yang sebelumnya digunakan di SMK Perpajakan Riau.

2. Sistem berhasil mengintegrasikan delapan modul data akademik (guru, siswa, kelas, mata pelajaran, jadwal, tahun ajaran, users, dan absensi) dalam satu platform terpusat yang dapat diakses secara daring.

3. Fitur *role-based access control* (RBAC) berhasil diterapkan dengan tiga level akses pengguna — Administrator, Guru, dan Siswa — di mana setiap pengguna hanya dapat mengakses fitur yang sesuai dengan perannya.

4. Seluruh pengujian fungsional menggunakan metode **Black-Box Testing** menghasilkan status **Lulus** pada seluruh skenario uji yang telah ditetapkan, termasuk autentikasi, manajemen data, pencatatan presensi, dan pelaporan.

5. Antarmuka ASPIRA berhasil dirancang secara **responsif** menggunakan prinsip *Responsive Web Design* sehingga dapat digunakan dengan optimal pada perangkat *desktop* maupun *smartphone* Android.

6. Pengembangan ASPIRA membuktikan bahwa kombinasi **Vue.js 3 + Supabase** merupakan *tech stack* yang efektif, efisien, dan mampu menghasilkan aplikasi sistem informasi pendidikan yang modern dengan waktu pengembangan yang relatif singkat.

### 5.2 Saran

Guna mendukung keberlanjutan dan pengembangan lebih lanjut dari sistem ASPIRA, terdapat beberapa saran yang dapat dipertimbangkan:

1. **Penerapan di Server Publik**: Sistem ASPIRA sebaiknya di-*deploy* ke layanan *hosting* atau *cloud server* (seperti Vercel, Railway, atau VPS) agar dapat diakses oleh seluruh warga sekolah tanpa perlu terhubung ke jaringan lokal (LAN/Wi-Fi sekolah).

2. **Integrasi Notifikasi**: Penambahan fitur notifikasi otomatis kepada orang tua/wali siswa (via WhatsApp atau email) ketika siswa tidak hadir melebihi ambang batas tertentu.

3. **Presensi QR Code**: Untuk meningkatkan efisiensi dan akurasi, sistem dapat dikembangkan dengan menambahkan fitur presensi mandiri oleh siswa menggunakan pemindaian QR Code.

4. **Ekspor Laporan PDF/Excel**: Penambahan fitur ekspor laporan rekap absensi ke format PDF atau Microsoft Excel untuk keperluan arsip fisik dan pelaporan resmi ke dinas pendidikan.

5. **Keamanan Data**: Implementasi enkripsi *end-to-end* dan audit log untuk seluruh aktivitas pengguna guna meningkatkan standar keamanan data akademik siswa.

6. **Pengembangan Aplikasi Mobile Native**: Untuk pengalaman pengguna yang lebih optimal di perangkat Android, dapat dipertimbangkan pengembangan aplikasi *mobile native* menggunakan teknologi seperti Flutter atau React Native.

---

## DAFTAR PUSTAKA

---

- Andriani, R., Pratama, H., & Wulandari, S. (2023). *Implementasi Supabase sebagai Backend Sistem Informasi Sekolah*. Jurnal Teknologi Informasi Pendidikan, 8(2), 45–57.
- Hidayat, A., & Setiawan, B. (2022). *Rancang Bangun Aplikasi Absensi Digital Menggunakan Framework Vue.js*. Jurnal Sistem Informasi dan Teknologi, 4(1), 12–24.
- Jogiyanto, H.M. (2017). *Sistem Informasi Keperilakuan* (Edisi Revisi). Yogyakarta: Andi Offset.
- Laudon, K.C., & Laudon, J.P. (2020). *Management Information Systems: Managing the Digital Firm* (16th ed.). Pearson Education.
- Marcotte, E. (2010). *Responsive Web Design*. A List Apart. Retrieved from https://alistapart.com/article/responsive-web-design/
- Pressman, R.S. (2014). *Software Engineering: A Practitioner's Approach* (8th ed.). McGraw-Hill Education.
- Purnama, D., Hakim, L., & Santoso, T. (2021). *Sistem Informasi Presensi Siswa Berbasis Web di SMK Negeri 1 Pekanbaru*. Jurnal Informatika Pendidikan Riau, 3(1), 78–89.
- Supabase. (2024). *Supabase Documentation*. Retrieved from https://supabase.com/docs
- Vite. (2024). *Vite Documentation*. Retrieved from https://vitejs.dev/guide/
- Vue.js. (2024). *Vue.js 3 Documentation*. Retrieved from https://vuejs.org/guide/introduction.html

---

## LAMPIRAN

---

### Lampiran A — Struktur Direktori Proyek

```
absensi-vue/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   ├── AdminLayout.vue      ← Layout tampilan Admin
│   │   ├── GuruLayout.vue       ← Layout tampilan Guru
│   │   └── SiswaLayout.vue      ← Layout tampilan Siswa
│   ├── stores/
│   │   └── auth.js              ← State autentikasi (Pinia)
│   ├── views/
│   │   ├── auth/
│   │   │   └── LoginView.vue    ← Halaman Login
│   │   ├── admin/               ← Semua halaman modul Admin
│   │   ├── guru/                ← Halaman Portal Guru
│   │   └── siswa/               ← Halaman Portal Siswa
│   ├── router/
│   │   └── index.js             ← Konfigurasi routing & guard
│   ├── lib/
│   │   └── supabase.js          ← Koneksi Supabase client
│   ├── App.vue                  ← Komponen root aplikasi
│   ├── main.js                  ← Entry point aplikasi
│   └── style.css                ← Global design system
├── .env                         ← Variabel lingkungan Supabase
├── index.html                   ← HTML utama + meta SEO
├── package.json                 ← Dependensi proyek
└── vite.config.js               ← Konfigurasi Vite
```

### Lampiran B — Skema Database

```sql
-- Tabel Utama ASPIRA
CREATE TABLE users (id, username, password_hash, role, ref_id, ...);
CREATE TABLE guru (id, nip, nama, email, no_hp, ...);
CREATE TABLE siswa (id, nis, nama, kelas_id, jenis_kelamin, ...);
CREATE TABLE kelas (id, nama_kelas, tingkat, jurusan, wali_kelas_id, ...);
CREATE TABLE mata_pelajaran (id, kode_mapel, nama_mapel, jurusan, ...);
CREATE TABLE jadwal_pelajaran (id, guru_id, mapel_id, kelas_id, hari, ...);
CREATE TABLE tahun_ajaran (id, nama, tanggal_mulai, tanggal_selesai, ...);
CREATE TABLE absensi (id, siswa_id, jadwal_id, tanggal, status, ...);
```

### Lampiran C — Akun Demo Sistem

| Role | Username | Password | Keterangan |
|------|----------|----------|------------|
| Administrator | `admin` | `admin123` | Akses penuh ke seluruh sistem |
| Guru 1 | `guru1` | `guru123` | Drs. Ahmad Fauzi, M.Pd |
| Guru 2 | `guru2` | `guru123` | Siti Rahmawati, S.Pd |
| Siswa 1 | `siswa1` | `siswa123` | Andi Pratama — X RPL 1 |
| Siswa 2 | `siswa2` | `siswa123` | Ani Rahayu — X RPL 1 |

### Lampiran D — URL Akses Sistem

| Jaringan | URL |
|----------|-----|
| **Lokal (PC Server)** | `http://localhost:5173/` |
| **Jaringan LAN/Wi-Fi** | `http://192.168.1.47:5173/` |

> **Catatan**: Pastikan PC server menjalankan perintah `npm run dev` dan perangkat Android terhubung ke jaringan Wi-Fi yang sama sebelum mengakses URL jaringan di atas.

---

*— Selesai —*

*Proposal ini disusun sebagai dokumentasi resmi pengembangan proyek ASPIRA (Aplikasi Sistem Presensi dan Informasi SMK Perpajakan Riau) Tahun Ajaran 2025/2026.*
