<template>
  <div>
    <h1 class="page-title">Statistik Kehadiran</h1>
    <p class="page-subtitle">Visualisasi tren tingkat kehadiran siswa di kelas Anda</p>

    <!-- Class Selector -->
    <div class="card mb-6">
      <div class="filter-bar">
        <div class="form-group" style="margin-bottom:0;flex:1;max-width:260px">
          <label class="form-label">Pilih Jadwal / Mapel</label>
          <select v-model="selectedJadwal" class="form-control" @change="loadStats">
            <option value="">-- Pilih Jadwal --</option>
            <option v-for="j in jadwals" :key="j.id_jadwal" :value="j.id_jadwal">
              {{ j.kelas?.nama_kelas }} - {{ j.mata_pelajaran?.nama_mapel }} ({{ j.hari }})
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats Content -->
    <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
    <div v-else-if="!selectedJadwal" class="card text-center text-muted" style="padding:40px">
      <p>Silakan pilih jadwal pelajaran terlebih dahulu untuk memuat grafik statistik.</p>
    </div>
    <div v-else-if="totalAttendance === 0" class="card text-center text-muted" style="padding:40px">
      <p>Belum ada rekaman absensi untuk jadwal ini.</p>
    </div>
    <div v-else class="grid-3 mb-6">
      <div class="card flex flex-col items-center justify-center">
        <h3 class="section-title">Rasio Kehadiran</h3>
        <div style="position:relative;height:200px;width:100%;display:flex;align-items:center;justify-content:center">
          <Doughnut :data="chartDataStatus" :options="doughnutOptions" style="max-height:180px" />
        </div>
      </div>

      <div class="card" style="grid-column: span 2">
        <h3 class="section-title">Daftar Siswa dengan Tingkat Kehadiran Terendah</h3>
        <p class="text-muted text-small mb-4">Siswa yang paling sering Alfa, Sakit atau Izin (Butuh perhatian)</p>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nama Siswa</th>
                <th class="text-center text-danger">Alfa</th>
                <th class="text-center text-warning">Izin/Sakit</th>
                <th class="text-center">Persentase Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in lowAttendanceStudents" :key="s.id_siswa">
                <td><span class="font-semibold">{{ s.nama_siswa }}</span></td>
                <td class="text-center text-danger font-semibold">{{ s.alfa }}</td>
                <td class="text-center text-warning">{{ s.sakit + s.izin }}</td>
                <td class="text-center">
                  <span :class="persenClass(s.persen)">
                    {{ s.persen }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabase'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const auth = useAuthStore()
const loading = ref(false)
const jadwals = ref([])
const selectedJadwal = ref('')
const totalAttendance = ref(0)
const lowAttendanceStudents = ref([])
const chartDataStatus = ref(null)

const doughnutOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { color: '#a0a0bf', font: { size: 11 }, padding: 12 } } },
  cutout: '65%'
}

function persenClass(persen) {
  if (persen >= 90) return 'badge badge-success'
  if (persen >= 75) return 'badge badge-warning'
  return 'badge badge-danger'
}

async function loadJadwals() {
  loading.value = true
  const idGuru = auth.user?.reference_id
  if (!idGuru) {
    loading.value = false
    return
  }

  const { data: ta } = await supabase.from('tahun_ajaran').select('*').eq('status_aktif', 1).single()
  if (ta) {
    const { data } = await supabase
      .from('jadwal')
      .select('*, kelas(id_kelas, nama_kelas), mata_pelajaran(nama_mapel)')
      .eq('id_guru', idGuru)
      .eq('id_tahun_ajaran', ta.id_tahun_ajaran)
      .order('hari')
    jadwals.value = data || []
  }
  loading.value = false
}

async function loadStats() {
  if (!selectedJadwal.value) return
  loading.value = true

  const jId = selectedJadwal.value
  const activeJadwal = jadwals.value.find(j => String(j.id_jadwal) === String(jId))

  // Load attendance data for this schedule
  const { data: abs } = await supabase.from('absensi').select('*').eq('id_jadwal', jId)
  totalAttendance.value = abs?.length || 0

  if (abs && abs.length > 0) {
    const hadir = abs.filter(a => a.status === 'Hadir').length
    const sakit = abs.filter(a => a.status === 'Sakit').length
    const izin = abs.filter(a => a.status === 'Izin').length
    const alfa = abs.filter(a => a.status === 'Alfa').length
    const terlambat = abs.filter(a => a.status === 'Terlambat').length

    chartDataStatus.value = {
      labels: ['Hadir', 'Sakit', 'Izin', 'Alfa', 'Terlambat'],
      datasets: [{
        data: [hadir, sakit, izin, alfa, terlambat],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderWidth: 0,
      }]
    }

    // Low attendance student calculation
    const { data: siswas } = await supabase
      .from('siswa')
      .select('id_siswa, nama_siswa')
      .eq('id_kelas', activeJadwal.id_kelas)

    const list = []
    for (const s of (siswas || [])) {
      const sAbs = abs.filter(a => a.id_siswa === s.id_siswa)
      if (sAbs.length === 0) continue

      const sHadir = sAbs.filter(a => a.status === 'Hadir').length
      const sLembat = sAbs.filter(a => a.status === 'Terlambat').length
      const sAlfa = sAbs.filter(a => a.status === 'Alfa').length
      const sSakit = sAbs.filter(a => a.status === 'Sakit').length
      const sIzin = sAbs.filter(a => a.status === 'Izin').length

      const percent = Math.round(((sHadir + sLembat) / sAbs.length) * 100)
      list.push({
        id_siswa: s.id_siswa,
        nama_siswa: s.nama_siswa,
        alfa: sAlfa,
        sakit: sSakit,
        izin: sIzin,
        persen: percent
      })
    }

    // Sort to get low attendance first
    lowAttendanceStudents.value = list.sort((a,b) => a.persen - b.persen).slice(0, 5)
  }

  loading.value = false
}

onMounted(loadJadwals)
</script>
