# 🏠 **Hous-e**

> Desafio técnico desenvolvido para a **Ray Labs**  

A **Hous-e** (junção de *House* + *E-commerce*) é uma plataforma completa de **e-commerce** voltada para produtos domésticos — desde móveis e eletrodomésticos até aparelhos inteligentes e itens decorativos.  

O objetivo do projeto foi desenvolver uma aplicação moderna, escalável e segura utilizando as tecnologias **Next.js**, **Node.js**, **TypeScript**, **PostgreSQL** e **Apache Kafka** para streaming de dados.

---
<img width="1906" height="913" alt="Captura de tela 2025-11-04 152116" src="https://github.com/user-attachments/assets/275deb09-676a-4fb7-ae2a-7c82e8c2555c" />

## 🚀 **Tecnologias Utilizadas**

### **Frontend**
- [Next.js](https://nextjs.org/) — Framework React para SSR e SSG  
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática para maior segurança  
- [Axios](https://axios-http.com/) — Comunicação com o backend  
- [Stripe](https://stripe.com/) — Integração de pagamentos online  

### **Backend**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)  
- [Apache Kafka](https://kafka.apache.org/) — Streaming de dados e mensageria  
- [JWT (JSON Web Token)](https://jwt.io/) — Autenticação segura via tokens  
- [Docker Compose](https://docs.docker.com/compose/) — Orquestração de containers para Kafka e dependências  

---

## 🛍️ **Funcionalidades Principais**

### 👤 **Autenticação e Autorização**
- Login e registro de usuários via **JWT**
- Armazenamento de token em **HTTP-only cookies**, aumentando a segurança

### 🏠 **Gerenciamento de Endereços**
- Usuários podem cadastrar **múltiplos endereços de entrega**

### 💳 **Pagamentos**
- Integração com **Stripe** para checkout seguro e moderno

### 📦 **Gerenciamento de estoque**
- Gerenciamento de estoque de itens, impedindo que um limite acima do disponível seja comprado

### ❤️ **Favoritos**
- Sistema de **produtos favoritos**, com armazenamento no banco de dados

### 🔍 **Filtros Dinâmicos**
- Filtros inteligentes para busca de produtos por categoria, preço, tipo, e mais

### 🧩 **Kafka Integration**
- Kafka é utilizado para o **streaming de eventos**, garantindo comunicação assíncrona entre serviços

---

## ⚙️ **Como Rodar o Projeto Localmente**

### **Pré-requisitos**
Antes de começar, verifique se você possui instalado:
- [Node.js](https://nodejs.org/) (versão 18+)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/)

---

###  **1. Clonar o Repositório**
```bash
git clone https://github.com/seu-usuario/hous-e.git
cd hous-e
```

###  **2. Configurar o Banco e Kafka**
#### Entre na pasta server e inicie os serviços via Docker Compose:
```bash
cd server
docker-compose up -d
```

### **3. Configurar as Variáveis de Ambiente**
#### Crie um arquivo .env em cada pasta (server e client) e adicione as seguintes variáveis:

📦 .env do Backend (server/.env)
```bash
DATABASE_URL="postgresql://postgres:unhadourada@localhost:5432/house?schema=public"
BASE_URL="http://localhost:4000"
JWT_SECRET_KEY=123456
KAFKA_BROKER=localhost:9092
FRONT_URL=http://localhost:3000
STRIPE_SECRET_KEY="stripe_key"

```
.env do Frontend (client/.env)
```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
```

###  **4. Instalar dependências**
#### backend:
```bash
cd server
npm install
npx prisma migrate dev
```

#### frontend
```bash
cd ../client
npm install
```

###  **5. Rodar o projeto**
#### backend:
```bash
cd server
npm run dev
```

#### frontend
```bash
cd client
npm run dev
```

Pronto!
- Frontend: http://localhost:3000

- Backend API: http://localhost:4000

