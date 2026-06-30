<template>
  <div>
    <h1 class="page-title">Selamat Datang, {{ auth.user?.nama }}</h1>
    <p class="page-subtitle">Portal Guru - SMK Perpajakan Riau</p>

    <!-- Stat Cards -->
    <div class="grid-3 mb-6">
      <div class="stat-card stat-indigo">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Jadwal Mengajar</p>
          <p class="stat-value">{{ stats.totalJadwal }}</p>
          <p class="stat-sub">Mata pelajaran diampu</p>
        </div>
      </div>
      <div class="stat-card stat-emerald">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Sudah Diabsen</p>
          <p class="stat-value">{{ stats.sudahDiabsen }}</p>
          <p class="stat-sub">Jadwal yang telah terisi</p>
        </div>
      </div>
      <div class="stat-card stat-amber">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Belum Diabsen</p>
          <p class="stat-value">{{ stats.belumDiabsen }}</p>
          <p class="stat-sub">Jadwal hari ini</p>
        </div>
      </div>
    </div>

    <!-- Jadwal Hari Ini -->
    <div class="card">
      <div class="card-header">
        <h3 class="section-title" style="margin-bottom:0">Jadwal Mengajar Hari Ini ({{ todayName }})</h3>
      </div>

      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="jadwals.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <h3>Tidak ada jadwal hari ini</h3>
        <p>Anda bebas dari jadwal mengajar hari ini.</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Jam</th>
              <th>Kelas</th>
              <th>Mata Pelajaran</th>
              <th>Status Absensi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="j in jadwals" :key="j.id_jadwal">
              <td>{{ formatTime(j.jam_mulai) }} - {{ formatTime(j.jam_selesai) }}</td>
              <td><span class="badge badge-primary">{{ j.kelas?.nama_kelas }}</span></td>
              <td><span class="font-semibold">{{ j.mata_pelajaran?.nama_mapel }}</span></td>
              <td>
                <span :class="j.isFilled ? 'badge badge-success' : 'badge badge-danger'">
                  {{ j.isFilled ? 'Selesai Diabsen' : 'Belum Diabsen' }}
                </span>
              </td>
              <td>
                <router-link :to="`/guru/absensi/isi/${j.id_jadwal}`" class="btn btn-sm btn-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  {{ j.isFilled ? 'Edit Absensi' : 'Isi Absensi' }}
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabase'

const auth = useAuthStore()
const loading = ref(true)
const stats = ref({ totalJadwal: 0, sudahDiabsen: 0, belumDiabsen: 0 })
const jadwals = ref([])

const daysEng = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const daysInd = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const todayName = daysInd[new Date().getDay()]

function formatTime(tStr) {
  if (!tStr) return '-'
  return tStr.substring(0, 5)
}

async function loadData() {
  loading.value = true
  const idGuru = auth.user?.reference_id
  if (!idGuru) {
    loading.value = false
    return
  }

  // Get active year
  const { data: ta } = await supabase.from('tahun_ajaran').select('*').eq('status_aktif', 1).single()

  if (ta) {
    // Total schedules for this guru
    const { count: scheduleCount } = await supabase
      .from('jadwal')
      .select('*', { count: 'exact', head: true })
      .eq('id_guru', idGuru)
      .eq('id_tahun_ajaran', ta.id_tahun_ajaran)
    stats.value.totalJadwal = scheduleCount || 0

    // Schedules for today
    const { data: todaySchedules } = await supabase
      .from('jadwal')
      .select('*, kelas(nama_kelas), mata_pelajaran(nama_mapel)')
      .eq('id_guru', idGuru)
      .eq('hari', todayName)
      .eq('id_tahun_ajaran', ta.id_tahun_ajaran)
      .order('jam_mulai')

    const todayList = todaySchedules || []
    const todayDate = new Date().toISOString().split('T')[0]

    let filledCount = 0
    for (const j of todayList) {
      // Check if absensi has been filled for this schedule today
      const { count } = await supabase
        .from('absensi')
        .select('*', { count: 'exact', head: true })
        .eq('id_jadwal', j.id_jadwal)
        .eq('tanggal', todayDate)
      j.isFilled = (count || 0) > 0
      if (j.isFilled) filledCount++
    }

    jadwals.value = todayList
    stats.value.sudahDiabsen = filledCount
    stats.value.belumDiabsen = todayList.length - filledCount
  }

  loading.value = false
}

onMounted(loadData)
</script>
