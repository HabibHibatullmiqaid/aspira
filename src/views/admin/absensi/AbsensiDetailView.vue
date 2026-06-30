<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/absensi" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">Detail Record Absensi</h1>
        <p class="page-subtitle">Rincian absensi siswa tertentu</p>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
    <div v-else-if="!record" class="card text-center text-muted" style="padding:40px">
      <p>Record absensi tidak ditemukan.</p>
    </div>
    <div v-else class="card">
      <div class="info-row">
        <span class="info-label">Tanggal</span>
        <span class="info-val">{{ formatDate(record.tanggal) }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Nama Siswa</span>
        <span class="info-val">{{ record.siswa?.nama_siswa }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">NIS</span>
        <span class="info-val text-muted">{{ record.siswa?.nis }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Kelas</span>
        <span class="info-val">{{ record.jadwal?.kelas?.nama_kelas }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Mata Pelajaran</span>
        <span class="info-val">{{ record.jadwal?.mata_pelajaran?.nama_mapel }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Guru Pengajar</span>
        <span class="info-val">{{ record.jadwal?.guru?.nama_guru }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Status Kehadiran</span>
        <span class="info-val">
          <span :class="badgeClass(record.status)">{{ record.status }}</span>
        </span>
      </div>
      <div class="info-row" style="border-bottom:none">
        <span class="info-label">Keterangan</span>
        <span class="info-val text-muted">{{ record.keterangan || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const loading = ref(true)
const record = ref(null)

function formatDate(dStr) {
  if (!dStr) return '-'
  return new Date(dStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function badgeClass(status) {
  return {
    'Hadir': 'badge badge-success',
    'Sakit': 'badge badge-info',
    'Izin': 'badge badge-warning',
    'Alfa': 'badge badge-danger',
    'Terlambat': 'badge badge-primary'
  }[status] || 'badge'
}

async function loadData() {
  loading.value = true
  const { data } = await supabase
    .from('absensi')
    .select('*, siswa(nama_siswa, nis), jadwal(kelas(nama_kelas), mata_pelajaran(nama_mapel), guru(nama_guru))')
    .eq('id_absensi', route.params.id)
    .single()
  record.value = data
  loading.value = false
}

onMounted(loadData)
</script>

<style scoped>
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.info-label { color: var(--text-muted); font-size: 13px; font-weight: 500; }
.info-val { font-weight: 600; font-size: 14px; }
</style>
