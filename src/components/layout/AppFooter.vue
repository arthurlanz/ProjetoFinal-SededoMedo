<template>
  <footer class="app-footer">
    <div class="container">
      <div class="app-footer__content">
        <div class="app-footer__brand">
          <div class="app-footer__logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 12a6 6 0 0 0-12 0v3c0 1.657 1.343 3 3 3h6c1.657 0 3-1.343 3-3v-3Z"/>
              ircle cx="9" cy="12" r="1"/>
              ircle cx="15" cy="12" r="1"/>
              <path d="M12 18v3"/>
            </svg>
            <span>SEDE DO MEDO</span>
          </div>
          <p class="app-footer__tagline">
            Sua plataforma definitiva para descobrir os melhores filmes de terror
          </p>
        </div>

        <div class="app-footer__links">
          <div class="app-footer__section">
            <h3>Navegação</h3>
            <router-link to="/">Início</router-link>
            <router-link to="/search">Buscar</router-link>
            <router-link to="/favorites">Favoritos</router-link>
          </div>

          <div class="app-footer__section">
            <h3>Informações</h3>
            <p class="app-footer__info">Dados fornecidos por TMDB</p>
            <p class="app-footer__info">Conteúdo +18</p>
          </div>
        </div>
      </div>

      <div class="app-footer__bottom">
        <p>&copy; 2025 SEDE DO MEDO. Desenvolvido com 🩸 para fãs de terror.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.app-footer {
  background: linear-gradient(to bottom, transparent, #000000);
  border-top: 2px solid rgba(220, 38, 38, 0.3);
  padding: 3rem 0 1.5rem;
  margin-top: 4rem;
}

.app-footer__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.app-footer__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
}

.app-footer__logo svg {
  width: 32px;
  height: 32px;
}

.app-footer__tagline {
  color: #9ca3af;
  font-size: 0.875rem;
  max-width: 400px;
  line-height: 1.6;
}

.app-footer__links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.app-footer__section h3 {
  color: #dc2626;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.app-footer__section a {
  display: block;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.app-footer__section a:hover {
  color: #dc2626;
}

.app-footer__info {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.app-footer__bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(220, 38, 38, 0.2);
  color: #6b7280;
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .app-footer__content {
    grid-template-columns: 1fr;
  }

  .app-footer__links {
    grid-template-columns: 1fr;
  }
}
</style>
