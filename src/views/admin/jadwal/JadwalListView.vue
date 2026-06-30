<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">Jadwal Pelajaran</h1>
        <p class="page-subtitle">Atur dan kelola jadwal pelajaran sekolah</p>
      </div>
      <router-link to="/admin/jadwal/tambah" class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Tambah Jadwal
      </router-link>
    </div>

    <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {{ alert.msg }}
    </div>

    <div class="card">
      <div class="filter-bar">
        <select v-model="filterKelas" class="form-control" style="max-width:180px">
          <option value="">Semua Kelas</option>
          <option v-for="k in kelases" :key="k.id_kelas" :value="k.id_kelas">{{ k.nama_kelas }}</option>
        </select>
        <select v-model="filterHari" class="form-control" style="max-width:160px">
          <option value="">Semua Hari</option>
          <option v-for="h in ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']" :key="h" :value="h">{{ h }}</option>
        </select>
        <span class="badge badge-info" style="margin-left:auto" v-if="taAktif">
          Tahun Ajaran Aktif: {{ taAktif.tahun_ajaran }} ({{ taAktif.semester }})
        </span>
      </div>

      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <h3>Belum ada jadwal pelajaran</h3>
        <p>Tambah jadwal pelajaran baru untuk memulai</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Hari</th>
              <th>Jam</th>
              <th>Kelas</th>
              <th>Mata Pelajaran</th>
              <th>Guru Pengajar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="j in filtered" :key="j.id_jadwal">
              <td><span class="font-semibold">{{ j.hari }}</span></td>
              <td>{{ formatTime(j.jam_mulai) }} - {{ formatTime(j.jam_selesai) }}</td>
              <td><span class="badge badge-primary">{{ j.kelas?.nama_kelas }}</span></td>
              <td><span class="font-medium">{{ j.mata_pelajaran?.nama_mapel }}</span></td>
              <td class="text-primary-light">{{ j.guru?.nama_guru }}</td>
              <td>
                <div class="table-actions">
                  <router-link :to="`/admin/jadwal/edit/${j.id_jadwal}`" class="btn btn-sm btn-warning" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </router-link>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(j)" title="Hapus">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="deleteModal.show" class="modal-backdrop" @click.self="deleteModal.show = false">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">Konfirmasi Hapus</span>
          <button class="modal-close" @click="deleteModal.show = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger" style="margin-bottom:0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Hapus jadwal mengajar ini? Seluruh data kehadiran yang dicatat untuk jadwal ini akan hilang!
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="deleteModal.show = false">Batal</button>
          <button class="btn btn-danger" @click="doDelete" :disabled="deleteModal.loading">
            <span v-if="deleteModal.loading" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
            <span v-else>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/supabase'

const jadwals = ref([])
const kelases = ref([])
const taAktif = ref(null)
const loading = ref(true)
const filterKelas = ref('')
const filterHari = ref('')
const alert = ref({ show: false, type: 'success', msg: '' })
const deleteModal = ref({ show: false, j: null, loading: false })

const filtered = computed(() => {
  return jadwals.value.filter(j => {
    const matchKelas = filterKelas.value === '' || String(j.id_kelas) === filterKelas.value
    const matchHari = filterHari.value === '' || j.hari === filterHari.value
    return matchKelas && matchHari
  })
})

function formatTime(tStr) {
  if (!tStr) return '-'
  return tStr.substring(0, 5)
}

async function loadData() {
  loading.value = true

  // Get active year
  const { data: ta } = await supabase.from('tahun_ajaran').select('*').eq('status_aktif', 1).single()
  taAktif.value = ta

  if (ta) {
    // Load jadwal
    const { data: jData } = await supabase
      .from('jadwal')
      .select('*, kelas(nama_kelas), mata_pelajaran(nama_mapel), guru(nama_guru)')
      .eq('id_tahun_ajaran', ta.id_tahun_ajaran)
      .order('hari')
      .order('jam_mulai')
    jadwals.value = jData || []
  }

  // Load kelases for dropdown
  const { data: kData } = await supabase.from('kelas').select('id_kelas, nama_kelas').order('nama_kelas')
  kelases.value = kData || []

  loading.value = false
}

function confirmDelete(j) {
  deleteModal.value = { show: true, j, loading: false }
}

async function doDelete() {
  deleteModal.value.loading = true
  const { error } = await supabase.from('jadwal').delete().eq('id_jadwal', deleteModal.value.j.id_jadwal)
  if (!error) {
    jadwals.value = jadwals.value.filter(item => item.id_jadwal !== deleteModal.value.j.id_jadwal)
    showAlert('success', 'Jadwal berhasil dihapus.')
  } else {
    showAlert('danger', 'Gagal menghapus jadwal.')
  }
  deleteModal.value = { show: false, j: null, loading: false }
}

function showAlert(type, msg) {
  alert.value = { show: true, type, msg }
  setTimeout(() => { alert.value.show = false }, 3500)
}

onMounted(loadData)
</script>
