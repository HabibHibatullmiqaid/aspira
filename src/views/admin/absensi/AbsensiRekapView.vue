<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/absensi" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">Rekap Absensi Kelas</h1>
        <p class="page-subtitle">Rekapitulasi kehadiran total per siswa dalam satu kelas</p>
      </div>
    </div>

    <!-- Filter Card -->
    <div class="card mb-6 no-print">
      <div class="filter-bar">
        <div class="form-group" style="margin-bottom:0;flex:1;min-width:200px">
          <label class="form-label">Pilih Kelas</label>
          <select v-model="selectedKelas" class="form-control" @change="loadRekap">
            <option value="">-- Pilih Kelas --</option>
            <option v-for="k in kelases" :key="k.id_kelas" :value="k.id_kelas">{{ k.nama_kelas }}</option>
          </select>
        </div>
        <button class="btn btn-success" style="align-self:flex-end" @click="printRekap" :disabled="!selectedKelas || loading">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Cetak Rekap
        </button>
      </div>
    </div>

    <!-- Rekap Content -->
    <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
    <div v-else-if="!selectedKelas" class="card text-center text-muted" style="padding:40px">
      <p>Silakan pilih kelas terlebih dahulu untuk melihat rekapitulasi kehadiran.</p>
    </div>
    <div v-else-if="rekapData.length === 0" class="card text-center text-muted" style="padding:40px">
      <p>Belum ada siswa terdaftar di kelas ini atau belum ada catatan absensi.</p>
    </div>
    <div v-else class="card print-area">
      <!-- Print Header (Visible only on print) -->
      <div class="print-header" style="display:none">
        <h2>REKAPITULASI KEHADIRAN SISWA</h2>
        <h3>SMK PERPAJAKAN RIAU</h3>
        <p>Kelas: {{ kelasNama }} | Semester: {{ taAktif?.tahun_ajaran }} ({{ taAktif?.semester }})</p>
        <div class="divider"></div>
      </div>

      <div class="card-header no-print">
        <h3 class="section-title" style="margin-bottom:0">Daftar Kehadiran Kelas: {{ kelasNama }}</h3>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>NIS</th>
              <th>Nama Siswa</th>
              <th class="text-center text-success">Hadir</th>
              <th class="text-center text-info">Sakit</th>
              <th class="text-center text-warning">Izin</th>
              <th class="text-center text-danger">Alfa</th>
              <th class="text-center text-primary-light">Terlambat</th>
              <th class="text-center font-bold">Total</th>
              <th class="text-center font-bold">Persentase Kehadiran</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in rekapData" :key="r.id_siswa">
              <td>{{ i + 1 }}</td>
              <td class="text-muted">{{ r.nis }}</td>
              <td><span class="font-semibold">{{ r.nama_siswa }}</span></td>
              <td class="text-center text-success font-semibold">{{ r.hadir }}</td>
              <td class="text-center text-info">{{ r.sakit }}</td>
              <td class="text-center text-warning">{{ r.izin }}</td>
              <td class="text-center text-danger font-semibold">{{ r.alfa }}</td>
              <td class="text-center text-primary-light">{{ r.terlambat }}</td>
              <td class="text-center font-medium">{{ r.total }}</td>
              <td class="text-center">
                <span :class="persenClass(r.persen_hadir)">
                  {{ r.persen_hadir }}%
                </span>
              </td>
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

const kelases = ref([])
const selectedKelas = ref('')
const rekapData = ref([])
const taAktif = ref(null)
const loading = ref(false)

const kelasNama = computed(() => {
  const k = kelases.value.find(item => String(item.id_kelas) === String(selectedKelas.value))
  return k ? k.nama_kelas : ''
})

function persenClass(persen) {
  if (persen >= 90) return 'badge badge-success'
  if (persen >= 75) return 'badge badge-warning'
  return 'badge badge-danger'
}

async function loadData() {
  loading.value = true
  const [{ data: kData }, { data: ta }] = await Promise.all([
    supabase.from('kelas').select('id_kelas, nama_kelas').order('nama_kelas'),
    supabase.from('tahun_ajaran').select('*').eq('status_aktif', 1).single()
  ])
  kelases.value = kData || []
  taAktif.value = ta
  loading.value = false
}

async function loadRekap() {
  if (!selectedKelas.value) {
    rekapData.value = []
    return
  }

  loading.value = true

  // Get all students in class
  const { data: siswas } = await supabase
    .from('siswa')
    .select('id_siswa, nis, nama_siswa')
    .eq('id_kelas', selectedKelas.value)
    .eq('status_aktif', 1)
    .order('nama_siswa')

  if (!siswas || siswas.length === 0) {
    rekapData.value = []
    loading.value = false
    return
  }

  const results = []
  for (const s of siswas) {
    // Get all attendance records for active academic year's schedules
    const { data: abs } = await supabase
      .from('absensi')
      .select('status, jadwal!inner(id_tahun_ajaran)')
      .eq('id_siswa', s.id_siswa)
      .eq('jadwal.id_tahun_ajaran', taAktif.value?.id_tahun_ajaran)

    const hadir = abs?.filter(a => a.status === 'Hadir').length || 0
    const sakit = abs?.filter(a => a.status === 'Sakit').length || 0
    const izin = abs?.filter(a => a.status === 'Izin').length || 0
    const alfa = abs?.filter(a => a.status === 'Alfa').length || 0
    const terlambat = abs?.filter(a => a.status === 'Terlambat').length || 0
    const total = abs?.length || 0

    const persen_hadir = total > 0 ? Math.round(((hadir + terlambat) / total) * 100) : 100

    results.push({
      id_siswa: s.id_siswa,
      nis: s.nis,
      nama_siswa: s.nama_siswa,
      hadir, sakit, izin, alfa, terlambat, total,
      persen_hadir
    })
  }

  rekapData.value = results
  loading.value = false
}

function printRekap() {
  window.print()
}

onMounted(loadData)
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
