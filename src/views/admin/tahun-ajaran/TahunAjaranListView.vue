<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="page-title">Tahun Ajaran</h1>
        <p class="page-subtitle">Kelola tahun ajaran dan semester aktif</p>
      </div>
      <router-link to="/admin/tahun-ajaran/tambah" class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
        Tambah Tahun Ajaran
      </router-link>
    </div>

    <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {{ alert.msg }}
    </div>

    <div class="card">
      <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
      <div v-else-if="tahunAjarans.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h3>Belum ada data tahun ajaran</h3>
        <p>Tambah tahun ajaran baru untuk memulai</p>
      </div>
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tahun Ajaran</th>
              <th>Semester</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ta, i) in tahunAjarans" :key="ta.id_tahun_ajaran">
              <td>{{ i + 1 }}</td>
              <td><span class="font-semibold">{{ ta.tahun_ajaran }}</span></td>
              <td>{{ ta.semester }}</td>
              <td>
                <span :class="ta.status_aktif ? 'badge badge-success' : 'badge badge-muted'">
                  {{ ta.status_aktif ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button v-if="!ta.status_aktif" class="btn btn-sm btn-success" @click="aktifkan(ta.id_tahun_ajaran)" title="Aktifkan">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Aktifkan
                  </button>
                  <router-link :to="`/admin/tahun-ajaran/edit/${ta.id_tahun_ajaran}`" class="btn btn-sm btn-warning" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </router-link>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(ta)" title="Hapus">
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
            Hapus tahun ajaran <strong>{{ deleteModal.ta?.tahun_ajaran }} - {{ deleteModal.ta?.semester }}</strong>? Seluruh jadwal pelajaran pada tahun ajaran ini akan ikut terhapus.
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
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const tahunAjarans = ref([])
const loading = ref(true)
const alert = ref({ show: false, type: 'success', msg: '' })
const deleteModal = ref({ show: false, ta: null, loading: false })

async function loadData() {
  loading.value = true
  const { data } = await supabase.from('tahun_ajaran').select('*').order('tahun_ajaran', { ascending: false }).order('semester')
  tahunAjarans.value = data || []
  loading.value = false
}

async function aktifkan(id) {
  loading.value = true
  try {
    // Set all to inactive first
    await supabase.from('tahun_ajaran').update({ status_aktif: 0 }).neq('id_tahun_ajaran', id)
    // Set selected to active
    const { error } = await supabase.from('tahun_ajaran').update({ status_aktif: 1 }).eq('id_tahun_ajaran', id)
    if (error) throw error
    showAlert('success', 'Tahun ajaran berhasil diaktifkan.')
    await loadData()
  } catch (e) {
    showAlert('danger', 'Gagal mengaktifkan tahun ajaran.')
    loading.value = false
  }
}

function confirmDelete(ta) {
  deleteModal.value = { show: true, ta, loading: false }
}

async function doDelete() {
  deleteModal.value.loading = true
  const { error } = await supabase.from('tahun_ajaran').delete().eq('id_tahun_ajaran', deleteModal.value.ta.id_tahun_ajaran)
  if (!error) {
    tahunAjarans.value = tahunAjarans.value.filter(t => t.id_tahun_ajaran !== deleteModal.value.ta.id_tahun_ajaran)
    showAlert('success', 'Tahun ajaran berhasil dihapus.')
  } else {
    showAlert('danger', 'Gagal menghapus tahun ajaran.')
  }
  deleteModal.value = { show: false, ta: null, loading: false }
}

function showAlert(type, msg) {
  alert.value = { show: true, type, msg }
  setTimeout(() => { alert.value.show = false }, 3500)
}

onMounted(loadData)
</script>
