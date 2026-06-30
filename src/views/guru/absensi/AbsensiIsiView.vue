<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/guru/dashboard" class="btn btn-secondary btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Kembali
      </router-link>
      <div>
        <h1 class="page-title">Pencatatan Kehadiran</h1>
        <p class="page-subtitle">Kelas: {{ jadwal?.kelas?.nama_kelas }} | Mapel: {{ jadwal?.mata_pelajaran?.nama_mapel }}</p>
      </div>
    </div>

    <!-- Date selector -->
    <div class="card mb-6">
      <div class="filter-bar">
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Tanggal Absensi</label>
          <input v-model="tanggal" type="date" class="form-control" style="max-width:180px" @change="loadAttendance" />
        </div>
        <span class="badge badge-info" style="margin-left:auto" v-if="sudahAdaRecord">
          Mode Edit: Data absensi hari ini sudah tersimpan
        </span>
      </div>
    </div>

    <!-- Students list -->
    <div v-if="loading" class="loading-overlay"><div class="spinner"></div></div>
    <div v-else-if="students.length === 0" class="card text-center text-muted" style="padding:40px">
      <p>Tidak ada siswa aktif terdaftar di kelas ini.</p>
    </div>
    <div v-else class="card">
      <form @submit.prevent="submitAttendance">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:50px">#</th>
                <th style="width:120px">NIS</th>
                <th>Nama Siswa</th>
                <th style="width:360px">Status Kehadiran</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, i) in students" :key="student.id_siswa">
                <td>{{ i + 1 }}</td>
                <td class="text-muted">{{ student.nis }}</td>
                <td><span class="font-semibold">{{ student.nama_siswa }}</span></td>
                <td>
                  <div class="radio-group">
                    <label class="radio-label status-hadir">
                      <input type="radio" :name="`status_${student.id_siswa}`" value="Hadir" v-model="student.status" />
                      <span>Hadir</span>
                    </label>
                    <label class="radio-label status-sakit">
                      <input type="radio" :name="`status_${student.id_siswa}`" value="Sakit" v-model="student.status" />
                      <span>Sakit</span>
                    </label>
                    <label class="radio-label status-izin">
                      <input type="radio" :name="`status_${student.id_siswa}`" value="Izin" v-model="student.status" />
                      <span>Izin</span>
                    </label>
                    <label class="radio-label status-alfa">
                      <input type="radio" :name="`status_${student.id_siswa}`" value="Alfa" v-model="student.status" />
                      <span>Alfa</span>
                    </label>
                    <label class="radio-label status-terlambat">
                      <input type="radio" :name="`status_${student.id_siswa}`" value="Terlambat" v-model="student.status" />
                      <span>Lambat</span>
                    </label>
                  </div>
                </td>
                <td>
                  <input type="text" class="form-control form-control-sm" v-model="student.keterangan" placeholder="Catatan..." />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="errorMsg" class="alert alert-danger mt-4">
          {{ errorMsg }}
        </div>
        <div v-if="successMsg" class="alert alert-success mt-4">
          {{ successMsg }}
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <router-link to="/guru/dashboard" class="btn btn-secondary">Batal</router-link>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner" style="width:14px;height:14px;border-width:2px"></span>
            <span v-else>Simpan Absensi</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const jadwal = ref(null)
const students = ref([])
const tanggal = ref(new Date().toISOString().split('T')[0])
const sudahAdaRecord = ref(false)

async function loadAttendance() {
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''

  const idJadwal = route.params.id

  // Get jadwal details
  const { data: jData } = await supabase
    .from('jadwal')
    .select('*, kelas(nama_kelas), mata_pelajaran(nama_mapel)')
    .eq('id_jadwal', idJadwal)
    .single()
  jadwal.value = jData

  if (!jData) {
    loading.value = false
    return
  }

  // Get students of class
  const { data: sData } = await supabase
    .from('siswa')
    .select('id_siswa, nis, nama_siswa')
    .eq('id_kelas', jData.id_kelas)
    .eq('status_aktif', 1)
    .order('nama_siswa')

  const studentList = sData || []

  // Check if attendance already has records for this day
  const { data: absData } = await supabase
    .from('absensi')
    .select('*')
    .eq('id_jadwal', idJadwal)
    .eq('tanggal', tanggal.value)

  const absMap = new Map((absData || []).map(a => [a.id_siswa, a]))
  sudahAdaRecord.value = (absData?.length || 0) > 0

  students.value = studentList.map(s => {
    const existing = absMap.get(s.id_siswa)
    return {
      id_siswa: s.id_siswa,
      nis: s.nis,
      nama_siswa: s.nama_siswa,
      status: existing ? existing.status : 'Hadir',
      keterangan: existing ? (existing.keterangan || '') : '',
      id_absensi: existing ? existing.id_absensi : null
    }
  })

  loading.value = false
}

async function submitAttendance() {
  saving.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const idJadwal = route.params.id
    const records = students.value.map(s => ({
      id_siswa: s.id_siswa,
      id_jadwal: Number(idJadwal),
      tanggal: tanggal.value,
      status: s.status,
      keterangan: s.keterangan || null,
      updated_at: new Date().toISOString()
    }))

    for (const r of records) {
      // Upsert record: insert if not exist, update if exist (match unique: id_siswa, id_jadwal, tanggal)
      const { error } = await supabase
        .from('absensi')
        .upsert(r, { onConflict: 'id_siswa, id_jadwal, tanggal' })
      if (error) throw error
    }

    successMsg.value = 'Data absensi berhasil disimpan!'
    sudahAdaRecord.value = true
    setTimeout(() => {
      router.push('/guru/dashboard')
    }, 1500)
  } catch (e) {
    errorMsg.value = 'Gagal menyimpan absensi: ' + e.message
  } finally {
    saving.value = false
  }
}

onMounted(loadAttendance)
</script>

<style scoped>
.radio-group {
  display: flex;
  gap: 8px;
}
.radio-label {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  font-weight: 600;
  transition: var(--transition);
}
.radio-label input { display: none; }

.status-hadir:hover, .radio-label.status-hadir:has(input:checked) { background: var(--success-bg); border-color: var(--success); color: var(--success); }
.status-sakit:hover, .radio-label.status-sakit:has(input:checked) { background: var(--info-bg); border-color: var(--info); color: var(--info); }
.status-izin:hover, .radio-label.status-izin:has(input:checked) { background: var(--warning-bg); border-color: var(--warning); color: var(--warning); }
.status-alfa:hover, .radio-label.status-alfa:has(input:checked) { background: var(--danger-bg); border-color: var(--danger); color: var(--danger); }
.status-terlambat:hover, .radio-label.status-terlambat:has(input:checked) { background: rgba(139,92,246,0.15); border-color: var(--accent); color: #a78bfa; }
</style>
