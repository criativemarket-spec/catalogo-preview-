# Brasil Premium — Catálogo Portugal

## Setup rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar Firebase
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 3. Rodar
npm run dev
```

## Variáveis de ambiente (Vercel)

Configure em Settings → Environment Variables:

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Configurações do projeto |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console → Configurações do projeto |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console → Configurações do projeto |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console → Configurações do projeto |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Configurações do projeto |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console → Configurações do projeto |
| `NEXT_PUBLIC_SITE_URL` | URL do seu site na Vercel |

## Configurar Firebase

1. [console.firebase.google.com](https://console.firebase.google.com) → Novo projeto
2. Ativar **Firestore Database** (modo produção)
3. Ativar **Storage** (modo produção)
4. Ativar **Authentication** → Email/Senha
5. Criar um utilizador admin em Authentication → Users
6. Publicar as regras:

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # selecione seu projeto
firebase deploy --only firestore:rules,firestore:indexes,storage
```

## Painel Admin

Acesse `/admin/login` com o e-mail e senha criados no Firebase.

## Deploy na Vercel

1. Push para GitHub
2. Importar repositório na [vercel.com](https://vercel.com)
3. Adicionar as variáveis de ambiente
4. Deploy automático ✓
