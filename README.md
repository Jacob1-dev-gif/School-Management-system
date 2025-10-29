# School Management System

Modern, production-ready School Management System optimized for Liberian high schools. Built with a modern tech stack and ready for online deployment.

## 🌟 Features

- **Student & Guardian Management**: Complete CRUD operations for students and guardians with relationship management
- **Academic Structure**: Academic years, terms, classes, and subjects management
- **Attendance Tracking**: Daily and subject-level attendance with bulk entry support
- **Assessment & Grading**: WASSCE/WAEC-aligned grading system with weighted averages
- **Report Card Generation**: Automated report card generation with PDF support
- **Finance Management**: Fee schedules, invoices, payments, and receipts (dual currency: LRD/USD)
- **Role-Based Access Control**: Fine-grained permissions for different user roles
- **Notifications**: Email and SMS notifications (development-ready for Orange Money/MTN MoMo)
- **PWA Support**: Offline-capable progressive web app
- **RESTful API**: Complete OpenAPI/Swagger documentation
- **Health Checks**: Liveness and readiness probes for monitoring

## 🏗️ Architecture

### Monorepo Structure

```
School-Management-system/
├── apps/
│   ├── api/           # NestJS backend API
│   ├── web/           # Next.js frontend (App Router)
│   └── worker/        # BullMQ background worker
├── packages/
│   └── shared/        # Shared types, schemas, constants
├── infra/
│   └── docker/        # Docker configuration
├── .github/
│   └── workflows/     # CI/CD pipelines
└── docs/              # Documentation
```

### Tech Stack

- **Backend**: Node.js 20, NestJS, Prisma ORM, PostgreSQL
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, PWA
- **Worker**: BullMQ with Redis for background jobs
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7
- **Notifications**: SMTP Email, SMS adapters (Orange/MTN ready)
- **Deployment**: Docker, Docker Compose, Render.com

### Liberia-Specific Features

- **Timezone**: Africa/Monrovia (default)
- **Currency**: LRD primary, USD optional (dual currency support)
- **Grading**: WASSCE/WAEC grade bands (A1-F9)
- **Phone Validation**: Liberian phone number format (+231)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/Jacob1-dev-gif/School-Management-system.git
cd School-Management-system
```

2. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start all services with Docker Compose**

```bash
docker compose up
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- Mailhog on ports 1025 (SMTP) and 8025 (Web UI)
- API on port 4000
- Web on port 3000
- Worker (background)

4. **Access the application**

- **Web App**: http://localhost:3000
- **API**: http://localhost:4000
- **Swagger Docs**: http://localhost:4000/docs
- **Mailhog UI**: http://localhost:8025

5. **Default Login**

```
Email: admin@school.local
Password: Admin123!
```

### Manual Setup (Without Docker)

1. **Install dependencies**

```bash
npm install
```

2. **Start PostgreSQL and Redis**

```bash
# Using Docker
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=sms_password -e POSTGRES_USER=sms_user -e POSTGRES_DB=school_management postgres:16-alpine
docker run -d -p 6379:6379 redis:7-alpine
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

3. **Run database migrations and seed**

```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

4. **Start services**

```bash
# Terminal 1 - API
cd apps/api
npm run dev

# Terminal 2 - Web
cd apps/web
npm run dev

# Terminal 3 - Worker
cd apps/worker
npm run dev
```

## 📚 API Documentation

The API is fully documented with Swagger/OpenAPI. Visit http://localhost:4000/docs when running locally.

### Key Endpoints

- `POST /auth/login` - Authenticate user
- `GET /auth/me` - Get current user
- `GET /users` - List users (paginated)
- `GET /academic/years` - List academic years
- `POST /students` - Create student
- `POST /attendance/bulk` - Bulk record attendance
- `POST /assessment` - Record assessment
- `POST /finance/payments` - Record payment
- `POST /reports/report-cards/generate` - Generate report card

## 🌐 Online Deployment (Render)

See [docs/DEPLOYMENT_RENDER.md](docs/DEPLOYMENT_RENDER.md) for detailed deployment instructions.

### Quick Deploy to Render

1. Fork this repository
2. Connect your GitHub account to Render
3. Create a new Blueprint instance using `render.yaml`
4. Set environment variables (JWT_SECRET, SMTP credentials, etc.)
5. Deploy!

The `render.yaml` file includes all service definitions:
- PostgreSQL (managed database)
- Redis (managed cache)
- API service
- Web service
- Worker service

## 🔧 Configuration

All configuration is done via environment variables. See `.env.example` for all available options.

### Critical Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/db

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m

# SMTP Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# School Settings
SCHOOL_NAME=Your School Name
TZ=Africa/Monrovia
CURRENCY=LRD
```

## 👥 Default Roles & Permissions

The system includes 8 predefined roles:

1. **ADMIN** - Full system access
2. **PRINCIPAL** - School-wide management
3. **REGISTRAR** - Student records management
4. **TEACHER** - Attendance and assessment
5. **STUDENT** - View own records
6. **PARENT** - View children's records
7. **ACCOUNTANT** - Finance management
8. **LIBRARIAN** - Library management

## 📖 Documentation

- [Deployment Guide (Render)](docs/DEPLOYMENT_RENDER.md)
- [Operations Guide](docs/OPERATIONS.md)
- [API Reference](http://localhost:4000/docs) (when running)

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific tests
cd apps/api && npm run test
```

## 🔒 Security

- bcrypt password hashing
- JWT authentication with refresh tokens
- Rate limiting
- Helmet security headers
- CORS protection
- Role-based access control (RBAC)
- Audit logging for critical actions

## 📱 PWA Features

The web app is a Progressive Web App with:
- Offline capability
- Background sync
- Service worker caching
- Installable on mobile devices

## 🛠️ Development

### Project Structure

```
apps/api/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # User management
│   ├── academic/       # Academic structure
│   ├── students/       # Student management
│   ├── attendance/     # Attendance tracking
│   ├── assessment/     # Grading & assessments
│   ├── finance/        # Fee management
│   ├── reports/        # Report generation
│   ├── notifications/  # Notification system
│   └── health/         # Health checks
└── prisma/
    ├── schema.prisma   # Database schema
    └── seed.ts         # Seed data

apps/web/
└── src/
    ├── app/            # Next.js App Router
    ├── components/     # React components
    └── lib/            # Utilities

apps/worker/
└── src/
    ├── workers/        # Background job workers
    └── queues/         # Queue definitions
```

### Database Schema

The system uses 35+ models including:
- User management (User, Role, Permission)
- Academic structure (School, AcademicYear, Term, Class, Subject)
- Student data (Student, Guardian, Enrollment)
- Attendance tracking
- Assessment & grading
- Finance (FeeSchedule, Invoice, Payment, Receipt)
- Notifications
- Audit logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built for Liberian high schools
- WASSCE/WAEC grading standards
- Optimized for low-bandwidth environments
- Mobile-first design

## 📞 Support

For support and questions, please open an issue on GitHub.

---

**Built with ❤️ for education in Liberia**
