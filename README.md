# CreditoSmart 💳

Sistema de gestión de préstamos - Universidad de Cartagena.

## Arquitectura

```
┌─────────────────┐     HTTP/JSON    ┌──────────────────────────────────────┐
│   React + Vite  │ ◄─────────────► │  Express API (Node.js)              │
│   (Frontend)    │                  │                                      │
│                 │                  │  Routes → Controllers → Services    │
│  - AuthContext  │                  │                    ↓                 │
│  - ApiClient    │                  │            Repositories             │
│  - React Router │                  │            (JsonRepository)         │
│  - Recharts     │                  │                    ↓                 │
└─────────────────┘                  │         JSON files (./data/)        │
                                     └──────────────────────────────────────┘
```

### Patrón Repository

El acceso a datos está abstraído en `JsonRepository`. 
Para migrar a PostgreSQL/MongoDB solo se reemplaza esa clase — 
**nada más cambia** (ni services, ni controllers, ni routes).

```
src/
├── repositories/
│   ├── JsonRepository.js   ← Cambia solo esto por DbRepository
│   └── index.js             ← Exporta instancias por entidad
├── services/                ← Lógica de negocio (nunca cambia)
├── controllers/             ← Manejo de request/response
├── routes/                  ← Definición de endpoints
├── middleware/              ← Auth JWT, validación, errores
└── config/                  ← Variables de entorno
```

## Setup Local

### Backend

```bash
cd backend
npm install
npm run seed    # Poblar datos de demo
npm run dev     # http://localhost:4000
```

**Usuario demo:** `admin@creditosmart.com` / `admin123`

### Frontend

```bash
cd frontend
npm install
npm run dev     # http://localhost:3000 (proxy a :4000)
```

## API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/register | ❌ | Crear cuenta |
| POST | /api/auth/login | ❌ | Iniciar sesión |
| GET | /api/auth/profile | ✅ | Perfil del usuario |
| GET | /api/clients | ✅ | Listar clientes |
| POST | /api/clients | ✅ | Crear cliente |
| PUT | /api/clients/:id | ✅ | Editar cliente |
| DELETE | /api/clients/:id | ✅ | Eliminar cliente |
| GET | /api/loans | ✅ | Listar préstamos |
| GET | /api/loans/dashboard | ✅ | Stats del dashboard |
| POST | /api/loans | ✅ | Crear préstamo |
| POST | /api/loans/simulate | ✅ | Simular préstamo |
| GET | /api/payments | ✅ | Listar pagos |
| GET | /api/payments/stats | ✅ | Stats de recaudo |
| POST | /api/payments | ✅ | Registrar pago |
| GET | /api/notifications | ✅ | Listar notificaciones |
| PATCH | /api/notifications/:id/read | ✅ | Marcar leída |

## Despliegue Gratuito

### Backend → Render.com

1. Crear cuenta en [render.com](https://render.com)
2. New → Web Service → conectar repo GitHub
3. Build Command: `cd backend && npm install && npm run seed`
4. Start Command: `cd backend && npm start`
5. Variables de entorno:
   - `JWT_SECRET` = (un string seguro)
   - `JWT_EXPIRES_IN` = 7d
   - `DATA_DIR` = ./src/data
   - `NODE_ENV` = production

### Frontend → Vercel

1. Crear cuenta en [vercel.com](https://vercel.com)
2. Import → conectar repo GitHub
3. Root Directory: `frontend`
4. Framework Preset: Vite
5. Variable de entorno:
   - `VITE_API_URL` = `https://tu-backend.onrender.com/api`

### Alternativa: Todo en Render

Servir el frontend como build estático desde Express:

```bash
# En backend/src/index.js, agregar antes del error handler:
const path = require("path");
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});
```

Build Command: `cd frontend && npm install && npm run build && cd ../backend && npm install && npm run seed`
Start Command: `cd backend && npm start`

## Stack

- **Frontend:** React 18, Vite, React Router 6, Recharts
- **Backend:** Node.js, Express 4, JWT, bcryptjs
- **Persistencia:** JSON files (patrón Repository, migrable a DB)
- **Auth:** JWT Bearer token
