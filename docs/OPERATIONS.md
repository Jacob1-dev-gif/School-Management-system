# Operations Guide

This guide covers common operational tasks for the School Management System.

## Table of Contents

- [Database Backups](#database-backups)
- [Secret Rotation](#secret-rotation)
- [Admin Password Reset](#admin-password-reset)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## Database Backups

### Automated Backups (Render)

On Render, PostgreSQL databases on paid plans are automatically backed up daily. Backups are retained for 7-30 days depending on your plan.

### Manual Backups

#### Local/Docker

```bash
# Backup
docker exec school-postgres pg_dump -U school school_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
docker exec -i school-postgres psql -U school school_db < backup_20240101_120000.sql
```

#### Production (Render)

Use the Render dashboard:

1. Navigate to your database service
2. Click "Backups"
3. Click "Create Backup"

Or use `pg_dump` with the connection string:

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Backup Strategy

**Recommended**:
- Daily automated backups
- Weekly manual backups before major changes
- Monthly backups retained for 12 months
- Test restoration quarterly

## Secret Rotation

### JWT Secrets

Rotate JWT secrets every 90 days:

1. Generate new secrets:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. Update environment variables:
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`

3. Restart API service

4. All users will need to log in again

### Database Password

To rotate database password:

1. Generate new password
2. Update password in database
3. Update `DATABASE_URL` environment variable
4. Restart API service

### SMTP Credentials

To update SMTP credentials:

1. Get new credentials from provider
2. Update environment variables:
   - `SMTP_USER`
   - `SMTP_PASSWORD`
3. Restart API and Worker services

## Admin Password Reset

### Via Database

```bash
# Generate password hash
node -e "console.log(require('bcrypt').hashSync('NewPassword123!', 10))"

# Update in database
psql $DATABASE_URL -c "UPDATE users SET password = '[hash]' WHERE email = 'admin@school.local'"
```

### Via API

```bash
# Request reset (sends email)
curl -X POST http://localhost:4000/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.local"}'

# Confirm reset (with token from email)
curl -X POST http://localhost:4000/auth/password-reset/confirm \
  -H "Content-Type: application/json" \
  -d '{"token":"[token]","password":"NewPassword123!"}'
```

### Emergency Admin Creation

If locked out, create a new admin via seed script:

1. Update `.env`:
   ```
   SEED_ADMIN_EMAIL=emergency@school.local
   SEED_ADMIN_PASSWORD=Emergency123!
   ```

2. Run seed:
   ```bash
   cd apps/api
   npx prisma db seed
   ```

## Monitoring

### Health Checks

Monitor these endpoints:

- `GET /health` - Basic health check
- `GET /ready` - Database connectivity check

### Logs

#### Docker Compose

```bash
# View all logs
docker compose logs

# Follow API logs
docker compose logs -f api

# View last 100 lines
docker compose logs --tail=100 api
```

#### Render

1. Go to service in dashboard
2. Click "Logs" tab
3. Filter by severity and time

### Key Metrics

Monitor:

- **API Response Time**: Should be < 200ms for most requests
- **Database Connections**: Should not exceed pool size
- **Redis Memory**: Should stay under limit
- **Worker Queue Length**: Should process jobs promptly
- **Error Rate**: Should be < 1%

### Alerts

Set up alerts for:

- Service downtime
- High error rates
- Database connection failures
- Slow response times
- High memory/CPU usage

## Troubleshooting

### API Won't Start

**Check logs**:
```bash
docker compose logs api
```

**Common issues**:
1. Database not ready → Wait for health check
2. Missing environment variables → Check `.env`
3. Migration failure → Run migrations manually
4. Port already in use → Change `API_PORT`

### Database Connection Issues

**Test connection**:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

**Common fixes**:
1. Check `DATABASE_URL` format
2. Verify database is running
3. Check firewall rules
4. Verify credentials

### Worker Not Processing Jobs

**Check worker logs**:
```bash
docker compose logs worker
```

**Debug Redis connection**:
```bash
redis-cli -u $REDIS_URL ping
```

**Common issues**:
1. Redis not connected → Check `REDIS_URL`
2. No jobs in queue → Add test job
3. Worker crashed → Check logs for errors

### Slow Performance

**Database**:
```sql
-- Check slow queries
SELECT query, calls, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Indexes**:
```bash
# Analyze query plan
EXPLAIN ANALYZE SELECT * FROM students WHERE email = 'test@example.com';

# Create index if needed
CREATE INDEX idx_students_email ON students(email);
```

**Redis**:
```bash
# Check memory usage
redis-cli INFO memory

# Check slow commands
redis-cli SLOWLOG GET 10
```

### Email Not Sending

**Check SMTP connection**:
```bash
telnet $SMTP_HOST $SMTP_PORT
```

**Check notification logs**:
```sql
SELECT * FROM notifications 
WHERE status = 'FAILED' 
ORDER BY created_at DESC 
LIMIT 10;
```

**Test email manually**:
```bash
curl -X POST http://localhost:4000/notifications/email \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient":"test@example.com",
    "subject":"Test",
    "message":"Test message"
  }'
```

## Maintenance

### Database Maintenance

**Vacuum**:
```sql
-- Vacuum all tables
VACUUM ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE students;
```

**Reindex**:
```sql
-- Reindex all tables
REINDEX DATABASE school_db;

-- Reindex specific table
REINDEX TABLE students;
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm update package-name

# Rebuild
npm run build
```

### Prisma Migrations

**Create migration**:
```bash
cd apps/api
npx prisma migrate dev --name description_of_change
```

**Apply in production**:
```bash
npx prisma migrate deploy
```

**Rollback** (if needed):
```bash
# Manually revert in database
psql $DATABASE_URL -c "DELETE FROM _prisma_migrations WHERE migration_name = 'xxx';"

# Run previous migration
npx prisma migrate resolve --rolled-back xxx
```

### Clear Cache

**Redis**:
```bash
# Flush all
redis-cli FLUSHALL

# Flush specific database
redis-cli -n 0 FLUSHDB
```

### Cleanup Old Data

**Old notifications**:
```sql
DELETE FROM notifications 
WHERE created_at < NOW() - INTERVAL '90 days';
```

**Old audit logs**:
```sql
DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Optimize Database

```sql
-- Update statistics
ANALYZE;

-- Rebuild table to reclaim space
VACUUM FULL students;

-- Check for bloat
SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - 
                 pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Disaster Recovery

### Recovery Plan

1. **Assess Damage**
   - Check what's affected
   - Determine root cause
   - Estimate downtime

2. **Restore from Backup**
   - Get latest backup
   - Restore database
   - Verify data integrity

3. **Restart Services**
   - Start database
   - Start Redis
   - Start API
   - Start Web
   - Start Worker

4. **Verify System**
   - Test login
   - Test critical features
   - Check logs for errors

5. **Post-Mortem**
   - Document what happened
   - Identify improvements
   - Update procedures

### Contact Information

Keep updated contact list:

- Database admin
- DevOps team
- Render support
- SMTP provider support
- On-call personnel
