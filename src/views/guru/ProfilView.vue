<template>
  <div>
    <h1 class="page-title">Profil Saya</h1>
    <p class="page-subtitle">Kelola informasi data diri dan keamanan akun Anda</p>

    <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {{ alert.msg }}
    </div>

    <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
    <div v-else class="grid-3">
      <!-- Profile Card -->
      <div class="card flex flex-col items-center text-center">
        <div class="profile-avatar mb-4">
          <span>{{ form.nama_guru?.charAt(0).toUpperCase() }}</span>
        </div>
        <h2 class="font-bold" style="font-size:16px">{{ form.nama_guru }}</h2>
        <p class="text-muted text-small mb-3">NIP: {{ form.nip || '-' }}</p>
        <span class="badge badge-primary">Guru Pengajar</span>
      </div>

      <!-- Settings Forms -->
      <div class="card" style="grid-column: span 2">
        <h3 class="section-title">Data Diri</h3>
        <form @submit.prevent="updateProfile" class="mb-6">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <input v-model="form.nama_guru" type="text" class="form-control" disabled />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label">Nomor HP</label>
              <input v-model="form.nomor_hp" type="tel" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label">Tempat Lahir</label>
              <input v-model="form.tempat_lahir" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Tanggal Lahir</label>
              <input v-model="form.tanggal_lahir" type="date" class="form-control" />
            </div>
            <div class="form-group form-full">
              <label class="form-label">Alamat Lengkap</label>
              <textarea v-model="form.alamat" class="form-control" rows="2"></textarea>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary" :disabled="savingProfile">
              <span v-if="savingProfile" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
              <span v-else>Simpan Perubahan</span>
            </button>
          </div>
        </form>

        <div class="divider"></div>

        <h3 class="section-title">Keamanan (Ganti Password)</h3>
        <form @submit.prevent="updatePassword">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Password Baru <span class="required">*</span></label>
              <input v-model="passForm.newPassword" type="password" class="form-control" required minlength="6" />
            </div>
            <div class="form-group">
              <label class="form-label">Konfirmasi Password Baru <span class="required">*</span></label>
              <input v-model="passForm.confirmPassword" type="password" class="form-control" required minlength="6" />
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="btn btn-warning" :disabled="savingPassword">
              <span v-if="savingPassword" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
              <span v-else>Ganti Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/supabase'
import bcrypt from 'bcryptjs'

const auth = useAuthStore()
const loading = ref(true)
const savingProfile = ref(false)
const savingPassword = ref(false)
const alert = ref({ show: false, type: 'success', msg: '' })

const form = ref({ nama_guru: '', nip: '', email: '', nomor_hp: '', tempat_lahir: '', tanggal_lahir: '', alamat: '' })
const passForm = ref({ newPassword: '', confirmPassword: '' })

async function loadData() {
  loading.value = true
  const idGuru = auth.user?.reference_id
  if (!idGuru) {
    loading.value = false
    return
  }

  const { data } = await supabase.from('guru').select('*').eq('id_guru', idGuru).single()
  if (data) Object.assign(form.value, data)
  loading.value = false
}

async function updateProfile() {
  savingProfile.value = true
  const idGuru = auth.user?.reference_id

  const { error } = await supabase
    .from('guru')
    .update({
      email: form.value.email,
      nomor_hp: form.value.nomor_hp,
      tempat_lahir: form.value.tempat_lahir,
      tanggal_lahir: form.value.tanggal_lahir,
      alamat: form.value.alamat,
      updated_at: new Date().toISOString()
    })
    .eq('id_guru', idGuru)

  if (!error) {
    showAlert('success', 'Profil Anda berhasil diperbarui.')
    auth.updateProfile({ nama: form.value.nama_guru })
  } else {
    showAlert('danger', 'Gagal memperbarui profil.')
  }
  savingProfile.value = false
}

async function updatePassword() {
  if (passForm.value.newPassword !== passForm.value.confirmPassword) {
    showAlert('danger', 'Password konfirmasi tidak cocok!')
    return
  }

  savingPassword.value = true
  const hash = bcrypt.hashSync(passForm.value.newPassword, 10)

  const { error } = await supabase
    .from('users')
    .update({
      password: hash,
      updated_at: new Date().toISOString()
    })
    .eq('id', auth.user.id)

  if (!error) {
    showAlert('success', 'Password berhasil diubah.')
    passForm.value = { newPassword: '', confirmPassword: '' }
  } else {
    showAlert('danger', 'Gagal mengubah password.')
  }
  savingPassword.value = false
}

function showAlert(type, msg) {
  alert.value = { show: true, type, msg }
  setTimeout(() => { alert.value.show = false }, 3500)
}

onMounted(loadData)
</script>

<style scoped>
.profile-avatar {
  width: 96px; height: 96px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  border: 4px solid var(--bg-elevated);
  box-shadow: var(--shadow-md);
}
</style>
