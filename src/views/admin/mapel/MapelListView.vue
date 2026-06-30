<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">Mata Pelajaran</h1>
        <p class="page-subtitle">Kelola daftar mata pelajaran sekolah</p>
      </div>
      <router-link to="/admin/mapel/tambah" class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Tambah Mapel
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
          <input v-model="search" type="text" class="form-control" placeholder="Cari nama mapel atau kode..." />
        </div>
      </div>

      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        <h3>Belum ada mata pelajaran</h3>
        <p>Tambah mata pelajaran baru untuk memulai</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kode Mapel</th>
              <th>Nama Mata Pelajaran</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mapel, i) in filtered" :key="mapel.id_mapel">
              <td>{{ i + 1 }}</td>
              <td><span class="badge badge-primary">{{ mapel.kode_mapel }}</span></td>
              <td><span class="font-semibold">{{ mapel.nama_mapel }}</span></td>
              <td class="text-muted">{{ mapel.deskripsi || '-' }}</td>
              <td>
                <div class="table-actions">
                  <router-link :to="`/admin/mapel/edit/${mapel.id_mapel}`" class="btn btn-sm btn-warning" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </router-link>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(mapel)" title="Hapus">
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
            Hapus mata pelajaran <strong>{{ deleteModal.mapel?.nama_mapel }}</strong>? Seluruh jadwal yang menggunakan mapel ini juga akan terhapus.
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

const mapels = ref([])
const loading = ref(true)
const search = ref('')
const alert = ref({ show: false, type: 'success', msg: '' })
const deleteModal = ref({ show: false, mapel: null, loading: false })

const filtered = computed(() => {
  return mapels.value.filter(m => {
    const q = search.value.toLowerCase()
    return !q || m.nama_mapel?.toLowerCase().includes(q) || m.kode_mapel?.toLowerCase().includes(q)
  })
})

async function loadData() {
  loading.value = true
  const { data } = await supabase.from('mata_pelajaran').select('*').order('nama_mapel')
  mapels.value = data || []
  loading.value = false
}

function confirmDelete(mapel) {
  deleteModal.value = { show: true, mapel, loading: false }
}

async function doDelete() {
  deleteModal.value.loading = true
  const { error } = await supabase.from('mata_pelajaran').delete().eq('id_mapel', deleteModal.value.mapel.id_mapel)
  if (!error) {
    mapels.value = mapels.value.filter(m => m.id_mapel !== deleteModal.value.mapel.id_mapel)
    showAlert('success', `Mata pelajaran ${deleteModal.value.mapel.nama_mapel} berhasil dihapus.`)
  } else {
    showAlert('danger', 'Gagal menghapus mata pelajaran.')
  }
  deleteModal.value = { show: false, mapel: null, loading: false }
}

function showAlert(type, msg) {
  alert.value = { show: true, type, msg }
  setTimeout(() => { alert.value.show = false }, 3500)
}

onMounted(loadData)
</script>
