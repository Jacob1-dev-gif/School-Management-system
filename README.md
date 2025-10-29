# School Management System

A production-ready School Management System scaffold tailored for Liberian high schools. Built with modern technologies and ready for internet deployment from day one.

## 🌍 Liberia-Specific Features

- **Timezone**: Africa/Monrovia (GMT)
- **Currency**: LRD (Liberian Dollar) with optional USD fields
- **Grading**: WASSCE-style grading system (A1-F9)
- **Academic Structure**: Three-term system

## 🏗️ Tech Stack

### Monorepo
- **Turborepo** - Fast, scalable monorepo build system

### Backend API
- **Node.js 20** - Runtime environment
- **NestJS** - Progressive Node.js framework
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Primary database
- **Redis** - Caching and queue storage
- **Swagger** - API documentation
- **Zod** - Runtime type validation
- **JWT** - Access + Refresh token authentication
- **RBAC** - Role-based access control
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **Rate Limiting** - API protection

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **PWA** - Progressive Web App capabilities

### Worker
- **BullMQ** - Redis-based job queue
- **pdfmake** - PDF generation for report cards
- **Nodemailer** - Email notifications

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development
- **Render** - Cloud deployment platform
- **GitHub Actions** - CI/CD pipeline

## 📁 Repository Structure

```
.
├── apps/
│   ├── api/              # NestJS backend API
│   │   ├── src/
│   │   │   ├── auth/         # Authentication module
│   │   │   ├── modules/      # Feature modules
│   │   │   ├── prisma/       # Database service
│   │   │   ├── common/       # Shared utilities
│   │   │   └── config/       # Configuration
│   │   ├── prisma/
│   │   │   ├── schema.prisma # Database schema
│   │   │   └── seed.ts       # Seed data
│   │   └── package.json
│   │
│   ├── web/              # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/          # App router pages
│   │   │   ├── components/   # React components
│   │   │   └── lib/          # Utilities
│   │   ├── public/           # Static assets
│   │   └── package.json
│   │
│   └── worker/           # Background jobs
│       ├── src/
│       │   ├── processors/   # Job processors
│       │   └── services/     # Worker services
│       └── package.json
│
├── packages/
│   └── shared/           # Shared code
│       └── src/
│           ├── types/        # TypeScript types
│           ├── schemas/      # Zod schemas
│           └── constants/    # Constants
│
├── infra/                # Infrastructure
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── Dockerfile.worker
│
├── docs/                 # Documentation
│   ├── DEPLOYMENT_RENDER.md
│   └── OPERATIONS.md
│
├── .github/
│   └── workflows/        # CI/CD pipelines
│
├── docker-compose.yml    # Local development
├── render.yaml           # Render deployment
├── turbo.json            # Turborepo config
├── .env.example          # Environment variables template
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm 10+

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd School-Management-system
   ```

2. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start services with Docker Compose**
   ```bash
   docker compose up
   ```

   This will start:
   - PostgreSQL (port 5432)
   - Redis (port 6379)
   - Mailhog (SMTP: 1025, UI: 8025)
   - API (port 4000)
   - Web (port 3000)
   - Worker

5. **Access the application**
   - Web Frontend: http://localhost:3000
   - API: http://localhost:4000
   - Swagger Docs: http://localhost:4000/docs
   - Mailhog UI: http://localhost:8025

6. **Login credentials**
   - Email: `admin@school.local`
   - Password: `Admin123!`

## 🗄️ Database Schema

The system includes comprehensive models for:

- **Authentication & RBAC**: User, Role, Permission, UserRole, RolePermission
- **School Structure**: School, AcademicYear, Term, Class, Subject
- **Students**: Student, Guardian, Enrollment
- **Academic Records**: Attendance, Assessment, GradeScale, ReportCard
- **Finance**: Fee, Invoice, Payment
- **System**: Notification, AuditLog

## 📚 Key API Endpoints

- **Auth**: Login, refresh token, logout
- **Users & Roles**: CRUD operations + role assignment
- **Students**: CRUD, enrollment, guardians
- **Academic Setup**: Years, terms, classes, subjects
- **Attendance**: Daily and subject-level tracking
- **Assessments**: Record grades, compute averages
- **Report Cards**: Generate and download PDFs
- **Finance**: Fees, invoices, payments, arrears
- **Health**: `/health` and `/ready` endpoints

## 🔒 Security Features

- bcrypt password hashing
- JWT authentication (access + refresh tokens)
- Role-based access control (RBAC)
- Helmet.js security headers
- CORS configuration
- Rate limiting
- Audit logging
- Input validation with Zod

## 📊 WASSCE Grading Scale

Pre-configured with West African Senior School Certificate Examination grades:
A1 (90-100), A2 (80-89), B3 (70-79), C4-C6 (Credit), D7-E8 (Pass), F9 (Fail)

## 🌐 Deployment

See `docs/DEPLOYMENT_RENDER.md` for complete deployment guide.

Quick deploy to Render:
1. Connect repository
2. Render auto-detects `render.yaml`
3. Configure environment variables
4. Deploy

## 📝 Development

```bash
npm run dev          # Start all services in development
npm run build        # Build all packages
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

## 📖 Documentation

- [Deployment Guide](docs/DEPLOYMENT_RENDER.md)
- [Operations Manual](docs/OPERATIONS.md)
- [API Docs](http://localhost:4000/docs) - Interactive Swagger

## ✅ Production Checklist

- [ ] Change default admin password
- [ ] Set strong JWT secrets
- [ ] Configure production SMTP
- [ ] Enable database backups
- [ ] Set up HTTPS
- [ ] Configure CORS for production domain
- [ ] Review RBAC permissions
- [ ] Set up monitoring
- [ ] Test disaster recovery

---

**Built with ❤️ for Liberian Education**
