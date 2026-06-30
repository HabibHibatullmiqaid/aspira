<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/siswa" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">Detail Siswa</h1>
        <p class="page-subtitle">Profil dan riwayat kehadiran siswa</p>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
    <div v-else-if="!siswa" class="card text-center text-muted" style="padding: 40px;">
      <h3>Siswa tidak ditemukan</h3>
    </div>
    <div v-else class="grid-3">
      <!-- Profile Card -->
      <div class="card flex flex-col items-center text-center">
        <div class="profile-avatar mb-4">
          <span v-if="!siswa.foto">{{ siswa.nama_siswa?.charAt(0).toUpperCase() }}</span>
          <img v-else :src="siswa.foto" alt="Foto Siswa" />
        </div>
        <h2 class="font-bold" style="font-size:16px">{{ siswa.nama_siswa }}</h2>
        <p class="text-muted text-small mb-3">NIS: {{ siswa.nis }}</p>
        <span :class="siswa.status_aktif ? 'badge badge-success' : 'badge badge-danger'">
          {{ siswa.status_aktif ? 'Aktif' : 'Non-Aktif' }}
        </span>

        <div class="divider w-full"></div>
        
        <div class="w-full text-left">
          <div class="info-row">
            <span class="info-label">Kelas</span>
            <span class="info-val">{{ siswa.kelas?.nama_kelas || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Jenis Kelamin</span>
            <span class="info-val">{{ siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Nomor Wali</span>
            <span class="info-val">{{ siswa.nomor_hp || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- Detail & Attendance Rekap Card -->
      <div class="card" style="grid-column: span 2">
        <h3 class="section-title">Informasi Pribadi</h3>
        
        <div class="detail-grid mb-6">
          <div class="detail-item">
            <span class="detail-label">Tempat Lahir</span>
            <p class="detail-val">{{ siswa.tempat_lahir || '-' }}</p>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tanggal Lahir</span>
            <p class="detail-val">{{ formatDate(siswa.tanggal_lahir) }}</p>
          </div>
          <div class="detail-item" style="grid-column: span 2">
            <span class="detail-label">Alamat Lengkap</span>
            <p class="detail-val">{{ siswa.alamat || '-' }}</p>
          </div>
        </div>

        <div class="divider"></div>

        <h3 class="section-title">Rekap Absensi Semester Ini</h3>
        
        <div class="rekap-grid">
          <div class="rekap-card hadir">
            <span class="count">{{ rekap.hadir }}</span>
            <span class="label">Hadir</span>
          </div>
          <div class="rekap-card sakit">
            <span class="count">{{ rekap.sakit }}</span>
            <span class="label">Sakit</span>
          </div>
          <div class="rekap-card izin">
            <span class="count">{{ rekap.izin }}</span>
            <span class="label">Izin</span>
          </div>
          <div class="rekap-card alfa">
            <span class="count">{{ rekap.alfa }}</span>
            <span class="label">Alfa</span>
          </div>
          <div class="rekap-card terlambat">
            <span class="count">{{ rekap.terlambat }}</span>
            <span class="label">Terlambat</span>
          </div>
        </div>

        <div class="divider"></div>

        <h3 class="section-title">Log Absensi Terbaru</h3>
        <div v-if="absensi.length === 0" class="text-muted text-small">
          Belum ada riwayat absensi tercatat.
        </div>
        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Mata Pelajaran</th>
                <th>Status</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in absensi" :key="a.id_absensi">
                <td><span class="font-semibold">{{ formatDate(a.tanggal) }}</span></td>
                <td>{{ a.jadwal?.mata_pelajaran?.nama_mapel }}</td>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const siswa = ref(null)
const loading = ref(true)
const absensi = ref([])
const rekap = ref({ hadir: 0, sakit: 0, izin: 0, alfa: 0, terlambat: 0 })

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

async function loadData() {
  loading.value = true
  const id = route.params.id

  const { data: sData } = await supabase.from('siswa').select('*, kelas(nama_kelas)').eq('id_siswa', id).single()
  siswa.value = sData

  if (sData) {
    // Load attendance logs
    const { data: aData } = await supabase
      .from('absensi')
      .select('*, jadwal(mata_pelajaran(nama_mapel))')
      .eq('id_siswa', id)
      .order('tanggal', { ascending: false })
      .limit(10)
    absensi.value = aData || []

    // Calculate dynamic stats
    const { data: allAbs } = await supabase.from('absensi').select('status').eq('id_siswa', id)
    if (allAbs) {
      rekap.value = {
        hadir: allAbs.filter(a => a.status === 'Hadir').length,
        sakit: allAbs.filter(a => a.status === 'Sakit').length,
        izin: allAbs.filter(a => a.status === 'Izin').length,
        alfa: allAbs.filter(a => a.status === 'Alfa').length,
        terlambat: allAbs.filter(a => a.status === 'Terlambat').length,
      }
    }
  }

  loading.value = false
}

onMounted(loadData)
</script>

<style scoped>
.profile-avatar {
  width: 96px; height: 96px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  border: 4px solid var(--bg-elevated);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.info-row:last-child { border-bottom: none; }
.info-label { color: var(--text-muted); font-size: 12px; }
.info-val { font-weight: 600; font-size: 13px; }

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.detail-label { display: block; font-size: 11px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 4px; }
.detail-val { font-size: 14px; font-weight: 600; color: var(--text-primary); }

.rekap-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.rekap-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}
.rekap-card .count { font-size: 20px; font-weight: 800; }
.rekap-card .label { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }

.rekap-card.hadir { background: var(--success-bg); border-color: rgba(16,185,129,0.2); color: var(--success); }
.rekap-card.sakit { background: var(--info-bg); border-color: rgba(59,130,246,0.2); color: var(--info); }
.rekap-card.izin { background: var(--warning-bg); border-color: rgba(245,158,11,0.2); color: var(--warning); }
.rekap-card.alfa { background: var(--danger-bg); border-color: rgba(239,68,68,0.2); color: var(--danger); }
.rekap-card.terlambat { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.2); color: #a78bfa; }
</style>
