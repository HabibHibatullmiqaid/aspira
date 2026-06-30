<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <img src="https://smkperpajakanriau.sch.id/media_library/images/9b1106d4367caf574fd0483043db25f8.png" alt="Logo SMK Perpajakan Riau" style="width:42px;height:42px;object-fit:contain" />
        <div class="sidebar-logo-text">
          <h2>ASPIRA</h2>
          <span>SMK Perpajakan Riau</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">Utama</div>
        <router-link v-for="item in navItems" :key="item.name" :to="item.to" class="nav-item" :class="{ active: isActive(item.to) }" @click="sidebarOpen = false">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar">{{ userInitial }}</div>
          <div class="sidebar-user-info">
            <p>{{ auth.user?.nama }}</p>
            <span>{{ auth.user?.role }}</span>
          </div>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Keluar
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="main-content">
      <header class="main-header">
        <div class="flex items-center gap-3">
          <button class="btn-icon btn-secondary" style="display:none" @click="sidebarOpen = !sidebarOpen" id="sidebar-toggle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div>
            <h1 style="font-size:15px;font-weight:700;color:var(--text-primary)">{{ pageTitle }}</h1>
            <p style="font-size:11px;color:var(--text-muted)">{{ currentDate }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="sidebar-user-avatar" style="width:32px;height:32px;font-size:12px">{{ userInitial }}</div>
        </div>
      </header>

      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)

const userInitial = computed(() => {
  const name = auth.user?.nama || auth.user?.username || 'A'
  return name.charAt(0).toUpperCase()
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const pageTitle = computed(() => {
  const titles = {
    'admin.dashboard': 'Dashboard Admin',
    'admin.guru.list': 'Manajemen Guru',
    'admin.guru.tambah': 'Tambah Guru',
    'admin.guru.edit': 'Edit Guru',
    'admin.guru.detail': 'Detail Guru',
    'admin.siswa.list': 'Manajemen Siswa',
    'admin.siswa.tambah': 'Tambah Siswa',
    'admin.siswa.edit': 'Edit Siswa',
    'admin.siswa.detail': 'Detail Siswa',
    'admin.kelas.list': 'Manajemen Kelas',
    'admin.kelas.tambah': 'Tambah Kelas',
    'admin.kelas.edit': 'Edit Kelas',
    'admin.mapel.list': 'Mata Pelajaran',
    'admin.mapel.tambah': 'Tambah Mata Pelajaran',
    'admin.mapel.edit': 'Edit Mata Pelajaran',
    'admin.tahun-ajaran.list': 'Tahun Ajaran',
    'admin.jadwal.list': 'Jadwal Pelajaran',
    'admin.absensi.list': 'Data Absensi',
    'admin.absensi.rekap': 'Rekap Absensi',
    'admin.laporan': 'Laporan',
    'admin.users.list': 'Manajemen Users',
  }
  return titles[route.name] || 'ASPIRA'
})

function isActive(path) {
  return route.path.startsWith(path)
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

// Nav icons as render functions
const IconDashboard = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])
const IconGuru = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' })
])
const IconSiswa = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' })
])
const IconKelas = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
])
const IconMapel = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' })
])
const IconJadwal = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
])
const IconAbsensi = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
])
const IconLaporan = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
])
const IconUsers = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
])
const IconTahun = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
])

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard, name: 'dashboard' },
  { to: '/admin/guru', label: 'Guru', icon: IconGuru, name: 'guru' },
  { to: '/admin/siswa', label: 'Siswa', icon: IconSiswa, name: 'siswa' },
  { to: '/admin/kelas', label: 'Kelas', icon: IconKelas, name: 'kelas' },
  { to: '/admin/mapel', label: 'Mata Pelajaran', icon: IconMapel, name: 'mapel' },
  { to: '/admin/tahun-ajaran', label: 'Tahun Ajaran', icon: IconTahun, name: 'tahun-ajaran' },
  { to: '/admin/jadwal', label: 'Jadwal', icon: IconJadwal, name: 'jadwal' },
  { to: '/admin/absensi', label: 'Absensi', icon: IconAbsensi, name: 'absensi' },
  { to: '/admin/laporan', label: 'Laporan', icon: IconLaporan, name: 'laporan' },
  { to: '/admin/users', label: 'Users', icon: IconUsers, name: 'users' },
]
</script>
