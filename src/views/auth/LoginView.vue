<template>
  <div class="login-wrapper">
    <!-- Background decoration -->
    <div class="login-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="login-container">
      <!-- Left Panel -->
      <div class="login-panel-left">
        <div class="login-brand">
          <div class="login-logo" style="background: transparent; box-shadow: none;">
            <img src="https://smkperpajakanriau.sch.id/media_library/images/66841d57682be0395510c1ad6e7acd92.PNG" alt="Logo SMK Perpajakan Riau" style="width: 72px; height: 72px; object-fit: contain;" />
          </div>
          <h1 class="login-school" style="font-size: 36px; font-weight: 900; letter-spacing: 0.05em; color: var(--primary)">ASPIRA</h1>
          <p class="login-tagline" style="font-weight: 700; color: var(--text-primary)">Aplikasi Sistem Presensi & Informasi</p>
          <p class="text-muted text-small" style="font-weight: 500; font-size: 13px;">SMK Perpajakan Riau</p>
        </div>

        <div class="login-stats">
          <div class="login-stat-item">
            <span class="login-stat-value">500+</span>
            <span class="login-stat-label">Siswa Aktif</span>
          </div>
          <div class="login-stat-divider"></div>
          <div class="login-stat-item">
            <span class="login-stat-value">30+</span>
            <span class="login-stat-label">Guru Pengajar</span>
          </div>
          <div class="login-stat-divider"></div>
          <div class="login-stat-item">
            <span class="login-stat-value">24/7</span>
            <span class="login-stat-label">Akses Online</span>
          </div>
        </div>

        <p class="login-desc">
          Platform manajemen kehadiran modern untuk mendukung kegiatan belajar mengajar yang efektif dan terdata dengan baik.
        </p>
      </div>

      <!-- Right Panel (Form) -->
      <div class="login-panel-right">
        <div class="login-form-card">
          <div class="login-form-header">
            <h2>Selamat Datang</h2>
            <p>Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <div v-if="auth.error" class="alert alert-danger">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ auth.error }}
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label class="form-label">Username</label>
              <div class="input-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  class="form-control"
                  placeholder="Masukkan username"
                  autocomplete="username"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Masukkan password"
                  autocomplete="current-password"
                  required
                />
                <button type="button" class="input-eye" @click="showPassword = !showPassword" tabindex="-1">
                  <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-full" :disabled="auth.loading" id="login-btn">
              <span v-if="auth.loading" class="spinner" style="width:18px;height:18px;border-width:2px"></span>
              <span v-else>Masuk</span>
            </button>
          </form>

          <div class="login-hints">
            <p class="text-muted text-small text-center">Demo Akun:</p>
            <div class="demo-accounts">
              <div class="demo-badge" @click="fillDemo('admin', 'admin123')">Admin</div>
              <div class="demo-badge" @click="fillDemo('guru1', 'guru123')">Guru</div>
              <div class="demo-badge" @click="fillDemo('siswa1', 'siswa123')">Siswa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const showPassword = ref(false)

const form = reactive({ username: '', password: '' })

function fillDemo(user, pass) {
  form.username = user
  form.password = pass
}

async function handleLogin() {
  const ok = await auth.login(form.username, form.password)
  if (ok) {
    router.push(auth.dashboardRoute)
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 24px;
}

.login-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
}
.blob-1 {
  width: 600px; height: 600px;
  background: var(--primary);
  top: -200px; left: -200px;
  animation: blobMove1 12s ease-in-out infinite alternate;
}
.blob-2 {
  width: 500px; height: 500px;
  background: var(--accent);
  bottom: -150px; right: -100px;
  animation: blobMove2 10s ease-in-out infinite alternate;
}
.blob-3 {
  width: 300px; height: 300px;
  background: var(--success);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation: blobMove3 15s ease-in-out infinite alternate;
}

@keyframes blobMove1 { from { transform: translate(0,0) scale(1); } to { transform: translate(100px,50px) scale(1.1); } }
@keyframes blobMove2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-80px,-60px) scale(1.15); } }
@keyframes blobMove3 { from { transform: translate(-50%,-50%) scale(1); } to { transform: translate(-50%,-50%) scale(1.3); } }

.login-container {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 960px;
  width: 100%;
}

.login-panel-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding: 40px 0;
}

.login-brand { display: flex; flex-direction: column; gap: 8px; }

.login-logo {
  width: 64px; height: 64px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 30px rgba(99,102,241,0.4);
  margin-bottom: 8px;
}
.login-logo svg { width: 32px; height: 32px; color: #fff; }

.login-school {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-light), var(--text-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-tagline {
  font-size: 16px;
  color: var(--text-muted);
  font-weight: 500;
}

.login-stats {
  display: flex;
  gap: 24px;
  align-items: center;
}
.login-stat-item { text-align: center; }
.login-stat-value { display: block; font-size: 24px; font-weight: 800; color: var(--primary-light); }
.login-stat-label { font-size: 11px; color: var(--text-muted); }
.login-stat-divider { width: 1px; height: 40px; background: var(--border); }

.login-desc {
  font-size: 13.5px;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 380px;
}

.login-panel-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: 36px;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  animation: slideUp 0.4s ease;
}

.login-form-header {
  margin-bottom: 28px;
}
.login-form-header h2 {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 4px;
}
.login-form-header p {
  font-size: 13px;
  color: var(--text-muted);
}

.input-icon-wrapper {
  position: relative;
}
.input-icon-wrapper svg:first-child {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 17px; height: 17px;
  color: var(--text-muted);
  pointer-events: none;
}
.input-icon-wrapper .form-control {
  padding-left: 40px;
  padding-right: 40px;
}
.input-eye {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px; height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: color 0.2s;
}
.input-eye:hover { color: var(--text-primary); }
.input-eye svg { width: 16px; height: 16px; }

.login-hints { margin-top: 20px; }
.demo-accounts {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
}
.demo-badge {
  padding: 4px 14px;
  border-radius: var(--radius-full);
  background: var(--bg-overlay);
  border: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}
.demo-badge:hover {
  background: rgba(99,102,241,0.15);
  border-color: var(--border-primary);
  color: var(--primary-light);
}

@media (max-width: 768px) {
  .login-container { grid-template-columns: 1fr; }
  .login-panel-left { display: none; }
  .login-form-card { padding: 28px 20px; }
}
</style>
