# MinuteGram

A modern social platform built with Spring Boot and React.

## Local Development

### Prerequisites
- Java 17+
- Node.js 18+
- Docker

### Setup

1. **Start Database:**
```bash
docker run --name minutegram-postgres -e POSTGRES_DB=minutegram_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:13
```

2. **Start Backend:**
```bash
./mvnw spring-boot:run
```

3. **Start Frontend:**
```bash
cd client
npm install
npm run dev
```

### Using Docker Compose (Alternative)
```bash
docker-compose up
```

## Deployment

### Backend (Railway)
1. Connect GitHub repo to Railway
2. Add environment variables from `.env.production`
3. Deploy automatically

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`
4. Add environment variable: `VITE_API_BASE_URL`

### Database
Use Railway PostgreSQL addon or Supabase free tier.

## Environment Variables

See `.env.example` for required variables.