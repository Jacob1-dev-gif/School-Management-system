# Operations Guide

This guide covers day-to-day operations, maintenance, and troubleshooting for the School Management System.

## Table of Contents

1. [System Administration](#system-administration)
2. [User Management](#user-management)
3. [Database Operations](#database-operations)
4. [Backups & Recovery](#backups--recovery)
5. [Monitoring & Logging](#monitoring--logging)
6. [Security](#security)
7. [Troubleshooting](#troubleshooting)

## System Administration

### Accessing the Admin Panel

1. Login with admin credentials
2. Navigate to Dashboard
3. Access admin features based on your role

### Changing Admin Password

**Option 1: Through UI**
1. Login as admin
2. Go to Profile > Settings
3. Click "Change Password"
4. Enter current and new password
5. Save changes

**Option 2: Using API**
```bash
curl -X POST http://your-api-url/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@school.local"}'
```

**Option 3: Direct Database Access**
```bash
# Connect to database
psql $DATABASE_URL

# Update password (replace with bcrypt hash)
UPDATE users SET password = '$2b$10$...' WHERE email = 'admin@school.local';
```

### Managing Users

**Create New User**
```bash
curl -X POST http://your-api-url/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.local",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Assign Role to User**
```bash
curl -X POST http://your-api-url/users/{userId}/roles/{roleId} \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Environment Variable Rotation

**JWT Secret Rotation**
1. Generate new secret: `openssl rand -base64 32`
2. Update `JWT_SECRET` in environment
3. Restart API service
4. All users will need to re-login

**Database Credentials Rotation**
1. Create new database user
2. Update `DATABASE_URL`
3. Test connection
4. Restart all services
5. Remove old database user

## User Management

### Role Hierarchy

```
ADMIN
├── PRINCIPAL
│   ├── REGISTRAR
│   ├── TEACHER
│   └── ACCOUNTANT
├── STUDENT
└── PARENT
```

### Default Permissions by Role

**ADMIN**: All permissions

**PRINCIPAL**: All except user management

**REGISTRAR**: 
- Manage students
- Manage classes
- View attendance

**TEACHER**:
- View students
- Manage attendance
- Manage assessments

**ACCOUNTANT**:
- Manage fees
- Process payments
- View finance reports

### Bulk User Import

Create CSV file:
```csv
email,firstName,lastName,role
teacher1@school.local,Jane,Smith,TEACHER
teacher2@school.local,Bob,Johnson,TEACHER
```

Import script (create in `apps/api/scripts/import-users.ts`):
```typescript
// Implementation needed
```

## Database Operations

### Running Migrations

**Development**
```bash
cd apps/api
npx prisma migrate dev
```

**Production**
```bash
cd apps/api
npx prisma migrate deploy
```

### Creating New Migration

```bash
cd apps/api
npx prisma migrate dev --name add_new_field
```

### Resetting Database (Development Only)

```bash
cd apps/api
npx prisma migrate reset
npx prisma db seed
```

### Database Studio (GUI)

```bash
cd apps/api
npx prisma studio
```

Access at http://localhost:5555

## Backups & Recovery

### Automated Backups

**Using Render (Production)**
- Automatic daily backups
- 7-day retention (Starter plan)
- 30-day retention (Standard+ plan)

**Manual Backup Script** (add to `apps/api/scripts/backup.sh`):
```bash
#!/bin/bash
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR

# PostgreSQL backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

echo "Backup saved to $BACKUP_FILE.gz"
```

### Restoring from Backup

```bash
# Decompress
gunzip backup_20240101_120000.sql.gz

# Restore
psql $DATABASE_URL < backup_20240101_120000.sql
```

### File Uploads Backup

Backup uploads directory:
```bash
tar -czf uploads_backup.tar.gz apps/api/uploads/
```

Restore:
```bash
tar -xzf uploads_backup.tar.gz -C apps/api/
```

## Monitoring & Logging

### Application Logs

**View Logs (Docker)**
```bash
# API logs
docker logs sms-api -f

# Web logs
docker logs sms-web -f

# Worker logs
docker logs sms-worker -f
```

**View Logs (Render)**
1. Go to service in Render dashboard
2. Click "Logs" tab
3. Filter by severity, time range

### Health Checks

**API Health**
```bash
curl http://your-api-url/health
```

**Database Health**
```bash
curl http://your-api-url/health/ready
```

### Metrics to Monitor

1. **API Response Time**
   - Target: < 200ms for most endpoints
   - Alert: > 1000ms

2. **Database Connections**
   - Monitor connection pool usage
   - Alert: > 80% pool usage

3. **Queue Length**
   - Monitor BullMQ queue depths
   - Alert: > 1000 pending jobs

4. **Error Rate**
   - Target: < 1% error rate
   - Alert: > 5% error rate

5. **Disk Usage**
   - Monitor uploads directory
   - Alert: > 80% disk usage

### Setting Up Alerts (Render)

1. Go to service settings
2. Click "Notifications"
3. Add notification channels (email, Slack)
4. Configure alert thresholds

## Security

### Security Checklist

- [ ] Change default admin password
- [ ] Rotate JWT secret monthly
- [ ] Enable HTTPS (automatic on Render)
- [ ] Configure CORS properly
- [ ] Review audit logs weekly
- [ ] Update dependencies monthly
- [ ] Backup database daily
- [ ] Test restore procedure monthly

### Audit Logging

**View Audit Logs**
```bash
curl http://your-api-url/audit-logs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Filter by User**
```bash
curl "http://your-api-url/audit-logs?userId=USER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Filter by Action**
```bash
curl "http://your-api-url/audit-logs?action=DELETE" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Security Incident Response

1. **Detect**: Monitor logs and alerts
2. **Contain**: Disable affected accounts
3. **Investigate**: Review audit logs
4. **Remediate**: Fix vulnerability
5. **Recover**: Restore from clean backup
6. **Document**: Record incident details

### Rate Limiting

Default limits (configured in API):
- 100 requests per minute per IP
- 1000 requests per hour per user

Adjust in `apps/api/src/app.module.ts`

## Troubleshooting

### Common Issues

#### Issue: Users Cannot Login

**Symptoms**: Login fails with "Invalid credentials"

**Troubleshooting**:
1. Verify user exists in database
2. Check if account is active
3. Try password reset
4. Check JWT_SECRET is configured
5. Review API logs for errors

#### Issue: Slow Performance

**Symptoms**: Pages load slowly, API timeouts

**Troubleshooting**:
1. Check database query performance
2. Review database indexes
3. Monitor connection pool
4. Check Redis connection
5. Increase server resources

#### Issue: Email Not Sending

**Symptoms**: Notifications not delivered

**Troubleshooting**:
1. Check SMTP credentials
2. Review worker logs
3. Check queue status
4. Verify email provider status
5. Test with Mailhog (development)

#### Issue: Database Connection Errors

**Symptoms**: "Cannot connect to database"

**Troubleshooting**:
1. Verify DATABASE_URL is correct
2. Check database service is running
3. Test database credentials
4. Review connection pool settings
5. Check firewall rules

#### Issue: Migration Failures

**Symptoms**: Migration fails to run

**Troubleshooting**:
1. Check database schema state
2. Review migration SQL
3. Check database permissions
4. Manually run failed migration
5. Reset development database if needed

### Debug Mode

Enable debug logging:

**API**
```bash
# Set in .env
LOG_LEVEL=debug
```

**Worker**
```bash
# Set in .env
LOG_LEVEL=debug
```

### Getting Help

1. Check logs first
2. Review this operations guide
3. Search existing GitHub issues
4. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Relevant logs

## Maintenance Schedule

### Daily
- Monitor error logs
- Check queue health
- Review failed jobs

### Weekly
- Review audit logs
- Check disk usage
- Update security patches

### Monthly
- Database backup test
- Rotate JWT secret
- Update dependencies
- Performance review
- Security audit

### Quarterly
- Full system backup
- Disaster recovery test
- User access review
- Performance optimization
- Feature review

## Data Retention

### Database
- Student records: Indefinite
- Audit logs: 1 year
- Notifications: 90 days
- Sessions: 7 days

### Files
- Report cards: Indefinite
- Uploads: Review annually

### Cleanup Scripts

**Clean old notifications** (add to `apps/api/scripts/cleanup.ts`):
```typescript
// Delete notifications older than 90 days
await prisma.notification.deleteMany({
  where: {
    createdAt: {
      lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    }
  }
});
```

## Contact & Support

- **Technical Issues**: GitHub Issues
- **Security Issues**: security@school.local
- **General Support**: support@school.local

---

**Last Updated**: 2024
