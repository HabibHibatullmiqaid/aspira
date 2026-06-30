<template>
  <div>
    <h1 class="page-title no-print">Laporan Absensi</h1>
    <p class="page-subtitle no-print">Ekspor dan cetak laporan absensi akademik</p>

    <!-- Filter Card -->
    <div class="card mb-6 no-print">
      <h3 class="section-title">Filter Laporan</h3>
      <form @submit.prevent="generateReport">
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Tanggal Mulai <span class="required">*</span></label>
            <input v-model="form.tgl_dari" type="date" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal Selesai <span class="required">*</span></label>
            <input v-model="form.tgl_sampai" type="date" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Kelas</label>
            <select v-model="form.id_kelas" class="form-control">
              <option value="">Semua Kelas</option>
              <option v-for="k in kelases" :key="k.id_kelas" :value="k.id_kelas">{{ k.nama_kelas }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Mata Pelajaran</label>
            <select v-model="form.id_mapel" class="form-control">
              <option value="">Semua Mapel</option>
              <option v-for="m in mapels" :key="m.id_mapel" :value="m.id_mapel">{{ m.nama_mapel }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Guru Pengajar</label>
            <select v-model="form.id_guru" class="form-control">
              <option value="">Semua Guru</option>
              <option v-for="g in gurus" :key="g.id_guru" :value="g.id_guru">{{ g.nama_guru }}</option>
            </select>
          </div>
          <div class="form-group" style="align-self:flex-end">
            <button type="submit" class="btn btn-primary w-full" :disabled="loading">
              <span v-if="loading" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
              <span v-else>Tampilkan</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Report Area -->
    <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
    <div v-else-if="!generated" class="card text-center text-muted no-print" style="padding:40px">
      <p>Silakan atur filter dan klik "Tampilkan" untuk memuat laporan.</p>
    </div>
    <div v-else-if="reportData.length === 0" class="card text-center text-muted" style="padding:40px">
      <p>Tidak ditemukan data absensi untuk filter terpilih.</p>
    </div>
    <div v-else class="card print-area">
      <!-- Print Header -->
      <div class="print-header" style="display:none">
        <h2>LAPORAN ABSENSI AKADEMIK</h2>
        <h3>SMK PERPAJAKAN RIAU</h3>
        <p>Periode: {{ formatDate(form.tgl_dari) }} s/d {{ formatDate(form.tgl_sampai) }}</p>
        <p v-if="form.id_kelas">Kelas: {{ currentKelasName }}</p>
        <div class="divider"></div>
      </div>

      <div class="card-header no-print">
        <h3 class="section-title" style="margin-bottom:0">Hasil Laporan</h3>
        <button class="btn btn-success btn-sm" @click="printReport">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Cetak Laporan
        </button>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>Mata Pelajaran</th>
              <th>Guru</th>
              <th>Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in reportData" :key="a.id_absensi">
              <td><span class="font-semibold">{{ formatDate(a.tanggal) }}</span></td>
              <td><span class="font-medium">{{ a.siswa?.nama_siswa }}</span></td>
              <td>{{ a.jadwal?.kelas?.nama_kelas }}</td>
              <td>{{ a.jadwal?.mata_pelajaran?.nama_mapel }}</td>
              <td class="text-muted">{{ a.jadwal?.guru?.nama_guru }}</td>
              <td>
                <span :class="badgeClass(a.status)">{{ a.status }}</span>
              </td>
              <td class="text-muted">{{ a.keterangan || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabase'

const loading = ref(false)
const generated = ref(false)
const kelases = ref([])
const mapels = ref([])
const gurus = ref([])
const reportData = ref([])

const form = ref({ tgl_dari: '', tgl_sampai: '', id_kelas: '', id_mapel: '', id_guru: '' })

const currentKelasName = computed(() => {
  const k = kelases.value.find(item => String(item.id_kelas) === String(form.value.id_kelas))
  return k ? k.nama_kelas : ''
})

function formatDate(dStr) {
  if (!dStr) return '-'
  return new Date(dStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
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

async function loadFilters() {
  const [{ data: kData }, { data: mData }, { data: gData }] = await Promise.all([
    supabase.from('kelas').select('id_kelas, nama_kelas').order('nama_kelas'),
    supabase.from('mata_pelajaran').select('id_mapel, nama_mapel').order('nama_mapel'),
    supabase.from('guru').select('id_guru, nama_guru').eq('status_aktif', 1).order('nama_guru')
  ])
  kelases.value = kData || []
  mapels.value = mData || []
  gurus.value = gData || []

  // Default dates (current month)
  const date = new Date()
  const y = date.getFullYear()
  const m = date.getMonth()
  form.value.tgl_dari = new Date(y, m, 1).toISOString().split('T')[0]
  form.value.tgl_sampai = new Date(y, m + 1, 0).toISOString().split('T')[0]
}

async function generateReport() {
  loading.value = true
  generated.value = true

  let query = supabase
    .from('absensi')
    .select('*, siswa(nama_siswa), jadwal!inner(id_kelas, id_mapel, id_guru, kelas(nama_kelas), mata_pelajaran(nama_mapel), guru(nama_guru))')
    .gte('tanggal', form.value.tgl_dari)
    .lte('tanggal', form.value.tgl_sampai)

  if (form.value.id_kelas) {
    query = query.eq('jadwal.id_kelas', form.value.id_kelas)
  }
  if (form.value.id_mapel) {
    query = query.eq('jadwal.id_mapel', form.value.id_mapel)
  }
  if (form.value.id_guru) {
    query = query.eq('jadwal.id_guru', form.value.id_guru)
  }

  const { data, error } = await query.order('tanggal', { ascending: false })
  if (!error) {
    reportData.value = data || []
  }
  loading.value = false
}

function printReport() {
  window.print()
}

onMounted(loadFilters)
</script>

<style scoped>
@media print {
  .no-print { display: none !important; }
  .print-area {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  .print-header {
    display: block !important;
    text-align: center;
    color: #000;
    margin-bottom: 24px;
  }
  .print-header h2 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
  .print-header h3 { font-size: 14px; margin-bottom: 4px; }
  .print-header p { font-size: 12px; }
  .divider { background: #000 !important; height: 2px !important; margin: 12px 0 !important; }
  
  :deep(.data-table) {
    color: #000 !important;
  }
  :deep(.data-table th) {
    background: #f1f5f9 !important;
    color: #000 !important;
    border: 1px solid #cbd5e1 !important;
  }
  :deep(.data-table td) {
    border: 1px solid #cbd5e1 !important;
    color: #000 !important;
    background: transparent !important;
  }
  :deep(.badge) {
    border: none !important;
    background: transparent !important;
    color: #000 !important;
    padding: 0 !important;
    font-weight: 700;
  }
}
</style>
