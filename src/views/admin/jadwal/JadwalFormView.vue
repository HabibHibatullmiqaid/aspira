<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/jadwal" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">{{ isEdit ? 'Edit Jadwal' : 'Tambah Jadwal' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Perbarui jadwal pelajaran' : 'Isi jadwal pelajaran baru' }}</p>
      </div>
    </div>

    <div class="card">
      <div v-if="loadingData" class="loading-overlay"><div class="spinner"></div></div>
      <form v-else @submit.prevent="handleSubmit">
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Kelas <span class="required">*</span></label>
            <select v-model="form.id_kelas" class="form-control" required>
              <option value="">Pilih kelas</option>
              <option v-for="k in kelases" :key="k.id_kelas" :value="k.id_kelas">{{ k.nama_kelas }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Mata Pelajaran <span class="required">*</span></label>
            <select v-model="form.id_mapel" class="form-control" required>
              <option value="">Pilih mata pelajaran</option>
              <option v-for="m in mapels" :key="m.id_mapel" :value="m.id_mapel">[{{ m.kode_mapel }}] {{ m.nama_mapel }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Guru Pengajar <span class="required">*</span></label>
            <select v-model="form.id_guru" class="form-control" required>
              <option value="">Pilih guru</option>
              <option v-for="g in gurus" :key="g.id_guru" :value="g.id_guru">{{ g.nama_guru }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Hari <span class="required">*</span></label>
            <select v-model="form.hari" class="form-control" required>
              <option value="">Pilih hari</option>
              <option v-for="h in ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']" :key="h" :value="h">{{ h }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Jam Mulai <span class="required">*</span></label>
            <input v-model="form.jam_mulai" type="time" class="form-control" required />
          </div>
          <div class="form-group">
            <label class="form-label">Jam Selesai <span class="required">*</span></label>
            <input v-model="form.jam_selesai" type="time" class="form-control" required />
          </div>
        </div>

        <div v-if="errorMsg" class="alert alert-danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {{ errorMsg }}
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <router-link to="/admin/jadwal" class="btn btn-secondary">Batal</router-link>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
            <span v-else>{{ isEdit ? 'Simpan Perubahan' : 'Tambah Jadwal' }}</span>
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
const mapels = ref([])
const gurus = ref([])
const taAktif = ref(null)

const form = ref({ id_kelas: '', id_mapel: '', id_guru: '', id_tahun_ajaran: '', hari: '', jam_mulai: '', jam_selesai: '' })

async function loadData() {
  loadingData.value = true

  // Get active year
  const { data: ta } = await supabase.from('tahun_ajaran').select('*').eq('status_aktif', 1).single()
  taAktif.value = ta
  if (ta) form.value.id_tahun_ajaran = ta.id_tahun_ajaran

  // Load masters
  const [{ data: kData }, { data: mData }, { data: gData }] = await Promise.all([
    supabase.from('kelas').select('id_kelas, nama_kelas').order('nama_kelas'),
    supabase.from('mata_pelajaran').select('id_mapel, kode_mapel, nama_mapel').order('nama_mapel'),
    supabase.from('guru').select('id_guru, nama_guru').eq('status_aktif', 1).order('nama_guru')
  ])

  kelases.value = kData || []
  mapels.value = mData || []
  gurus.value = gData || []

  if (isEdit.value) {
    const { data: jData } = await supabase.from('jadwal').select('*').eq('id_jadwal', route.params.id).single()
    if (jData) Object.assign(form.value, jData)
  }

  loadingData.value = false
}

async function checkConflict() {
  // Check if guru already has schedule on that day and time overlap
  // Query to find conflicts
  let query = supabase
    .from('jadwal')
    .select('*, kelas(nama_kelas)')
    .eq('id_guru', form.value.id_guru)
    .eq('hari', form.value.hari)
    .eq('id_tahun_ajaran', form.value.id_tahun_ajaran)

  if (isEdit.value) {
    query = query.neq('id_jadwal', route.params.id)
  }

  const { data: conflicts } = await query

  if (conflicts) {
    for (const c of conflicts) {
      // Overlap logic: (StartA < EndB) and (EndA > StartB)
      const startA = form.value.jam_mulai
      const endA = form.value.jam_selesai
      const startB = c.jam_mulai
      const endB = c.jam_selesai

      if (startA < endB && endA > startB) {
        return `Guru sudah mengajar di kelas ${c.kelas?.nama_kelas} pada hari ${c.hari} jam ${startB.substring(0,5)}-${endB.substring(0,5)}`
      }
    }
  }

  // Also check if class has schedule on that day and time overlap
  let queryClass = supabase
    .from('jadwal')
    .select('*, guru(nama_guru)')
    .eq('id_kelas', form.value.id_kelas)
    .eq('hari', form.value.hari)
    .eq('id_tahun_ajaran', form.value.id_tahun_ajaran)

  if (isEdit.value) {
    queryClass = queryClass.neq('id_jadwal', route.params.id)
  }

  const { data: classConflicts } = await queryClass
  if (classConflicts) {
    for (const c of classConflicts) {
      const startA = form.value.jam_mulai
      const endA = form.value.jam_selesai
      const startB = c.jam_mulai
      const endB = c.jam_selesai

      if (startA < endB && endA > startB) {
        return `Kelas sudah memiliki jadwal pelajaran lain bersama guru ${c.guru?.nama_guru} pada jam tersebut (${startB.substring(0,5)}-${endB.substring(0,5)})`
      }
    }
  }

  return null
}

async function handleSubmit() {
  if (form.value.jam_mulai >= form.value.jam_selesai) {
    errorMsg.value = 'Jam mulai harus lebih awal dari jam selesai!'
    return
  }

  saving.value = true
  errorMsg.value = ''

  try {
    const conflict = await checkConflict()
    if (conflict) {
      errorMsg.value = conflict
      saving.value = false
      return
    }

    const payload = { ...form.value }
    if (isEdit.value) {
      const { error } = await supabase.from('jadwal').update(payload).eq('id_jadwal', route.params.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('jadwal').insert([payload])
      if (error) throw error
    }
    router.push('/admin/jadwal')
  } catch (e) {
    errorMsg.value = e.message || 'Terjadi kesalahan saat menyimpan.'
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>
