# School Management System

A production-ready School Management System tailored for Liberian high schools, featuring comprehensive student information management, academics tracking, finance management, and reporting capabilities.

## Features

- **Student Management**: Enrollment, student records, guardian information
- **Academic Management**: Academic years, terms, classes, subjects, attendance, assessments
- **Finance**: Fee schedules, invoicing, payment processing, arrears reporting
- **Reports**: Automated report card generation with WASSCE-style grading
- **Notifications**: Email and SMS notifications (with Orange/MTN integration ready)
- **User Management**: Role-based access control (RBAC) with 8 predefined roles
- **Audit Logging**: Track all critical system actions

## Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis with BullMQ
- **Authentication**: JWT (access + refresh tokens)
- **Documentation**: Swagger/OpenAPI
- **Security**: bcrypt, Helmet, CORS, rate limiting

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI**: React, TypeScript, Tailwind CSS
- **PWA**: Offline-capable with service workers
- **State Management**: React Query

### Infrastructure
- **Monorepo**: Turborepo
- **Containerization**: Docker & Docker Compose
- **Deployment**: Render (with blueprint)
- **CI/CD**: GitHub Actions

## Liberia-Specific Defaults

- **Timezone**: Africa/Monrovia
- **Currency**: LRD (Liberian Dollar) with optional USD fields
- **Grading**: WASSCE-style grade bands (A1-F9)

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (if running locally)
- Redis 7 (if running locally)

### Local Development with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd School-Management-system
   ```

2. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start all services**
   ```bash
   docker compose up
   ```

   This will start:
   - PostgreSQL (port 5432)
   - Redis (port 6379)
   - Mailhog (SMTP: 1025, Web UI: 8025)
   - API (http://localhost:4000)
   - Web (http://localhost:3000)
   - Worker (background jobs)

4. **Access the application**
   - Web: http://localhost:3000
   - API Docs: http://localhost:4000/docs
   - Mailhog: http://localhost:8025

5. **Default Admin Credentials**
   ```
   Email: admin@school.local
   Password: Admin123!
   ```

### Local Development without Docker

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL and Redis**
   - Ensure PostgreSQL is running on port 5432
   - Ensure Redis is running on port 6379

3. **Run database migrations**
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Start all services**
   ```bash
   npm run dev
   ```

## Project Structure

```
School-Management-system/
├── apps/
│   ├── api/              # NestJS API
│   │   ├── src/
│   │   │   ├── auth/     # Authentication
│   │   │   ├── common/   # Shared utilities
│   │   │   └── modules/  # Feature modules
│   │   └── prisma/       # Database schema & seeds
│   ├── web/              # Next.js frontend
│   │   └── src/
│   │       ├── app/      # App Router pages
│   │       ├── components/
│   │       └── lib/
│   └── worker/           # BullMQ worker
│       └── src/
│           └── processors/
├── packages/
│   └── shared/           # Shared types & schemas
├── infra/
│   └── dockerfiles/      # Docker configurations
├── docs/                 # Documentation
├── docker-compose.yml
├── render.yaml
└── .env.example
```

## User Roles

1. **Admin** - Full system access
2. **Principal** - School-wide management
3. **Registrar** - Student and academic management
4. **Teacher** - Class management, attendance, assessments
5. **Student** - View own reports
6. **Parent** - View child's reports and finances
7. **Accountant** - Finance management
8. **Librarian** - Student records viewing

## API Endpoints

### Authentication
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/password-reset/request` - Request password reset
- `POST /auth/password-reset/confirm` - Confirm password reset

### Users
- `GET /users` - List users
- `POST /users` - Create user
- `GET /users/:id` - Get user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Students
- `GET /students` - List students
- `POST /students` - Create student
- `POST /students/enroll` - Enroll student
- `GET /students/:id` - Get student details

### Academics
- `POST /academics/academic-years` - Create academic year
- `GET /academics/academic-years` - List academic years
- `POST /academics/terms` - Create term
- `GET /academics/terms` - List terms
- `POST /academics/classes` - Create class
- `GET /academics/classes` - List classes
- `POST /academics/subjects` - Create subject
- `GET /academics/subjects` - List subjects
- `POST /academics/attendance` - Record attendance
- `GET /academics/attendance` - Get attendance
- `POST /academics/assessments` - Record assessment
- `GET /academics/assessments` - Get assessments
- `GET /academics/assessments/average/:studentId/:termId` - Compute average
- `GET /academics/grade-scales` - Get grade scales

### Finance
- `POST /finance/fees` - Create fee
- `GET /finance/fees` - List fees
- `POST /finance/invoices` - Create invoice
- `GET /finance/invoices` - List invoices
- `POST /finance/payments` - Record payment
- `GET /finance/payments` - List payments
- `GET /finance/reports/arrears` - Arrears report

### Reports
- `POST /reports/report-cards/:studentId/:termId` - Generate report card
- `GET /reports/report-cards` - List report cards
- `GET /reports/report-cards/download/:id` - Download report card

### Notifications
- `POST /notifications/email` - Send email
- `POST /notifications/sms` - Send SMS
- `GET /notifications` - List notifications

### Health
- `GET /health` - Health check
- `GET /ready` - Readiness check

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `TZ` - Timezone (default: Africa/Monrovia)
- `DEFAULT_CURRENCY` - Currency (default: LRD)
- `SMTP_*` - Email configuration
- `SEED_ADMIN_EMAIL` - Admin email for seeding
- `SEED_ADMIN_PASSWORD` - Admin password for seeding

## Deployment

See [DEPLOYMENT_RENDER.md](./docs/DEPLOYMENT_RENDER.md) for detailed deployment instructions.

## Operations

See [OPERATIONS.md](./docs/OPERATIONS.md) for:
- Database backups
- Secret rotation
- Admin password reset
- Monitoring
- Troubleshooting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
