<template>
  <div>
    <h1 class="page-title">Jadwal Mengajar</h1>
    <p class="page-subtitle">Daftar lengkap jadwal mengajar Anda semester ini</p>

    <div class="card">
      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="jadwals.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <h3>Jadwal mengajar kosong</h3>
        <p>Anda tidak memiliki jadwal mengajar pada tahun ajaran ini.</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Hari</th>
              <th>Jam</th>
              <th>Kelas</th>
              <th>Mata Pelajaran</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="j in jadwals" :key="j.id_jadwal">
              <td><span class="font-semibold">{{ j.hari }}</span></td>
              <td>{{ formatTime(j.jam_mulai) }} - {{ formatTime(j.jam_selesai) }}</td>
              <td><span class="badge badge-primary">{{ j.kelas?.nama_kelas }}</span></td>
              <td><span class="font-medium">{{ j.mata_pelajaran?.nama_mapel }}</span></td>
              <td>
                <router-link :to="`/guru/absensi/isi/${j.id_jadwal}`" class="btn btn-sm btn-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  Isi / Edit Absen
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
const jadwals = ref([])

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

  const { data: ta } = await supabase.from('tahun_ajaran').select('*').eq('status_aktif', 1).single()
  if (ta) {
    const { data } = await supabase
      .from('jadwal')
      .select('*, kelas(nama_kelas), mata_pelajaran(nama_mapel)')
      .eq('id_guru', idGuru)
      .eq('id_tahun_ajaran', ta.id_tahun_ajaran)
      .order('hari')
      .order('jam_mulai')
    jadwals.value = data || []
  }

  loading.value = false
}

onMounted(loadData)
</script>
