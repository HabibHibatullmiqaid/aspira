<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">Manajemen Siswa</h1>
        <p class="page-subtitle">Kelola data siswa terdaftar</p>
      </div>
      <router-link to="/admin/siswa/tambah" class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Tambah Siswa
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
          <input v-model="search" type="text" class="form-control" placeholder="Cari nama atau NIS siswa..." />
        </div>
        <select v-model="filterKelas" class="form-control" style="max-width:180px">
          <option value="">Semua Kelas</option>
          <option v-for="k in kelases" :key="k.id_kelas" :value="k.id_kelas">{{ k.nama_kelas }}</option>
        </select>
        <select v-model="filterStatus" class="form-control" style="max-width:140px">
          <option value="">Semua Status</option>
          <option value="1">Aktif</option>
          <option value="0">Non-Aktif</option>
        </select>
      </div>

      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
        <h3>Belum ada data siswa</h3>
        <p>Tambah siswa baru untuk memulai</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>NIS</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>JK</th>
              <th>Nomor HP</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(siswa, i) in paginated" :key="siswa.id_siswa">
              <td>{{ (page - 1) * perPage + i + 1 }}</td>
              <td class="text-muted">{{ siswa.nis }}</td>
              <td><span class="font-semibold">{{ siswa.nama_siswa }}</span></td>
              <td><span class="badge badge-primary">{{ siswa.kelas?.nama_kelas || '-' }}</span></td>
              <td>{{ siswa.jenis_kelamin }}</td>
              <td>{{ siswa.nomor_hp || '-' }}</td>
              <td>
                <span :class="siswa.status_aktif ? 'badge badge-success' : 'badge badge-danger'">
                  {{ siswa.status_aktif ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <router-link :to="`/admin/siswa/detail/${siswa.id_siswa}`" class="btn btn-sm btn-secondary" title="Detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </router-link>
                  <router-link :to="`/admin/siswa/edit/${siswa.id_siswa}`" class="btn btn-sm btn-warning" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </router-link>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(siswa)" title="Hapus">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Hapus siswa <strong>{{ deleteModal.siswa?.nama_siswa }}</strong>? Semua data absensi siswa ini juga akan terhapus.
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

const siswas = ref([])
const kelases = ref([])
const loading = ref(true)
const search = ref('')
const filterKelas = ref('')
const filterStatus = ref('')
const page = ref(1)
const perPage = 10
const alert = ref({ show: false, type: 'success', msg: '' })
const deleteModal = ref({ show: false, siswa: null, loading: false })

const filtered = computed(() => {
  return siswas.value.filter(s => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || s.nama_siswa?.toLowerCase().includes(q) || s.nis?.includes(q)
    const matchKelas = filterKelas.value === '' || String(s.id_kelas) === filterKelas.value
    const matchStatus = filterStatus.value === '' || String(s.status_aktif) === filterStatus.value
    return matchSearch && matchKelas && matchStatus
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))
const paginated = computed(() => filtered.value.slice((page.value - 1) * perPage, page.value * perPage))

async function loadData() {
  loading.value = true
  const [{ data: sData }, { data: kData }] = await Promise.all([
    supabase.from('siswa').select('*, kelas(nama_kelas)').order('nama_siswa'),
    supabase.from('kelas').select('id_kelas, nama_kelas').order('nama_kelas')
  ])
  siswas.value = sData || []
  kelases.value = kData || []
  loading.value = false
}

function confirmDelete(siswa) {
  deleteModal.value = { show: true, siswa, loading: false }
}

async function doDelete() {
  deleteModal.value.loading = true
  const { error } = await supabase.from('siswa').delete().eq('id_siswa', deleteModal.value.siswa.id_siswa)
  if (!error) {
    siswas.value = siswas.value.filter(s => s.id_siswa !== deleteModal.value.siswa.id_siswa)
    showAlert('success', `Siswa ${deleteModal.value.siswa.nama_siswa} berhasil dihapus.`)
  } else {
    showAlert('danger', 'Gagal menghapus siswa.')
  }
  deleteModal.value = { show: false, siswa: null, loading: false }
}

function showAlert(type, msg) {
  alert.value = { show: true, type, msg }
  setTimeout(() => { alert.value.show = false }, 3500)
}

onMounted(loadData)
</script>
