<template>
  <div class="login-form">
    <div class="login-form__container">
      <div class="login-form__header">
        <div class="login-form__logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 12a6 6 0 0 0-12 0v3c0 1.657 1.343 3 3 3h6c1.657 0 3-1.343 3-3v-3Z"/>
            <circle cx="9" cy="12" r="1"/>
            <circle cx="15" cy="12" r="1"/>
            <path d="M12 18v3"/>
          </svg>
        </div>
        <h1 class="login-form__title">Entrar no Sede Do Medo</h1>
        <p class="login-form__subtitle">Use suas credenciais do TMDB</p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form__form">
        <div class="login-form__field">
          <label for="username" class="login-form__label">Usuário TMDB</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Digite seu usuário"
            class="login-form__input"
            :disabled="loading"
            required
          />
        </div>

        <div class="login-form__field">
          <label for="password" class="login-form__label">Senha</label>
          <div class="login-form__password-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Digite sua senha"
              class="login-form__input"
              :disabled="loading"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="login-form__password-toggle"
              :disabled="loading"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="error" class="login-form__error">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <button
          type="submit"
          class="login-form__submit"
          :disabled="loading || !username || !password"
        >
          <span v-if="!loading">Entrar</span>
          <span v-else class="login-form__loading">
            <svg class="login-form__spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            Entrando...
          </span>
        </button>
      </form>

      <div class="login-form__footer">
        <p>Não tem uma conta no TMDB?</p>
        <a href="https://www.themoviedb.org/signup" target="_blank" class="login-form__link">
          Criar conta gratuita
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>

      <div class="login-form__guest">
        <button @click="continueAsGuest" class="login-form__guest-btn">
          Continuar sem login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { login, loading, error } = useAuth();

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const handleSubmit = async () => {
  await login(username.value, password.value);
};

const continueAsGuest = () => {
  router.push({ name: 'home' });
};
</script>

<style scoped>
.login-form {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1a0000 0%, #000000 100%);
  padding: 2rem;
}

.login-form__container {
  width: 100%;
  max-width: 450px;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
}

.login-form__header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-form__logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  color: #dc2626;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.login-form__logo svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.6));
}

.login-form__title {
  font-size: 2rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
}

.login-form__subtitle {
  color: #9ca3af;
  font-size: 0.875rem;
}

.login-form__form {
  margin-bottom: 2rem;
}

.login-form__field {
  margin-bottom: 1.5rem;
}

.login-form__label {
  display: block;
  color: #d1d5db;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.login-form__input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: #111827;
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.login-form__input:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.login-form__input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-form__password-wrapper {
  position: relative;
}

.login-form__password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  transition: color 0.3s ease;
}

.login-form__password-toggle:hover:not(:disabled) {
  color: #dc2626;
}

.login-form__password-toggle:disabled {
  cursor: not-allowed;
}

.login-form__password-toggle svg {
  width: 100%;
  height: 100%;
}

.login-form__error {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.5);
  border-radius: 0.5rem;
  color: #fca5a5;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.login-form__error svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.login-form__submit {
  width: 100%;
  padding: 1rem;
  background: #dc2626;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-form__submit:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.login-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.login-form__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.login-form__spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-form__footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(220, 38, 38, 0.2);
}

.login-form__footer p {
  color: #9ca3af;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.login-form__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-form__link:hover {
  color: #b91c1c;
  gap: 0.75rem;
}

.login-form__link svg {
  width: 16px;
  height: 16px;
}

.login-form__guest {
  text-align: center;
  margin-top: 1.5rem;
}

.login-form__guest-btn {
  color: #6b7280;
  background: none;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.login-form__guest-btn:hover {
  color: #9ca3af;
}

@media (max-width: 640px) {
  .login-form__container {
    padding: 2rem 1.5rem;
  }

  .login-form__title {
    font-size: 1.5rem;
  }
}
</style>
