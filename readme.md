# ✨ Gestor de Barbearia - Sistema de Agendamento Web

Bem-vindo ao projeto **Gestor de Barbearia**, uma solução web completa, construída do zero, para modernizar a gestão de agendamentos em barbearias.

O sistema foi desenhado com uma arquitetura **desacoplada** (front-end e back-end independentes) e com foco em **escalabilidade**, permitindo que múltiplas barbearias usem a plataforma de forma segura e isolada, cada uma com seus próprios clientes, serviços e agenda.

---

## 🌐 Aplicação em Produção

O projeto está no ar e pode ser acessado pelos links abaixo:

- **Aplicação (Front-end):** [barbershop-frontend-omega.vercel.app](https://barbershop-frontend-omega.vercel.app)
- **API (Back-end):** [barbershop-api-production-f305.up.railway.app](https://barbershop-api-production-f305.up.railway.app)

---

## ✅ O que o sistema faz?

A versão atual é um **MVP (Produto Mínimo Viável)** robusto que oferece as seguintes funcionalidades:

### 🔑 Autenticação e Gestão de Contas

- **Cadastro Simplificado:** Barbearias podem se registrar através de uma página pública.
- **Controle de Acesso:** Novos cadastros são aprovados manualmente pelo administrador do sistema, garantindo um ambiente seguro.
- **Login Seguro:** Acesso ao painel protegido por tokens de autenticação (JWT).
- **Privacidade Total:** Cada barbearia acessa somente seus próprios dados.

---

### 🖥️ Painel de Controle Intuitivo

- **Design Responsivo:** O painel se adapta perfeitamente a desktops, tablets e celulares.
- **Navegação Clara:** Abas organizadas para Agendamentos, Clientes, Serviços e Histórico.
- **Identidade Visual:** O logo do painel é personalizado com o nome da barbearia e um ícone com cor única, gerado automaticamente.

---

### 🗓️ Gestão Completa

- **Agendamentos:** Crie novos agendamentos, visualize a agenda por dia com um seletor de datas e cancele horários com facilidade.
- **Clientes e Serviços:** CRUD completo para gerenciar clientes e os serviços oferecidos, incluindo a duração de cada um.
- **Histórico:** Todos os agendamentos, incluindo os cancelados, ficam registrados em uma tela de histórico para consulta.

---

### 📲 Notificações Automáticas

- **Lembrete por WhatsApp:** Um serviço automatizado no back-end envia um lembrete via WhatsApp para o cliente, uma hora antes do seu agendamento.
- **Integração Profissional:** A comunicação é feita de forma segura através da API oficial da **Twilio**.

---

## 🚀 Tecnologias Utilizadas

A aplicação foi construída com uma stack de tecnologias modernas, com foco em soluções **gratuitas e escaláveis**.

### 🔧 Back-end

- **Linguagem/Framework:** Node.js & Express.js  
- **Banco de Dados:** PostgreSQL  
- **Autenticação:** JSON Web Tokens (JWT)  
- **Jobs Agendados:** node-cron  
- **Notificações:** Twilio API

### 🎨 Front-end

- **Tecnologias:** HTML5, CSS3, JavaScript (Vanilla JS)  
- **Estilização:** Tailwind CSS

### ☁️ Infraestrutura e Deploy

- **Back-end & Banco de Dados:** Railway  
- **Front-end:** Vercel  
- **Controle de Versão:** Git & GitHub
