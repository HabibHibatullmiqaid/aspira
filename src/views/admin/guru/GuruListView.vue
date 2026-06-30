<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">Manajemen Guru</h1>
        <p class="page-subtitle">Kelola data guru pengajar</p>
      </div>
      <router-link to="/admin/guru/tambah" class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Tambah Guru
      </router-link>
    </div>

    <!-- Alert -->
    <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {{ alert.msg }}
    </div>

    <div class="card">
      <!-- Filter -->
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input v-model="search" type="text" class="form-control" placeholder="Cari nama atau NIP..." />
        </div>
        <select v-model="filterStatus" class="form-control" style="max-width:160px">
          <option value="">Semua Status</option>
          <option value="1">Aktif</option>
          <option value="0">Non-Aktif</option>
        </select>
      </div>

      <!-- Table -->
      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        <h3>Belum ada data guru</h3>
        <p>Tambah guru baru untuk memulai</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>NIP</th>
              <th>Nama Guru</th>
              <th>JK</th>
              <th>Nomor HP</th>
              <th>Email</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(guru, i) in paginated" :key="guru.id_guru">
              <td>{{ (page - 1) * perPage + i + 1 }}</td>
              <td class="text-muted">{{ guru.nip || '-' }}</td>
              <td><span class="font-semibold">{{ guru.nama_guru }}</span></td>
              <td>{{ guru.jenis_kelamin }}</td>
              <td>{{ guru.nomor_hp || '-' }}</td>
              <td>{{ guru.email || '-' }}</td>
              <td>
                <span :class="guru.status_aktif ? 'badge badge-success' : 'badge badge-danger'">
                  {{ guru.status_aktif ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <router-link :to="`/admin/guru/detail/${guru.id_guru}`" class="btn btn-sm btn-secondary" title="Detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </router-link>
                  <router-link :to="`/admin/guru/edit/${guru.id_guru}`" class="btn btn-sm btn-warning" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </router-link>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(guru)" title="Hapus">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="page === 1" @click="page--">‹</button>
        <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: page === p }" @click="page = p">{{ p }}</button>
        <button class="page-btn" :disabled="page === totalPages" @click="page++">›</button>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
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
            Yakin hapus guru <strong>{{ deleteModal.guru?.nama_guru }}</strong>? Tindakan ini tidak bisa dibatalkan.
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

const gurus = ref([])
const loading = ref(true)
const search = ref('')
const filterStatus = ref('')
const page = ref(1)
const perPage = 10
const alert = ref({ show: false, type: 'success', msg: '' })
const deleteModal = ref({ show: false, guru: null, loading: false })

const filtered = computed(() => {
  return gurus.value.filter(g => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || g.nama_guru?.toLowerCase().includes(q) || g.nip?.includes(q)
    const matchStatus = filterStatus.value === '' || String(g.status_aktif) === filterStatus.value
    return matchSearch && matchStatus
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))
const paginated = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

async function loadData() {
  loading.value = true
  const { data } = await supabase.from('guru').select('*').order('nama_guru')
  gurus.value = data || []
  loading.value = false
}

function confirmDelete(guru) {
  deleteModal.value = { show: true, guru, loading: false }
}

async function doDelete() {
  deleteModal.value.loading = true
  const { error } = await supabase.from('guru').delete().eq('id_guru', deleteModal.value.guru.id_guru)
  if (!error) {
    gurus.value = gurus.value.filter(g => g.id_guru !== deleteModal.value.guru.id_guru)
    showAlert('success', `Guru ${deleteModal.value.guru.nama_guru} berhasil dihapus.`)
  } else {
    showAlert('danger', 'Gagal menghapus guru. Mungkin ada data terkait.')
  }
  deleteModal.value = { show: false, guru: null, loading: false }
}

function showAlert(type, msg) {
  alert.value = { show: true, type, msg }
  setTimeout(() => { alert.value.show = false }, 3500)
}

onMounted(loadData)
</script>
