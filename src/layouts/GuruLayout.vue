<template>
  <div class="app-layout">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-logo">
        <img src="https://smkperpajakanriau.sch.id/media_library/images/9b1106d4367caf574fd0483043db25f8.png" alt="Logo SMK Perpajakan Riau" style="width:42px;height:42px;object-fit:contain" />
        <div class="sidebar-logo-text">
          <h2>ASPIRA</h2>
          <span>SMK Perpajakan Riau</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">Menu</div>
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
            <span>Guru</span>
          </div>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Keluar
        </button>
      </div>
    </aside>

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
        <div class="sidebar-user-avatar" style="width:32px;height:32px;font-size:12px">{{ userInitial }}</div>
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

const userInitial = computed(() => (auth.user?.nama || 'G').charAt(0).toUpperCase())
const currentDate = computed(() => new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))

const pageTitle = computed(() => {
  const titles = {
    'guru.dashboard': 'Dashboard Guru',
    'guru.jadwal': 'Jadwal Mengajar',
    'guru.absensi.isi': 'Isi Absensi',
    'guru.absensi.riwayat': 'Riwayat Absensi',
    'guru.absensi.statistik': 'Statistik Absensi',
    'guru.profil': 'Profil Saya',
  }
  return titles[route.name] || 'ASPIRA'
})

function isActive(path) { return route.path.startsWith(path) }
function handleLogout() { auth.logout(); router.push('/login') }

const I = (d) => () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d })])

const navItems = [
  { to: '/guru/dashboard', label: 'Dashboard', icon: I('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'), name: 'dashboard' },
  { to: '/guru/jadwal', label: 'Jadwal Mengajar', icon: I('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'), name: 'jadwal' },
  { to: '/guru/absensi/riwayat', label: 'Riwayat Absensi', icon: I('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'), name: 'riwayat' },
  { to: '/guru/absensi/statistik', label: 'Statistik', icon: I('M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'), name: 'statistik' },
  { to: '/guru/profil', label: 'Profil Saya', icon: I('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'), name: 'profil' },
]
</script>
