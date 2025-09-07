# Frontend (Google Login) – React + TS + Vite + Tailwind (DDD + Hexagonal)

Este frontend implementa un flujo de login con Google usando Google Identity Services (GIS).
En el callback se obtiene un `id_token` (JWT) y se envía a tu backend Symfony en
`POST /api/auth/google` para crear sesión/usuario.

## Variables de entorno (frontend)
Copia `.env.example` a `.env` o pásalas como `build args` al contenedor:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8085
```

> **Nota**: Desde el navegador, `VITE_API_BASE_URL` debe ser la URL pública del backend (p.ej. `http://localhost:8085`),
> no el nombre del servicio dentro de Docker.

## Estructura (DDD + Hexagonal)
- `src/domain`: entidades, puertos e interacciones (use cases).
- `src/infrastructure`: adaptadores (HTTP hacia backend).
- `src/ui`: componentes React.
- `src/shared/config.ts`: acceso a variables de entorno.

## Endpoints backend esperados
- `POST api/users/auth/google` con body `{ "idToken": "<jwt>" }` → respuesta JSON con la sesión
  ```json
  { "user": { "id": "u1", "email": "x@y.com", "name": "User", "picture": "..." }, "accessToken": "..." }
  ```
- `POST /api/users/auth/logout` (opcional) para cerrar sesión.

## Docker (solo frontend)
Construir e iniciar el contenedor del frontend dentro de la carpeta `frontend`:
```bash
docker build     --build-arg VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID     --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL     -t siroko-frontend .

docker run --rm -p 3000:80 --name siroko-frontend siroko-frontend
```
Accede a http://localhost:3000

## Integración en tu `docker-compose.yml`
Añade este servicio (ajusta rutas si mueves la carpeta):
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
    args:
      VITE_GOOGLE_CLIENT_ID: ${VITE_GOOGLE_CLIENT_ID}
      VITE_API_BASE_URL: ${VITE_API_BASE_URL}
  container_name: frontend-siroko-container
  ports:
    - "3000:80"
  depends_on:
    - nginx
  networks:
    - siroko-network
```

Y en tu `.env` raíz añade:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:${NGINX_PORT}
```

## CORS en Symfony (importante)
Habilita CORS para el origen `http://localhost:3000` (y los que uses) en tu backend
para `POST /api/auth/google` (y logout). Por ejemplo con NelmioCorsBundle:
```yaml
nelmio_cors:
  defaults:
    origin_regex: true
    allow_origin: ['^http://localhost:3000$']
    allow_methods: ['POST', 'GET', 'OPTIONS']
    allow_headers: ['Content-Type', 'Authorization']
    allow_credentials: true
  paths:
    '^/api/': ~
```

## Desarrollo sin Docker
```bash
npm install
cp .env.example .env  # y edita las variables
npm run dev
```

---

### Notas de seguridad
- El `id_token` de Google se envía **sólo** al backend por HTTPS.
- El backend **debe** verificar la firma del `id_token` y audiencia (client_id).
- Emite tu propia cookie de sesión `HttpOnly; Secure; SameSite=Lax|Strict`.
