# Quick Start Guide

This is a quick reference for getting the School Management System up and running.

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

## 🚀 Quick Start (Docker - Recommended)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd School-Management-system

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker compose up

# 4. Access the application
# Web: http://localhost:3000
# API Docs: http://localhost:4000/docs
# Mailhog: http://localhost:8025

# 5. Login with default credentials
# Email: admin@school.local
# Password: Admin123!
```

That's it! The system will:
- Start PostgreSQL, Redis, and Mailhog
- Run database migrations
- Seed initial data
- Start API, Web, and Worker services

## 🛠️ Development Setup (Without Docker)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your PostgreSQL and Redis URLs

# 3. Run migrations and seed
cd apps/api
npx prisma migrate dev
npx prisma db seed
cd ../..

# 4. Start all services
npm run dev
```

## 📚 Available Commands

```bash
# Build all packages
npm run build

# Start development mode
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## 🐳 Docker Commands

```bash
# Start all services
docker compose up

# Start in detached mode
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild and start
docker compose up --build

# View specific service logs
docker compose logs -f api
```

## 📊 Seeded Data

After running migrations and seeds, you'll have:

- **Admin User**: admin@school.local / Admin123!
- **8 Roles**: Admin, Principal, Registrar, Teacher, Student, Parent, Accountant, Librarian
- **Sample School**: Demo High School
- **Academic Year**: Current year with 3 terms
- **WASSCE Grade Scale**: 9 grade bands (A1-F9)

## 🔗 Service URLs

| Service | URL | Notes |
|---------|-----|-------|
| Web App | http://localhost:3000 | Main application |
| API | http://localhost:4000 | REST API |
| Swagger Docs | http://localhost:4000/docs | Interactive API docs |
| Health Check | http://localhost:4000/health | API health |
| Mailhog | http://localhost:8025 | Email viewer (dev) |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache/Queue |

## 📖 Documentation

- [README.md](./README.md) - Full documentation
- [DEPLOYMENT_RENDER.md](./docs/DEPLOYMENT_RENDER.md) - Deployment guide
- [OPERATIONS.md](./docs/OPERATIONS.md) - Operations guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What's implemented

## 🆘 Troubleshooting

### Port already in use
```bash
# Change ports in docker-compose.yml or .env
# Default ports: 3000 (web), 4000 (api), 5432 (postgres), 6379 (redis)
```

### Database connection failed
```bash
# Wait for PostgreSQL to be ready
docker compose logs postgres

# Or restart services
docker compose restart api
```

### Can't login
```bash
# Verify seed ran successfully
docker compose logs api | grep "Seeding"

# Re-run seed
docker compose exec api npm run prisma:seed
```

### Build errors
```bash
# Clean and rebuild
npm run clean
docker compose down -v
docker compose up --build
```

## 🎯 Next Steps

1. Explore the API at http://localhost:4000/docs
2. Login to the web app
3. Create students, classes, and subjects
4. Record attendance and assessments
5. Generate report cards

## 💡 Tips

- Use Mailhog to view emails sent by the system
- Check health endpoint for service status
- Use Swagger docs for API testing
- Monitor logs for debugging

## 📧 Support

For issues and questions:
- Check [OPERATIONS.md](./docs/OPERATIONS.md) for troubleshooting
- Open an issue on GitHub
- Review logs for errors
