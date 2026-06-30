<template>
  <div>
    <h1 class="page-title">Absensi Saya</h1>
    <p class="page-subtitle">Riwayat lengkap presensi mata pelajaran Anda</p>

    <div class="card">
      <!-- Filter -->
      <div class="filter-bar">
        <select v-model="filterStatus" class="form-control" style="max-width:180px">
          <option value="">Semua Status</option>
          <option v-for="s in ['Hadir', 'Sakit', 'Izin', 'Alfa', 'Terlambat']" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <!-- Table -->
      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        <h3>Tidak ada riwayat absensi</h3>
        <p>Anda belum memiliki rekaman absensi terdaftar.</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tanggal</th>
              <th>Mata Pelajaran</th>
              <th>Guru Pengajar</th>
              <th>Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, i) in paginated" :key="a.id_absensi">
              <td>{{ (page - 1) * perPage + i + 1 }}</td>
              <td><span class="font-semibold">{{ formatDate(a.tanggal) }}</span></td>
              <td><span class="font-medium">{{ a.jadwal?.mata_pelajaran?.nama_mapel }}</span></td>
              <td class="text-muted">{{ a.jadwal?.guru?.nama_guru }}</td>
              <td>
                <span :class="badgeClass(a.status)">{{ a.status }}</span>
              </td>
              <td class="text-muted">{{ a.keterangan || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="page === 1" @click="page--">‹</button>
        <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: page === p }" @click="page = p">{{ p }}</button>
        <button class="page-btn" :disabled="page === totalPages" @click="page++">›</button>
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
const absensi = ref([])
const filterStatus = ref('')
const page = ref(1)
const perPage = 10

const filtered = computed(() => {
  return absensi.value.filter(a => {
    return filterStatus.value === '' || a.status === filterStatus.value
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))
const paginated = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

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
  const idSiswa = auth.user?.reference_id
  if (!idSiswa) {
    loading.value = false
    return
  }

  const { data } = await supabase
    .from('absensi')
    .select('*, jadwal(mata_pelajaran(nama_mapel), guru(nama_guru))')
    .eq('id_siswa', idSiswa)
    .order('tanggal', { ascending: false })

  absensi.value = data || []
  loading.value = false
}

onMounted(loadData)
</script>
