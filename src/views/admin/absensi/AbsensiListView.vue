<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">Data Absensi</h1>
        <p class="page-subtitle">Aktivitas rekam kehadiran harian</p>
      </div>
      <router-link to="/admin/absensi/rekap" class="btn btn-secondary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        Rekap Kehadiran
      </router-link>
    </div>

    <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {{ alert.msg }}
    </div>

    <div class="card">
      <div class="filter-bar">
        <div class="form-group" style="margin-bottom:0">
          <input v-model="filterTanggal" type="date" class="form-control" style="max-width:160px" />
        </div>
        <select v-model="filterKelas" class="form-control" style="max-width:160px">
          <option value="">Semua Kelas</option>
          <option v-for="k in kelases" :key="k.id_kelas" :value="k.id_kelas">{{ k.nama_kelas }}</option>
        </select>
        <select v-model="filterStatus" class="form-control" style="max-width:140px">
          <option value="">Semua Status</option>
          <option v-for="s in ['Hadir', 'Sakit', 'Izin', 'Alfa', 'Terlambat']" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="filtered.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        <h3>Tidak ada record absensi</h3>
        <p>Tidak ada data absensi yang sesuai filter</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tanggal</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>Mata Pelajaran</th>
              <th>Status</th>
              <th>Keterangan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, i) in paginated" :key="a.id_absensi">
              <td>{{ (page - 1) * perPage + i + 1 }}</td>
              <td><span class="font-semibold">{{ formatDate(a.tanggal) }}</span></td>
              <td><span class="font-medium">{{ a.siswa?.nama_siswa }}</span></td>
              <td><span class="badge badge-primary">{{ a.jadwal?.kelas?.nama_kelas }}</span></td>
              <td>{{ a.jadwal?.mata_pelajaran?.nama_mapel }}</td>
              <td>
                <span :class="badgeClass(a.status)">{{ a.status }}</span>
              </td>
              <td class="text-muted">{{ a.keterangan || '-' }}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-sm btn-warning" @click="openEdit(a)" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(a)" title="Hapus">
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

    <!-- Edit Modal -->
    <div v-if="editModal.show" class="modal-backdrop" @click.self="editModal.show = false">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">Edit Status Kehadiran</span>
          <button class="modal-close" @click="editModal.show = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form @submit.prevent="saveEdit">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Siswa</label>
              <p class="font-semibold">{{ editModal.siswaNama }}</p>
            </div>
            <div class="form-group">
              <label class="form-label">Mata Pelajaran</label>
              <p class="text-muted">{{ editModal.mapelNama }}</p>
            </div>
            <div class="form-group">
              <label class="form-label">Status <span class="required">*</span></label>
              <select v-model="editModal.form.status" class="form-control" required>
                <option v-for="s in ['Hadir', 'Sakit', 'Izin', 'Alfa', 'Terlambat']" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:0">
              <label class="form-label">Keterangan</label>
              <textarea v-model="editModal.form.keterangan" class="form-control" rows="2" placeholder="Catatan opsional..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="editModal.show = false">Batal</button>
            <button type="submit" class="btn btn-primary" :disabled="editModal.saving">
              <span v-if="editModal.saving" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
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
            Hapus record absensi <strong>{{ deleteModal.a?.siswa?.nama_siswa }}</strong> pada tanggal <strong>{{ formatDate(deleteModal.a?.tanggal) }}</strong>?
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

const absensi = ref([])
const kelases = ref([])
const loading = ref(true)
const filterTanggal = ref('')
const filterKelas = ref('')
const filterStatus = ref('')
const page = ref(1)
const perPage = 15
const alert = ref({ show: false, type: 'success', msg: '' })
const editModal = ref({ show: false, saving: false, id_absensi: null, siswaNama: '', mapelNama: '', form: { status: 'Hadir', keterangan: '' } })
const deleteModal = ref({ show: false, a: null, loading: false })

const filtered = computed(() => {
  return absensi.value.filter(a => {
    const matchTanggal = filterTanggal.value === '' || a.tanggal === filterTanggal.value
    const matchKelas = filterKelas.value === '' || String(a.jadwal?.id_kelas) === filterKelas.value
    const matchStatus = filterStatus.value === '' || a.status === filterStatus.value
    return matchTanggal && matchKelas && matchStatus
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
  const [{ data: aData }, { data: kData }] = await Promise.all([
    supabase
      .from('absensi')
      .select('*, siswa(nama_siswa), jadwal(id_kelas, kelas(nama_kelas), mata_pelajaran(nama_mapel))')
      .order('tanggal', { ascending: false }),
    supabase.from('kelas').select('id_kelas, nama_kelas').order('nama_kelas')
  ])
  absensi.value = aData || []
  kelases.value = kData || []
  loading.value = false
}

function openEdit(a) {
  editModal.value = {
    show: true,
    saving: false,
    id_absensi: a.id_absensi,
    siswaNama: a.siswa?.nama_siswa,
    mapelNama: a.jadwal?.mata_pelajaran?.nama_mapel,
    form: {
      status: a.status,
      keterangan: a.keterangan || ''
    }
  }
}

async function saveEdit() {
  editModal.value.saving = true
  const { error } = await supabase
    .from('absensi')
    .update({
      status: editModal.value.form.status,
      keterangan: editModal.value.form.keterangan,
      updated_at: new Date().toISOString()
    })
    .eq('id_absensi', editModal.value.id_absensi)

  if (!error) {
    showAlert('success', 'Status absensi berhasil diperbarui.')
    await loadData()
  } else {
    showAlert('danger', 'Gagal memperbarui status absensi.')
  }
  editModal.value.show = false
}

function confirmDelete(a) {
  deleteModal.value = { show: true, a, loading: false }
}

async function doDelete() {
  deleteModal.value.loading = true
  const { error } = await supabase.from('absensi').delete().eq('id_absensi', deleteModal.value.a.id_absensi)
  if (!error) {
    absensi.value = absensi.value.filter(item => item.id_absensi !== deleteModal.value.a.id_absensi)
    showAlert('success', 'Record absensi berhasil dihapus.')
  } else {
    showAlert('danger', 'Gagal menghapus record absensi.')
  }
  deleteModal.value = { show: false, a: null, loading: false }
}

function showAlert(type, msg) {
  alert.value = { show: true, type, msg }
  setTimeout(() => { alert.value.show = false }, 3500)
}

onMounted(loadData)
</script>
