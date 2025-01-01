
## 🛠️ API Routes

### Autenticação

POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout


### Workspaces

GET /api/workspaces
POST /api/workspaces
GET /api/workspaces/[id]
PATCH /api/workspaces/[id]
PUT /api/workspaces/[id]
DELETE /api/workspaces/[id]


### Equipes

typescript
GET /api/equipes
POST /api/equipes
PATCH /api/equipes/[id]
DELETE /api/equipes/[id]


### Serviços

 GET /api/services
POST /api/services
PATCH /api/services/[id]
DELETE /api/services/[id]


### Documentos

GET /api/workspaces/[id]/documentos
POST /api/workspaces/[id]/documentos
DELETE /api/workspaces/[id]/documentos/[documentoId]


