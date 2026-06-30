import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabase'
import bcrypt from 'bcryptjs'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('absensi_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isLoggedIn = computed(() => !!user.value)

  const dashboardRoute = computed(() => {
    if (!user.value) return '/login'
    return `/${user.value.role}/dashboard`
  })

  async function login(username, password) {
    loading.value = true
    error.value = null
    try {
      // Ambil user dari tabel users
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (dbError || !data) {
        error.value = 'Username atau password salah.'
        return false
      }

      // Verifikasi password
      const valid = bcrypt.compareSync(password, data.password)
      if (!valid) {
        error.value = 'Username atau password salah.'
        return false
      }

      // Ambil nama dari tabel terkait
      let nama = 'Super Admin'
      let foto = null

      if (data.role === 'guru' && data.reference_id) {
        const { data: guru } = await supabase
          .from('guru')
          .select('nama_guru, foto')
          .eq('id_guru', data.reference_id)
          .single()
        if (guru) { nama = guru.nama_guru; foto = guru.foto }
      } else if (data.role === 'siswa' && data.reference_id) {
        const { data: siswa } = await supabase
          .from('siswa')
          .select('nama_siswa, foto')
          .eq('id_siswa', data.reference_id)
          .single()
        if (siswa) { nama = siswa.nama_siswa; foto = siswa.foto }
      }

      const userData = {
        id: data.id,
        username: data.username,
        role: data.role,
        reference_id: data.reference_id,
        nama,
        foto,
      }

      user.value = userData
      localStorage.setItem('absensi_user', JSON.stringify(userData))
      return true
    } catch (e) {
      error.value = 'Terjadi kesalahan. Coba lagi.'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('absensi_user')
  }

  function updateProfile(updates) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem('absensi_user', JSON.stringify(user.value))
    }
  }

  return { user, loading, error, isLoggedIn, dashboardRoute, login, logout, updateProfile }
})
