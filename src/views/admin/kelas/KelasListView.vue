<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">Manajemen Kelas</h1>
        <p class="page-subtitle">Daftar kelas dan wali kelas masing-masing</p>
      </div>
      <router-link to="/admin/kelas/tambah" class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Tambah Kelas
      </router-link>
    </div>

    <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {{ alert.msg }}
    </div>

    <div class="card">
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input v-model="search" type="text" class="form-control" placeholder="Cari nama kelas atau jurusan..." />
        </div>
        <select v-model="filterTingkat" class="form-control" style="max-width:160px">
          <option value="">Semua Tingkat</option>
          <option value="X">Tingkat X</option>
          <option value="XI">Tingkat XI</option>
          <option value="XII">Tingkat XII</option>
        </select>
      </div>

      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        <h3>Belum ada data kelas</h3>
        <p>Tambah kelas baru untuk memulai</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Kelas</th>
              <th>Tingkat</th>
              <th>Jurusan</th>
              <th>Wali Kelas</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(kelas, i) in filtered" :key="kelas.id_kelas">
              <td>{{ i + 1 }}</td>
              <td><span class="font-semibold">{{ kelas.nama_kelas }}</span></td>
              <td><span class="badge badge-primary">{{ kelas.tingkat }}</span></td>
              <td>{{ kelas.jurusan }}</td>
              <td>
                <span class="font-medium text-primary-light" v-if="kelas.guru">{{ kelas.guru.nama_guru }}</span>
                <span class="text-muted text-small" v-else>Belum ditentukan</span>
              </td>
              <td>
                <div class="table-actions">
                  <router-link :to="`/admin/kelas/edit/${kelas.id_kelas}`" class="btn btn-sm btn-warning" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </router-link>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(kelas)" title="Hapus">
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
            Hapus kelas <strong>{{ deleteModal.kelas?.nama_kelas }}</strong>? Ini akan merusak relasi data siswa dan jadwal terkait.
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

const kelases = ref([])
const loading = ref(true)
const search = ref('')
const filterTingkat = ref('')
const alert = ref({ show: false, type: 'success', msg: '' })
const deleteModal = ref({ show: false, kelas: null, loading: false })

const filtered = computed(() => {
  return kelases.value.filter(k => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || k.nama_kelas?.toLowerCase().includes(q) || k.jurusan?.toLowerCase().includes(q)
    const matchTingkat = filterTingkat.value === '' || k.tingkat === filterTingkat.value
    return matchSearch && matchTingkat
  })
})

async function loadData() {
  loading.value = true
  const { data } = await supabase.from('kelas').select('*, guru(nama_guru)').order('nama_kelas')
  kelases.value = data || []
  loading.value = false
}

function confirmDelete(kelas) {
  deleteModal.value = { show: true, kelas, loading: false }
}

async function doDelete() {
  deleteModal.value.loading = true
  const { error } = await supabase.from('kelas').delete().eq('id_kelas', deleteModal.value.kelas.id_kelas)
  if (!error) {
    kelases.value = kelases.value.filter(k => k.id_kelas !== deleteModal.value.kelas.id_kelas)
    showAlert('success', `Kelas ${deleteModal.value.kelas.nama_kelas} berhasil dihapus.`)
  } else {
    showAlert('danger', 'Gagal menghapus kelas.')
  }
  deleteModal.value = { show: false, kelas: null, loading: false }
}

function showAlert(type, msg) {
  alert.value = { show: true, type, msg }
  setTimeout(() => { alert.value.show = false }, 3500)
}

onMounted(loadData)
</script>
