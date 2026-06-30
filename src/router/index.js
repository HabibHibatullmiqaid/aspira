import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy-loaded views
const LoginView = () => import('@/views/auth/LoginView.vue')

// Admin
const AdminDashboard = () => import('@/views/admin/DashboardView.vue')
const AdminGuruList = () => import('@/views/admin/guru/GuruListView.vue')
const AdminGuruForm = () => import('@/views/admin/guru/GuruFormView.vue')
const AdminGuruDetail = () => import('@/views/admin/guru/GuruDetailView.vue')
const AdminSiswaList = () => import('@/views/admin/siswa/SiswaListView.vue')
const AdminSiswaForm = () => import('@/views/admin/siswa/SiswaFormView.vue')
const AdminSiswaDetail = () => import('@/views/admin/siswa/SiswaDetailView.vue')
const AdminKelasList = () => import('@/views/admin/kelas/KelasListView.vue')
const AdminKelasForm = () => import('@/views/admin/kelas/KelasFormView.vue')
const AdminMapelList = () => import('@/views/admin/mapel/MapelListView.vue')
const AdminMapelForm = () => import('@/views/admin/mapel/MapelFormView.vue')
const AdminTahunAjaranList = () => import('@/views/admin/tahun-ajaran/TahunAjaranListView.vue')
const AdminTahunAjaranForm = () => import('@/views/admin/tahun-ajaran/TahunAjaranFormView.vue')
const AdminJadwalList = () => import('@/views/admin/jadwal/JadwalListView.vue')
const AdminJadwalForm = () => import('@/views/admin/jadwal/JadwalFormView.vue')
const AdminAbsensiList = () => import('@/views/admin/absensi/AbsensiListView.vue')
const AdminAbsensiDetail = () => import('@/views/admin/absensi/AbsensiDetailView.vue')
const AdminAbsensiRekap = () => import('@/views/admin/absensi/AbsensiRekapView.vue')
const AdminLaporan = () => import('@/views/admin/laporan/LaporanView.vue')
const AdminUserList = () => import('@/views/admin/users/UserListView.vue')
const AdminUserForm = () => import('@/views/admin/users/UserFormView.vue')

// Guru
const GuruDashboard = () => import('@/views/guru/DashboardView.vue')
const GuruJadwal = () => import('@/views/guru/JadwalView.vue')
const GuruAbsensiIsi = () => import('@/views/guru/absensi/AbsensiIsiView.vue')
const GuruAbsensiRiwayat = () => import('@/views/guru/absensi/AbsensiRiwayatView.vue')
const GuruAbsensiStatistik = () => import('@/views/guru/absensi/AbsensiStatistikView.vue')
const GuruProfil = () => import('@/views/guru/ProfilView.vue')

// Siswa
const SiswaDashboard = () => import('@/views/siswa/DashboardView.vue')
const SiswaAbsensi = () => import('@/views/siswa/AbsensiView.vue')
const SiswaProfil = () => import('@/views/siswa/ProfilView.vue')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView, meta: { guest: true } },

  // Admin Routes
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: 'dashboard', name: 'admin.dashboard', component: AdminDashboard },
      { path: 'guru', name: 'admin.guru.list', component: AdminGuruList },
      { path: 'guru/tambah', name: 'admin.guru.tambah', component: AdminGuruForm },
      { path: 'guru/edit/:id', name: 'admin.guru.edit', component: AdminGuruForm },
      { path: 'guru/detail/:id', name: 'admin.guru.detail', component: AdminGuruDetail },
      { path: 'siswa', name: 'admin.siswa.list', component: AdminSiswaList },
      { path: 'siswa/tambah', name: 'admin.siswa.tambah', component: AdminSiswaForm },
      { path: 'siswa/edit/:id', name: 'admin.siswa.edit', component: AdminSiswaForm },
      { path: 'siswa/detail/:id', name: 'admin.siswa.detail', component: AdminSiswaDetail },
      { path: 'kelas', name: 'admin.kelas.list', component: AdminKelasList },
      { path: 'kelas/tambah', name: 'admin.kelas.tambah', component: AdminKelasForm },
      { path: 'kelas/edit/:id', name: 'admin.kelas.edit', component: AdminKelasForm },
      { path: 'mapel', name: 'admin.mapel.list', component: AdminMapelList },
      { path: 'mapel/tambah', name: 'admin.mapel.tambah', component: AdminMapelForm },
      { path: 'mapel/edit/:id', name: 'admin.mapel.edit', component: AdminMapelForm },
      { path: 'tahun-ajaran', name: 'admin.tahun-ajaran.list', component: AdminTahunAjaranList },
      { path: 'tahun-ajaran/tambah', name: 'admin.tahun-ajaran.tambah', component: AdminTahunAjaranForm },
      { path: 'tahun-ajaran/edit/:id', name: 'admin.tahun-ajaran.edit', component: AdminTahunAjaranForm },
      { path: 'jadwal', name: 'admin.jadwal.list', component: AdminJadwalList },
      { path: 'jadwal/tambah', name: 'admin.jadwal.tambah', component: AdminJadwalForm },
      { path: 'jadwal/edit/:id', name: 'admin.jadwal.edit', component: AdminJadwalForm },
      { path: 'absensi', name: 'admin.absensi.list', component: AdminAbsensiList },
      { path: 'absensi/detail/:id', name: 'admin.absensi.detail', component: AdminAbsensiDetail },
      { path: 'absensi/rekap', name: 'admin.absensi.rekap', component: AdminAbsensiRekap },
      { path: 'laporan', name: 'admin.laporan', component: AdminLaporan },
      { path: 'users', name: 'admin.users.list', component: AdminUserList },
      { path: 'users/tambah', name: 'admin.users.tambah', component: AdminUserForm },
      { path: 'users/edit/:id', name: 'admin.users.edit', component: AdminUserForm },
    ],
  },

  // Guru Routes
  {
    path: '/guru',
    redirect: '/guru/dashboard',
    component: () => import('@/layouts/GuruLayout.vue'),
    meta: { requiresAuth: true, role: 'guru' },
    children: [
      { path: 'dashboard', name: 'guru.dashboard', component: GuruDashboard },
      { path: 'jadwal', name: 'guru.jadwal', component: GuruJadwal },
      { path: 'absensi/isi/:id', name: 'guru.absensi.isi', component: GuruAbsensiIsi },
      { path: 'absensi/riwayat', name: 'guru.absensi.riwayat', component: GuruAbsensiRiwayat },
      { path: 'absensi/statistik', name: 'guru.absensi.statistik', component: GuruAbsensiStatistik },
      { path: 'profil', name: 'guru.profil', component: GuruProfil },
    ],
  },

  // Siswa Routes
  {
    path: '/siswa',
    redirect: '/siswa/dashboard',
    component: () => import('@/layouts/SiswaLayout.vue'),
    meta: { requiresAuth: true, role: 'siswa' },
    children: [
      { path: 'dashboard', name: 'siswa.dashboard', component: SiswaDashboard },
      { path: 'absensi', name: 'siswa.absensi', component: SiswaAbsensi },
      { path: 'profil', name: 'siswa.profil', component: SiswaProfil },
    ],
  },

  // 404
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.guest) {
    if (authStore.isLoggedIn) {
      return next(authStore.dashboardRoute)
    }
    return next()
  }

  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      return next('/login')
    }
    if (to.meta.role && authStore.user?.role !== to.meta.role) {
      return next(authStore.dashboardRoute)
    }
  }

  next()
})

export default router
