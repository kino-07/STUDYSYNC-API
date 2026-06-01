StudySync API 🎓

API REST para gestión de grupos de estudio — Programación IV, UPDS 2026.

## Arquitectura del sistema
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Thunder Client / Swagger)    │
└─────────────────────────┬───────────────────────────────┘
│ HTTP Request
▼
┌─────────────────────────────────────────────────────────┐
│                   API REST (Express.js)                  │
│                                                          │
│  Routes → Controller → Model                            │
│                                                          │
│  GET/POST/PUT/DELETE /api/grupos                        │
└──────────┬──────────────────────┬───────────────────────┘
│                      │
▼                      ▼
┌──────────────────┐   ┌─────────────────────────────────┐
│   Supabase       │   │   Upstash Redis Pub/Sub          │
│   PostgreSQL     │   │                                  │
│                  │   │  Canales:                        │
│  Tabla: Grupo    │   │  → study:grupo:creado            │
│  Tabla: Sesion   │   │  → study:grupo:actualizado       │
│                  │   │  → study:grupo:eliminado         │
│  Datos persisten │   │                                  │
│  en la nube      │   │  Suscriptor recibe eventos       │
│                  │   │  en tiempo real                  │
└──────────────────┘   └─────────────────────────────────┘

## Tecnologías

| Componente | Tecnología |
|-----------|------------|
| API REST | Node.js + Express.js |
| Base de datos | Supabase (PostgreSQL) |
| ORM | Prisma v5 |
| Mensajería | Upstash Redis Pub/Sub |
| Tiempo real | Socket.io |
| Documentación | Swagger UI |
| Despliegue | Render.com |

## URL de Producción
https://studysync-api-prv0.onrender.com

## Swagger UI
https://studysync-api-prv0.onrender.com/api-docs

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | /api/grupos | Listar todos | 200 |
| GET | /api/grupos/:id | Obtener uno | 200 / 404 |
| POST | /api/grupos | Crear nuevo | 201 / 400 |
| PUT | /api/grupos/:id | Actualizar | 200 / 404 |
| DELETE | /api/grupos/:id | Eliminar | 200 / 404 |

## Cómo correr localmente

```bash
npm install
npm start
```

## Demo Redis Pub/Sub (3 terminales)

```bash
# Terminal 1
node pubsub/subscriber.js

# Terminal 2
node pubsub/server-socketio.js

# Terminal 3 - crear un grupo dispara evento automáticamente
npm start
```

## Flujo completo

1. Cliente hace POST /api/grupos
2. API guarda en Supabase PostgreSQL
3. API publica evento en Redis canal study:grupo:creado
4. Suscriptor recibe el evento en tiempo real
5. Socket.io reenvía al navegador sin recargar

## Entidad: Grupo

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | Int | Auto incremento |
| nombre | String | Nombre del grupo |
| materia | String | Materia de estudio |
| turno | String | mañana / tarde / noche |
| activo | Boolean | Estado del grupo |
| creadoEn | DateTime | Fecha de creación |

## Equipo

- Persona 1 — publisher.js
- Persona 2 — subscriber.js  
- Persona 3 — server-socketio.js + notificaciones.html