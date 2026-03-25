## CoorDinQ Website (Frontend + Backend)

### Dev (local)

- **Frontend**

```bash
cd "d:\coordinQweb\CoorDinQ---WebSite"
npm install
npm run dev
```

- **Backend**

```bash
cd "d:\coordinQweb\CoorDinQ---WebSite\server"
npm install
$env:ADMIN_EMAIL="coordinq@gmail.com"
$env:ADMIN_PASSWORD="ool3alatool"
$env:ADMIN_JWT_SECRET="change_me"
npm run dev
```

Frontend talks to the backend using `/api` in production. In dev, you can set `VITE_API_URL`:

```powershell
$env:VITE_API_URL="http://localhost:3001/api"
```

### Admin access
- Visit `/admin` → you’ll be redirected to `/admin/login` if not signed in.
- Login using the configured env vars (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

### Production (Docker, single domain)
From the repo root (`d:\coordinQweb`):

1) Create `.env` from `.env.example` and set a strong `ADMIN_JWT_SECRET`.
2) Run:

```bash
cd "d:\coordinQweb"
docker compose up -d --build
```

- Site: `http://localhost/`
- API: `http://localhost/api`
- Uploads: `http://localhost/uploads/...`
