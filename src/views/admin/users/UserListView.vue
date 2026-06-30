<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">Manajemen Akun Login</h1>
        <p class="page-subtitle">Kelola kredensial login admin, guru, dan siswa</p>
      </div>
      <router-link to="/admin/users/tambah" class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Tambah User
      </router-link>
    </div>

    <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {{ alert.msg }}
    </div>

    <div class="card">
      <!-- Filter -->
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input v-model="search" type="text" class="form-control" placeholder="Cari username..." />
        </div>
        <select v-model="filterRole" class="form-control" style="max-width:160px">
          <option value="">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="guru">Guru</option>
          <option value="siswa">Siswa</option>
        </select>
      </div>

      <!-- Table -->
      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        <h3>Tidak ada data akun login</h3>
        <p>Tambah akun login baru untuk memulai</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Pemilik Akun</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, i) in paginated" :key="user.id">
              <td>{{ (page - 1) * perPage + i + 1 }}</td>
              <td><span class="font-semibold">{{ user.username }}</span></td>
              <td>
                <span :class="roleBadgeClass(user.role)">{{ user.role }}</span>
              </td>
              <td>
                <span v-if="user.role === 'admin'" class="font-semibold text-success">Super Admin</span>
                <span v-else>{{ user.ownerName || 'Memuat...' }}</span>
              </td>
              <td>
                <div class="table-actions">
                  <router-link :to="`/admin/users/edit/${user.id}`" class="btn btn-sm btn-warning" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </router-link>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(user)" title="Hapus" :disabled="user.username === 'admin'">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
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
            Hapus akun login <strong>{{ deleteModal.user?.username }}</strong>?
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

const users = ref([])
const loading = ref(true)
const search = ref('')
const filterRole = ref('')
const page = ref(1)
const perPage = 10
const alert = ref({ show: false, type: 'success', msg: '' })
const deleteModal = ref({ show: false, user: null, loading: false })

const filtered = computed(() => {
  return users.value.filter(u => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || u.username?.toLowerCase().includes(q)
    const matchRole = filterRole.value === '' || u.role === filterRole.value
    return matchSearch && matchRole
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))
const paginated = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

function roleBadgeClass(role) {
  return {
    'admin': 'badge badge-success',
    'guru': 'badge badge-primary',
    'siswa': 'badge badge-info'
  }[role] || 'badge'
}

async function loadData() {
  loading.value = true
  const { data, error } = await supabase.from('users').select('*').order('role').order('username')
  if (error) {
    loading.value = false
    return
  }

  // Load referenced owner names
  const gurus = await supabase.from('guru').select('id_guru, nama_guru')
  const siswas = await supabase.from('siswa').select('id_siswa, nama_siswa')

  const guruMap = new Map(gurus.data?.map(g => [g.id_guru, g.nama_guru]) || [])
  const siswaMap = new Map(siswas.data?.map(s => [s.id_siswa, s.nama_siswa]) || [])

  users.value = (data || []).map(u => {
    let ownerName = '-'
    if (u.role === 'guru' && u.reference_id) {
      ownerName = guruMap.get(u.reference_id) || 'Guru tidak terdaftar'
    } else if (u.role === 'siswa' && u.reference_id) {
      ownerName = siswaMap.get(u.reference_id) || 'Siswa tidak terdaftar'
    }
    return { ...u, ownerName }
  })

  loading.value = false
}

function confirmDelete(user) {
  deleteModal.value = { show: true, user, loading: false }
}

async function doDelete() {
  deleteModal.value.loading = true
  const { error } = await supabase.from('users').delete().eq('id', deleteModal.value.user.id)
  if (!error) {
    users.value = users.value.filter(u => u.id !== deleteModal.value.user.id)
    showAlert('success', 'Akun login berhasil dihapus.')
  } else {
    showAlert('danger', 'Gagal menghapus akun.')
  }
  deleteModal.value = { show: false, user: null, loading: false }
}

function showAlert(type, msg) {
  alert.value = { show: true, type, msg }
  setTimeout(() => { alert.value.show = false }, 3500)
}

onMounted(loadData)
</script>
