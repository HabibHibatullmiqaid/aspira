<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/mapel" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">{{ isEdit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Perbarui data mata pelajaran' : 'Isi data mata pelajaran baru' }}</p>
      </div>
    </div>

    <div class="card">
      <div v-if="loadingData" class="loading-overlay"><div class="spinner"></div></div>
      <form v-else @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Kode Mapel <span class="required">*</span></label>
            <input v-model="form.kode_mapel" type="text" class="form-control" placeholder="Contoh: MTK" required />
          </div>
          <div class="form-group">
            <label class="form-label">Nama Mata Pelajaran <span class="required">*</span></label>
            <input v-model="form.nama_mapel" type="text" class="form-control" placeholder="Contoh: Matematika" required />
          </div>
          <div class="form-group form-full">
            <label class="form-label">Deskripsi</label>
            <textarea v-model="form.deskripsi" class="form-control" placeholder="Keterangan singkat tentang mapel..." rows="3"></textarea>
          </div>
        </div>

        <div v-if="errorMsg" class="alert alert-danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {{ errorMsg }}
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <router-link to="/admin/mapel" class="btn btn-secondary">Batal</router-link>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
            <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Tambah Mapel' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const loadingData = ref(false)
const saving = ref(false)
const errorMsg = ref('')

const form = ref({ kode_mapel: '', nama_mapel: '', deskripsi: '' })

async function loadData() {
  if (!isEdit.value) return
  loadingData.value = true
  const { data } = await supabase.from('mata_pelajaran').select('*').eq('id_mapel', route.params.id).single()
  if (data) Object.assign(form.value, data)
  loadingData.value = false
}

async function handleSubmit() {
  saving.value = true
  errorMsg.value = ''
  const payload = { ...form.value }

  try {
    if (isEdit.value) {
      const { error } = await supabase.from('mata_pelajaran').update(payload).eq('id_mapel', route.params.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('mata_pelajaran').insert([payload])
      if (error) throw error
    }
    router.push('/admin/mapel')
  } catch (e) {
    errorMsg.value = e.message || 'Terjadi kesalahan saat menyimpan.'
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
