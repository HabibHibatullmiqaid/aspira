<template>
  <div>
    <h1 class="page-title">Halo, {{ auth.user?.nama }}</h1>
    <p class="page-subtitle">Portal Siswa - SMK Perpajakan Riau</p>

    <!-- Stat Cards -->
    <div class="grid-3 mb-6" v-if="!loading">
      <div class="stat-card stat-emerald">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Persentase Kehadiran</p>
          <p class="stat-value">{{ percentHadir }}%</p>
          <p class="stat-sub">Kehadiran semester ini</p>
        </div>
      </div>
      <div class="stat-card stat-amber">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Ketidakhadiran</p>
          <p class="stat-value">{{ stats.alfa }}</p>
          <p class="stat-sub">Jumlah Alfa/Tanpa Keterangan</p>
        </div>
      </div>
      <div class="stat-card stat-blue">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Izin & Sakit</p>
          <p class="stat-value">{{ stats.sakit + stats.izin }}</p>
          <p class="stat-sub">Izin sah terdata</p>
        </div>
      </div>
    </div>

    <!-- Attendance Breakdown -->
    <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
    <div v-else class="card">
      <h3 class="section-title">Detail Kehadiran</h3>
      <div class="rekap-grid">
        <div class="rekap-card hadir">
          <span class="count">{{ stats.hadir }}</span>
          <span class="label">Hadir</span>
        </div>
        <div class="rekap-card sakit">
          <span class="count">{{ stats.sakit }}</span>
          <span class="label">Sakit</span>
        </div>
        <div class="rekap-card izin">
          <span class="count">{{ stats.izin }}</span>
          <span class="label">Izin</span>
        </div>
        <div class="rekap-card alfa">
          <span class="count">{{ stats.alfa }}</span>
          <span class="label">Alfa</span>
        </div>
        <div class="rekap-card terlambat">
          <span class="count">{{ stats.terlambat }}</span>
          <span class="label">Terlambat</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabase'

const auth = useAuthStore()
const loading = ref(true)
const stats = ref({ hadir: 0, sakit: 0, izin: 0, alfa: 0, terlambat: 0, total: 0 })

const percentHadir = computed(() => {
  if (stats.value.total === 0) return 100
  return Math.round(((stats.value.hadir + stats.value.terlambat) / stats.value.total) * 100)
})

async function loadData() {
  loading.value = true
  const idSiswa = auth.user?.reference_id
  if (!idSiswa) {
    loading.value = false
    return
  }

  const { data } = await supabase.from('absensi').select('status').eq('id_siswa', idSiswa)
  if (data) {
    stats.value = {
      hadir: data.filter(a => a.status === 'Hadir').length,
      sakit: data.filter(a => a.status === 'Sakit').length,
      izin: data.filter(a => a.status === 'Izin').length,
      alfa: data.filter(a => a.status === 'Alfa').length,
      terlambat: data.filter(a => a.status === 'Terlambat').length,
      total: data.length
    }
  }

  loading.value = false
}

onMounted(loadData)
</script>

<style scoped>
.rekap-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}
.rekap-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}
.rekap-card .count { font-size: 32px; font-weight: 800; }
.rekap-card .label { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }

.rekap-card.hadir { background: var(--success-bg); border-color: rgba(16,185,129,0.2); color: var(--success); }
.rekap-card.sakit { background: var(--info-bg); border-color: rgba(59,130,246,0.2); color: var(--info); }
.rekap-card.izin { background: var(--warning-bg); border-color: rgba(245,158,11,0.2); color: var(--warning); }
.rekap-card.alfa { background: var(--danger-bg); border-color: rgba(239,68,68,0.2); color: var(--danger); }
.rekap-card.terlambat { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.2); color: #a78bfa; }
</style>
