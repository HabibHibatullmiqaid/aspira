<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/users" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">{{ isEdit ? 'Edit User' : 'Tambah User' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Perbarui data login' : 'Buat data login baru' }}</p>
      </div>
    </div>

    <div class="card">
      <div v-if="loadingData" class="loading-overlay"><div class="spinner"></div></div>
      <form v-else @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Username <span class="required">*</span></label>
            <input v-model="form.username" type="text" class="form-control" placeholder="Masukkan username" required />
          </div>
          <div class="form-group">
            <label class="form-label">Role <span class="required">*</span></label>
            <select v-model="form.role" class="form-control" required @change="handleRoleChange" :disabled="isEdit">
              <option value="">Pilih role</option>
              <option value="admin">Admin</option>
              <option value="guru">Guru</option>
              <option value="siswa">Siswa</option>
            </select>
          </div>
          <div class="form-group" v-if="form.role === 'guru' || form.role === 'siswa'">
            <label class="form-label">Pemilik Akun (Referensi) <span class="required">*</span></label>
            <select v-model="form.reference_id" class="form-control" required>
              <option value="">Pilih orang</option>
              <option v-for="refItem in referenceList" :key="refItem.id" :value="refItem.id">
                {{ refItem.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Password <span v-if="!isEdit" class="required">*</span></label>
            <input v-model="form.password" type="password" class="form-control" :placeholder="isEdit ? 'Kosongkan jika tidak diubah' : 'Masukkan password'" :required="!isEdit" />
          </div>
        </div>

        <div v-if="errorMsg" class="alert alert-danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {{ errorMsg }}
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <router-link to="/admin/users" class="btn btn-secondary">Batal</router-link>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
            <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Tambah User' }}</span>
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
import bcrypt from 'bcryptjs'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const loadingData = ref(false)
const saving = ref(false)
const errorMsg = ref('')

const form = ref({ username: '', role: '', reference_id: null, password: '' })
const referenceList = ref([])

async function handleRoleChange() {
  form.value.reference_id = null
  referenceList.value = []

  if (form.value.role === 'guru') {
    const { data } = await supabase.from('guru').select('id_guru, nama_guru').eq('status_aktif', 1).order('nama_guru')
    referenceList.value = (data || []).map(g => ({ id: g.id_guru, name: g.nama_guru }))
  } else if (form.value.role === 'siswa') {
    const { data } = await supabase.from('siswa').select('id_siswa, nama_siswa').eq('status_aktif', 1).order('nama_siswa')
    referenceList.value = (data || []).map(s => ({ id: s.id_siswa, name: s.nama_siswa }))
  }
}

async function loadData() {
  loadingData.value = true
  if (isEdit.value) {
    const { data } = await supabase.from('users').select('*').eq('id', route.params.id).single()
    if (data) {
      form.value = {
        username: data.username,
        role: data.role,
        reference_id: data.reference_id,
        password: '' // Clear password field for security
      }
      await handleRoleChange()
      form.value.reference_id = data.reference_id
    }
  }
  loadingData.value = false
}

async function handleSubmit() {
  saving.value = true
  errorMsg.value = ''

  try {
    const payload = {
      username: form.value.username,
      role: form.value.role,
      reference_id: form.value.role === 'admin' ? null : form.value.reference_id,
      updated_at: new Date().toISOString()
    }

    if (form.value.password) {
      payload.password = bcrypt.hashSync(form.value.password, 10)
    }

    if (isEdit.value) {
      const { error } = await supabase.from('users').update(payload).eq('id', route.params.id)
      if (error) throw error
    } else {
      payload.created_at = new Date().toISOString()
      const { error } = await supabase.from('users').insert([payload])
      if (error) throw error
    }
    router.push('/admin/users')
  } catch (e) {
    errorMsg.value = e.message || 'Terjadi kesalahan saat menyimpan.'
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
