<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/siswa" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">{{ isEdit ? 'Edit Siswa' : 'Tambah Siswa' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Perbarui data siswa' : 'Isi data siswa baru' }}</p>
      </div>
    </div>

    <div class="card">
      <div v-if="loadingData" class="loading-overlay"><div class="spinner"></div></div>
      <form v-else @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">NIS <span class="required">*</span></label>
            <input v-model="form.nis" type="text" class="form-control" placeholder="Nomor Induk Siswa" required />
          </div>
          <div class="form-group">
            <label class="form-label">Nama Lengkap <span class="required">*</span></label>
            <input v-model="form.nama_siswa" type="text" class="form-control" placeholder="Nama lengkap siswa" required />
          </div>
          <div class="form-group">
            <label class="form-label">Kelas <span class="required">*</span></label>
            <select v-model="form.id_kelas" class="form-control" required>
              <option value="">Pilih kelas</option>
              <option v-for="k in kelases" :key="k.id_kelas" :value="k.id_kelas">{{ k.nama_kelas }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Jenis Kelamin <span class="required">*</span></label>
            <select v-model="form.jenis_kelamin" class="form-control" required>
              <option value="">Pilih jenis kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tempat Lahir</label>
            <input v-model="form.tempat_lahir" type="text" class="form-control" placeholder="Kota kelahiran" />
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal Lahir</label>
            <input v-model="form.tanggal_lahir" type="date" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label">Nomor HP Wali</label>
            <input v-model="form.nomor_hp" type="tel" class="form-control" placeholder="08xxxxxxxxxx" />
          </div>
          <div class="form-group">
            <label class="form-label">Status Aktif</label>
            <select v-model="form.status_aktif" class="form-control">
              <option :value="1">Aktif</option>
              <option :value="0">Non-Aktif</option>
            </select>
          </div>
          <div class="form-group form-full">
            <label class="form-label">Alamat Lengkap</label>
            <textarea v-model="form.alamat" class="form-control" placeholder="Alamat lengkap siswa" rows="3"></textarea>
          </div>
        </div>

        <div v-if="errorMsg" class="alert alert-danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {{ errorMsg }}
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <router-link to="/admin/siswa" class="btn btn-secondary">Batal</router-link>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
            <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Tambah Siswa' }}</span>
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
const kelases = ref([])

const form = ref({ nis: '', nama_siswa: '', id_kelas: '', jenis_kelamin: '', tempat_lahir: '', tanggal_lahir: '', alamat: '', nomor_hp: '', status_aktif: 1 })

async function loadData() {
  loadingData.value = true
  const { data: kData } = await supabase.from('kelas').select('id_kelas, nama_kelas').order('nama_kelas')
  kelases.value = kData || []

  if (isEdit.value) {
    const { data: sData } = await supabase.from('siswa').select('*').eq('id_siswa', route.params.id).single()
    if (sData) Object.assign(form.value, sData)
  }
  loadingData.value = false
}

async function handleSubmit() {
  saving.value = true
  errorMsg.value = ''
  const payload = { ...form.value }

  try {
    if (isEdit.value) {
      const { error } = await supabase.from('siswa').update(payload).eq('id_siswa', route.params.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('siswa').insert([payload])
      if (error) throw error
    }
    router.push('/admin/siswa')
  } catch (e) {
    errorMsg.value = e.message || 'Terjadi kesalahan saat menyimpan.'
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
