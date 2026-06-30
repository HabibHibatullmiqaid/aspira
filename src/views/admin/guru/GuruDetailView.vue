<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/guru" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">Detail Guru</h1>
        <p class="page-subtitle">Informasi lengkap profil guru</p>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
    <div v-else-if="!guru" class="card text-center text-muted" style="padding: 40px;">
      <h3>Guru tidak ditemukan</h3>
    </div>
    <div v-else class="grid-3">
      <!-- Profile Card -->
      <div class="card flex flex-col items-center text-center">
        <div class="profile-avatar mb-4">
          <span v-if="!guru.foto">{{ guru.nama_guru?.charAt(0).toUpperCase() }}</span>
          <img v-else :src="guru.foto" alt="Foto Guru" />
        </div>
        <h2 class="font-bold" style="font-size:16px">{{ guru.nama_guru }}</h2>
        <p class="text-muted text-small mb-3">NIP: {{ guru.nip || '-' }}</p>
        <span :class="guru.status_aktif ? 'badge badge-success' : 'badge badge-danger'">
          {{ guru.status_aktif ? 'Aktif' : 'Non-Aktif' }}
        </span>

        <div class="divider w-full"></div>
        
        <div class="w-full text-left">
          <div class="info-row">
            <span class="info-label">Jenis Kelamin</span>
            <span class="info-val">{{ guru.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-val truncate" :title="guru.email">{{ guru.email || '-' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Nomor HP</span>
            <span class="info-val">{{ guru.nomor_hp || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- Detail Info Card -->
      <div class="card" style="grid-column: span 2">
        <h3 class="section-title">Informasi Lengkap</h3>
        
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Tempat Lahir</span>
            <p class="detail-val">{{ guru.tempat_lahir || '-' }}</p>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tanggal Lahir</span>
            <p class="detail-val">{{ formatDate(guru.tanggal_lahir) }}</p>
          </div>
          <div class="detail-item" style="grid-column: span 2">
            <span class="detail-label">Alamat Lengkap</span>
            <p class="detail-val">{{ guru.alamat || '-' }}</p>
          </div>
        </div>

        <div class="divider"></div>

        <h3 class="section-title">Jadwal Mengajar (Genap 2025/2026)</h3>
        <div v-if="jadwals.length === 0" class="text-muted text-small">
          Tidak ada jadwal mengajar terdaftar pada semester ini.
        </div>
        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Hari</th>
                <th>Jam</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="j in jadwals" :key="j.id_jadwal">
                <td><span class="font-semibold">{{ j.hari }}</span></td>
                <td>{{ formatTime(j.jam_mulai) }} - {{ formatTime(j.jam_selesai) }}</td>
                <td>{{ j.kelas?.nama_kelas }}</td>
                <td>{{ j.mata_pelajaran?.nama_mapel }}</td>
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
const guru = ref(null)
const jadwals = ref([])
const loading = ref(true)

function formatDate(dStr) {
  if (!dStr) return '-'
  return new Date(dStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(tStr) {
  if (!tStr) return '-'
  return tStr.substring(0, 5)
}

async function loadData() {
  loading.value = true
  const id = route.params.id

  // Load guru details
  const { data: gData } = await supabase.from('guru').select('*').eq('id_guru', id).single()
  guru.value = gData

  if (gData) {
    // Load jadwal mengajar
    const { data: jData } = await supabase
      .from('jadwal')
      .select('*, kelas(nama_kelas), mata_pelajaran(nama_mapel)')
      .eq('id_guru', id)
      .eq('id_tahun_ajaran', 6) // Current active genap
    jadwals.value = jData || []
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
</style>
