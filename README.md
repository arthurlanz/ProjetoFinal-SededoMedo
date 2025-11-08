# 🎃 Sede do Medo - Plataforma de Filmes de Terror

Plataforma web especializada em filmes de terror, desenvolvida com Vue.js 3 e integração com TMDB API.

## 🚀 Tecnologias

- **Vue.js 3** - Framework progressivo
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento SPA
- **Axios** - Requisições HTTP
- **Vite** - Build tool
- **TMDB API** - Dados dos filmes

## 📦 Instalação

### Pré-requisitos
- Node.js >= 18.x
- npm ou yarn

### Passos

1. Clone o repositório: 
- git clone https://github.com/seu-usuario/sede-do-medo.git
- cd sede-do-medo

2. Instale as dependências:
- npm install 

3. Configure as váriaveis de ambiente:
- cp .env

4. Adicione sua API key do TMDB no arquivo `.env`:
- Acesse: https://www.themoviedb.org/settings/api
- Copie sua API Key (v3 auth)
- Cole no arquivo `.env`:

5. Inicie o servidor de desenvolvimento:
- npm run dev
- Acesse: http://localhost:3000

## 🏗️ Estrutura do Projeto
src/
├── assets/ # Estilos e recursos estáticos
├── components/ # Componentes Vue reutilizáveis
├── views/ # Páginas/rotas principais
├── stores/ # Stores Pinia
├── services/ # Serviços de API
├── router/ # Configuração de rotas
└── utils/ # Funções auxiliares


## 📜 Scripts Disponíveis

- npm run dev # Servidor de desenvolvimento
- npm run build # Build para produção
- npm run preview # Preview do build
- npm run lint # Lint do código
- npm run format # Formatar código

## 👥 Equipe

- **Arthur Lanznaster** - Desenvolvedor Front-end / UI/UX
- **Gabriel Sombrio** - Desenvolvedor Front-end / UI/UX

## 📄 Licença

Este projeto é parte do Projeto Integrador - IFC 2025
