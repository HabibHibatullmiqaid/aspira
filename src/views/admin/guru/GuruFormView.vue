<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/guru" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">{{ isEdit ? 'Edit Guru' : 'Tambah Guru' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Perbarui data guru' : 'Isi data guru baru' }}</p>
      </div>
    </div>

    <div class="card">
      <div v-if="loadingData" class="loading-overlay"><div class="spinner"></div></div>
      <form v-else @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">NIP <span style="color:var(--text-muted);font-weight:400">(opsional)</span></label>
            <input v-model="form.nip" type="text" class="form-control" placeholder="Nomor Induk Pegawai" />
          </div>
          <div class="form-group">
            <label class="form-label">Nama Lengkap <span class="required">*</span></label>
            <input v-model="form.nama_guru" type="text" class="form-control" placeholder="Nama lengkap guru" required />
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
            <label class="form-label">Nomor HP</label>
            <input v-model="form.nomor_hp" type="tel" class="form-control" placeholder="08xxxxxxxxxx" />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" placeholder="email@sekolah.sch.id" />
          </div>
          <div class="form-group">
            <label class="form-label">Status Aktif</label>
            <select v-model="form.status_aktif" class="form-control">
              <option :value="1">Aktif</option>
              <option :value="0">Non-Aktif</option>
            </select>
          </div>
          <div class="form-group form-full">
            <label class="form-label">Alamat</label>
            <textarea v-model="form.alamat" class="form-control" placeholder="Alamat lengkap" rows="3"></textarea>
          </div>
        </div>

        <div v-if="errorMsg" class="alert alert-danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {{ errorMsg }}
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <router-link to="/admin/guru" class="btn btn-secondary">Batal</router-link>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
            <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Tambah Guru' }}</span>
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

const form = ref({ nip: '', nama_guru: '', jenis_kelamin: '', tempat_lahir: '', tanggal_lahir: '', alamat: '', nomor_hp: '', email: '', status_aktif: 1 })

async function loadData() {
  if (!isEdit.value) return
  loadingData.value = true
  const { data } = await supabase.from('guru').select('*').eq('id_guru', route.params.id).single()
  if (data) Object.assign(form.value, data)
  loadingData.value = false
}

async function handleSubmit() {
  saving.value = true
  errorMsg.value = ''
  const payload = { ...form.value }

  try {
    if (isEdit.value) {
      const { error } = await supabase.from('guru').update(payload).eq('id_guru', route.params.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('guru').insert([payload])
      if (error) throw error
    }
    router.push('/admin/guru')
  } catch (e) {
    errorMsg.value = e.message || 'Terjadi kesalahan saat menyimpan.'
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
