<template>
  <div>
    <h1 class="page-title">Riwayat Absensi</h1>
    <p class="page-subtitle">Daftar kelas yang telah selesai diabsen</p>

    <div class="card">
      <div class="filter-bar">
        <input v-model="filterTanggal" type="date" class="form-control" style="max-width:180px" />
        <select v-model="filterKelas" class="form-control" style="max-width:180px">
          <option value="">Semua Kelas</option>
          <option v-for="k in kelases" :key="k.id_kelas" :value="k.id_kelas">{{ k.nama_kelas }}</option>
        </select>
      </div>

      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        <h3>Belum ada riwayat absensi</h3>
        <p>Silakan isi absensi kelas Anda terlebih dahulu.</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tanggal</th>
              <th>Hari</th>
              <th>Kelas</th>
              <th>Mata Pelajaran</th>
              <th>Jam</th>
              <th>Siswa Hadir / Total</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in paginated" :key="i">
              <td>{{ (page - 1) * perPage + i + 1 }}</td>
              <td><span class="font-semibold">{{ formatDate(r.tanggal) }}</span></td>
              <td>{{ r.jadwal?.hari }}</td>
              <td><span class="badge badge-primary">{{ r.jadwal?.kelas?.nama_kelas }}</span></td>
              <td><span class="font-semibold">{{ r.jadwal?.mata_pelajaran?.nama_mapel }}</span></td>
              <td>{{ formatTime(r.jadwal?.jam_mulai) }} - {{ formatTime(r.jadwal?.jam_selesai) }}</td>
              <td>
                <span class="font-bold text-success">{{ r.countHadir }}</span> / {{ r.countTotal }}
              </td>
              <td>
                <router-link :to="`/guru/absensi/isi/${r.jadwal?.id_jadwal}`" class="btn btn-sm btn-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Koreksi
                </router-link>
              </td>
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
const riwayats = ref([])
const kelases = ref([])
const filterTanggal = ref('')
const filterKelas = ref('')
const page = ref(1)
const perPage = 10

const filtered = computed(() => {
  return riwayats.value.filter(r => {
    const matchTanggal = filterTanggal.value === '' || r.tanggal === filterTanggal.value
    const matchKelas = filterKelas.value === '' || String(r.jadwal?.id_kelas) === filterKelas.value
    return matchTanggal && matchKelas
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))
const paginated = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

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
  const idGuru = auth.user?.reference_id
  if (!idGuru) {
    loading.value = false
    return
  }

  // Load all unique dates and schedules from absensi where jadwal's guru is this guru
  const { data: absData } = await supabase
    .from('absensi')
    .select('tanggal, status, id_jadwal, jadwal!inner(id_jadwal, id_kelas, jam_mulai, jam_selesai, hari, kelas(nama_kelas), mata_pelajaran(nama_mapel))')
    .eq('jadwal.id_guru', idGuru)

  // Group by date + jadwal
  const groupedMap = new Map()
  for (const item of (absData || [])) {
    const key = `${item.tanggal}_${item.id_jadwal}`
    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        tanggal: item.tanggal,
        jadwal: item.jadwal,
        countTotal: 0,
        countHadir: 0
      })
    }
    const val = groupedMap.get(key)
    val.countTotal++
    if (item.status === 'Hadir' || item.status === 'Terlambat') {
      val.countHadir++
    }
  }

  riwayats.value = Array.from(groupedMap.values()).sort((a,b) => b.tanggal.localeCompare(a.tanggal))

  // Load classes for filter
  const { data: kData } = await supabase.from('kelas').select('id_kelas, nama_kelas').order('nama_kelas')
  kelases.value = kData || []

  loading.value = false
}

onMounted(loadData)
</script>
