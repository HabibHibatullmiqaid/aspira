<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/kelas" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">{{ isEdit ? 'Edit Kelas' : 'Tambah Kelas' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Perbarui data kelas' : 'Isi data kelas baru' }}</p>
      </div>
    </div>

    <div class="card">
      <div v-if="loadingData" class="loading-overlay"><div class="spinner"></div></div>
      <form v-else @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nama Kelas <span class="required">*</span></label>
            <input v-model="form.nama_kelas" type="text" class="form-control" placeholder="Contoh: X RPL 1" required />
          </div>
          <div class="form-group">
            <label class="form-label">Tingkat <span class="required">*</span></label>
            <select v-model="form.tingkat" class="form-control" required>
              <option value="">Pilih tingkat</option>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Jurusan <span class="required">*</span></label>
            <input v-model="form.jurusan" type="text" class="form-control" placeholder="Contoh: Rekayasa Perangkat Lunak" required />
          </div>
          <div class="form-group">
            <label class="form-label">Wali Kelas</label>
            <select v-model="form.wali_kelas" class="form-control">
              <option :value="null">Belum ditentukan</option>
              <option v-for="g in gurus" :key="g.id_guru" :value="g.id_guru">{{ g.nama_guru }}</option>
            </select>
          </div>
        </div>

        <div v-if="errorMsg" class="alert alert-danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {{ errorMsg }}
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <router-link to="/admin/kelas" class="btn btn-secondary">Batal</router-link>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
            <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Tambah Kelas' }}</span>
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
const gurus = ref([])

const form = ref({ nama_kelas: '', tingkat: '', jurusan: '', wali_kelas: null })

async function loadData() {
  loadingData.value = true
  const { data: gData } = await supabase.from('guru').select('id_guru, nama_guru').eq('status_aktif', 1).order('nama_guru')
  gurus.value = gData || []

  if (isEdit.value) {
    const { data: kData } = await supabase.from('kelas').select('*').eq('id_kelas', route.params.id).single()
    if (kData) {
      Object.assign(form.value, kData)
    }
  }
  loadingData.value = false
}

async function handleSubmit() {
  saving.value = true
  errorMsg.value = ''
  const payload = { ...form.value }

  try {
    if (isEdit.value) {
      const { error } = await supabase.from('kelas').update(payload).eq('id_kelas', route.params.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('kelas').insert([payload])
      if (error) throw error
    }
    router.push('/admin/kelas')
  } catch (e) {
    errorMsg.value = e.message || 'Terjadi kesalahan saat menyimpan.'
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
