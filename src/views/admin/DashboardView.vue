<template>
  <div>
    <h1 class="page-title">Dashboard</h1>
    <p class="page-subtitle">Ringkasan aktivitas absensi hari ini</p>

    <!-- Stat Cards -->
    <div class="grid-4 mb-6">
      <div class="stat-card stat-indigo">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Guru</p>
          <p class="stat-value">{{ stats.totalGuru }}</p>
          <p class="stat-sub">Guru aktif</p>
        </div>
      </div>
      <div class="stat-card stat-emerald">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Siswa</p>
          <p class="stat-value">{{ stats.totalSiswa }}</p>
          <p class="stat-sub">Siswa terdaftar</p>
        </div>
      </div>
      <div class="stat-card stat-amber">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Absensi Hari Ini</p>
          <p class="stat-value">{{ stats.absensiHariIni }}</p>
          <p class="stat-sub">Record tercatat</p>
        </div>
      </div>
      <div class="stat-card stat-red">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Tidak Hadir</p>
          <p class="stat-value">{{ stats.tidakHadir }}</p>
          <p class="stat-sub">Alfa hari ini</p>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid-2 mb-6">
      <div class="card">
        <div class="card-header">
          <h3 class="section-title" style="margin-bottom:0">Kehadiran 7 Hari Terakhir</h3>
        </div>
        <div v-if="chartDataMingguan" style="position:relative;height:220px">
          <Line :data="chartDataMingguan" :options="lineOptions" />
        </div>
        <div v-else class="loading-overlay"><div class="spinner"></div></div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="section-title" style="margin-bottom:0">Status Absensi Hari Ini</h3>
        </div>
        <div v-if="chartDataStatus" style="position:relative;height:220px;display:flex;align-items:center;justify-content:center">
          <Doughnut :data="chartDataStatus" :options="doughnutOptions" style="max-height:200px" />
        </div>
        <div v-else class="loading-overlay"><div class="spinner"></div></div>
      </div>
    </div>

    <!-- Rekap Hari Ini -->
    <div class="card">
      <div class="card-header">
        <h3 class="section-title" style="margin-bottom:0">Rekap Status Hari Ini</h3>
        <span class="badge badge-info">{{ todayStr }}</span>
      </div>
      <div class="grid-4">
        <div class="rekap-item rekap-hadir">
          <span class="rekap-count">{{ stats.hadir }}</span>
          <span class="rekap-label">Hadir</span>
        </div>
        <div class="rekap-item rekap-sakit">
          <span class="rekap-count">{{ stats.sakit }}</span>
          <span class="rekap-label">Sakit</span>
        </div>
        <div class="rekap-item rekap-izin">
          <span class="rekap-count">{{ stats.izin }}</span>
          <span class="rekap-label">Izin</span>
        </div>
        <div class="rekap-item rekap-alfa">
          <span class="rekap-count">{{ stats.alfa }}</span>
          <span class="rekap-label">Alfa</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js'
import { supabase } from '@/supabase'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler)

const stats = ref({ totalGuru: 0, totalSiswa: 0, absensiHariIni: 0, tidakHadir: 0, hadir: 0, sakit: 0, izin: 0, alfa: 0, terlambat: 0 })
const chartDataMingguan = ref(null)
const chartDataStatus = ref(null)

const todayStr = computed(() => new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))

const lineOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#a0a0bf', font: { size: 12 } } } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a0a0bf', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a0a0bf', font: { size: 11 } }, beginAtZero: true }
  }
}

const doughnutOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { color: '#a0a0bf', font: { size: 12 }, padding: 16, boxWidth: 12 } } },
  cutout: '65%'
}

async function loadStats() {
  const today = new Date().toISOString().split('T')[0]

  const [{ count: cGuru }, { count: cSiswa }] = await Promise.all([
    supabase.from('guru').select('*', { count: 'exact', head: true }).eq('status_aktif', 1),
    supabase.from('siswa').select('*', { count: 'exact', head: true }).eq('status_aktif', 1),
  ])

  const { data: absensiToday } = await supabase.from('absensi').select('status').eq('tanggal', today)

  const hadir = absensiToday?.filter(a => a.status === 'Hadir').length || 0
  const sakit = absensiToday?.filter(a => a.status === 'Sakit').length || 0
  const izin = absensiToday?.filter(a => a.status === 'Izin').length || 0
  const alfa = absensiToday?.filter(a => a.status === 'Alfa').length || 0
  const terlambat = absensiToday?.filter(a => a.status === 'Terlambat').length || 0

  stats.value = {
    totalGuru: cGuru || 0,
    totalSiswa: cSiswa || 0,
    absensiHariIni: absensiToday?.length || 0,
    tidakHadir: alfa,
    hadir, sakit, izin, alfa, terlambat
  }

  // Chart status hari ini
  chartDataStatus.value = {
    labels: ['Hadir', 'Sakit', 'Izin', 'Alfa', 'Terlambat'],
    datasets: [{
      data: [hadir, sakit, izin, alfa, terlambat],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 0,
    }]
  }
}

async function loadChart() {
  const days = []
  const hadirData = []
  const alfaData = []

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const tgl = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    days.push(label)

    const { data } = await supabase.from('absensi').select('status').eq('tanggal', tgl)
    hadirData.push(data?.filter(a => a.status === 'Hadir').length || 0)
    alfaData.push(data?.filter(a => a.status === 'Alfa').length || 0)
  }

  chartDataMingguan.value = {
    labels: days,
    datasets: [
      {
        label: 'Hadir',
        data: hadirData,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Alfa',
        data: alfaData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ef4444',
      }
    ]
  }
}

onMounted(() => {
  loadStats()
  loadChart()
})
</script>

<style scoped>
.rekap-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: var(--radius-lg);
  gap: 6px;
}
.rekap-count { font-size: 32px; font-weight: 800; }
.rekap-label { font-size: 13px; font-weight: 600; }
.rekap-hadir { background: var(--success-bg); color: var(--success); }
.rekap-sakit { background: var(--info-bg); color: var(--info); }
.rekap-izin { background: var(--warning-bg); color: var(--warning); }
.rekap-alfa { background: var(--danger-bg); color: var(--danger); }
</style>
