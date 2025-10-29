# Deploying to Render.com

This guide walks you through deploying the School Management System to Render.com for production use.

## Prerequisites

- GitHub account with repository access
- Render.com account (free tier available)
- SMTP credentials for email (optional but recommended)

## Step 1: Prepare Your Repository

1. Fork or push this repository to your GitHub account
2. Ensure the `render.yaml` file is in the root directory

## Step 2: Connect to Render

1. Log in to [Render.com](https://render.com)
2. Click "New +" and select "Blueprint"
3. Connect your GitHub account if not already connected
4. Select your School Management System repository
5. Give your blueprint a name (e.g., "School-Management-System")

## Step 3: Configure Environment Variables

Render will automatically create services based on `render.yaml`. You need to set these environment variables:

### Required Variables

1. **JWT_SECRET** (auto-generated) - Keep this secure
2. **SEED_ADMIN_PASSWORD** (auto-generated) - Save this for first login
3. **SMTP Configuration** (optional for production emails):
   - `SMTP_HOST` - Your SMTP server
   - `SMTP_PORT` - Usually 587 for TLS
   - `SMTP_USER` - SMTP username
   - `SMTP_PASSWORD` - SMTP password
   - `SMTP_FROM` - Email sender address

### Optional Variables

- `SCHOOL_NAME` - Your school's name
- `CURRENCY` - Default: LRD
- `TZ` - Default: Africa/Monrovia

## Step 4: Review Services

Render will create these services:

1. **PostgreSQL Database** (sms-postgres)
   - Managed PostgreSQL instance
   - Plan: Starter ($7/month) or Free

2. **Redis** (sms-redis)
   - Managed Redis instance
   - Plan: Starter ($7/month)

3. **API Service** (sms-api)
   - NestJS backend
   - Plan: Starter ($7/month) or Free
   - Health check: `/health/ready`

4. **Web Service** (sms-web)
   - Next.js frontend
   - Plan: Starter ($7/month) or Free

5. **Worker Service** (sms-worker)
   - Background job processor
   - Plan: Starter ($7/month)

**Total Cost**: Free tier available, or ~$35/month for production setup

## Step 5: Deploy

1. Click "Apply" to create all services
2. Render will:
   - Create databases (PostgreSQL and Redis)
   - Build Docker images for each service
   - Deploy services
   - Run database migrations and seed

3. Monitor deployment in Render dashboard
4. First deployment takes ~10-15 minutes

## Step 6: Access Your Application

Once deployed:

1. Find your web service URL in Render dashboard (e.g., `https://sms-web.onrender.com`)
2. Visit the URL to access your application
3. Login with:
   - Email: `admin@school.local`
   - Password: Check the `SEED_ADMIN_PASSWORD` in API service environment variables

## Step 7: Configure SMTP (Optional)

For production email notifications:

### Using Gmail

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Set environment variables:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM=your-email@gmail.com
   ```

### Using SendGrid

1. Create a SendGrid account
2. Generate an API key
3. Set environment variables:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   SMTP_FROM=verified-sender@yourdomain.com
   ```

## Step 8: Custom Domain (Optional)

1. In Render dashboard, go to your web service
2. Click "Settings" > "Custom Domain"
3. Add your domain (e.g., `school.example.com`)
4. Update DNS records as instructed
5. Render will automatically provision SSL certificate

## Troubleshooting

### Build Failures

- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (20.x)

### Database Connection Issues

- Verify `DATABASE_URL` is set correctly (auto-injected by Render)
- Check database service is running
- Review API service logs

### Migration Failures

- Check if database is accessible
- Review migration files in `apps/api/prisma/migrations`
- Manually run migrations:
  ```bash
  cd apps/api
  npx prisma migrate deploy
  ```

### Service Not Starting

- Check service logs in Render dashboard
- Verify all required environment variables are set
- Check health check endpoint is responding

## Monitoring

Render provides:
- Service logs
- Metrics (CPU, memory, network)
- Alerts
- Custom health checks

Access these in the Render dashboard for each service.

## Scaling

### Horizontal Scaling

1. Go to service settings
2. Adjust instance count
3. Render handles load balancing automatically

### Vertical Scaling

1. Upgrade service plan for more resources
2. Plans available: Free, Starter, Standard, Pro

## Backups

### Database Backups

Render automatically backs up PostgreSQL databases:
- Free tier: Manual backups only
- Paid tiers: Daily automatic backups
- Retention: 7 days (Starter), 30 days (Standard+)

### Manual Backup

```bash
# Using Render CLI
render pg-dump sms-postgres > backup.sql

# Restore
render pg-restore sms-postgres < backup.sql
```

## Updates and Redeployment

### Automatic Deployments

1. Configure auto-deploy in Render dashboard
2. Push to your main branch
3. Render automatically builds and deploys

### Manual Deployment

1. Go to service in Render dashboard
2. Click "Manual Deploy" > "Deploy latest commit"
3. Select branch
4. Render builds and deploys

## Cost Optimization

### Free Tier

- PostgreSQL: Free (expires after 90 days)
- Web/API: Free (spins down after inactivity)
- Worker: Not available on free tier

### Production Recommendations

- PostgreSQL: Starter plan ($7/month)
- Redis: Starter plan ($7/month)
- API: Starter plan ($7/month)
- Web: Starter plan ($7/month)
- Worker: Starter plan ($7/month)

**Total**: ~$35/month for production-ready setup

## Security Best Practices

1. **Rotate JWT_SECRET regularly**
   - Generate new secret
   - Update in Render environment variables
   - Restart API service

2. **Use strong admin password**
   - Change default password after first login
   - Use password reset flow

3. **Enable Render IP allowlist** (paid plans)
   - Restrict database access to Render services only

4. **Monitor audit logs**
   - Review security events regularly
   - Set up alerts for suspicious activity

5. **Keep dependencies updated**
   - Regular security updates
   - Monitor Dependabot alerts

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Project Issues: GitHub Issues

## Alternative: Manual Render Setup

If you prefer not to use Blueprint:

1. Create services manually:
   - New PostgreSQL database
   - New Redis instance
   - New Web Service (for API)
   - New Web Service (for Web)
   - New Background Worker (for Worker)

2. Set build and start commands:
   - API: See `render.yaml` for commands
   - Web: See `render.yaml` for commands
   - Worker: See `render.yaml` for commands

3. Configure environment variables as listed above

4. Deploy each service

This gives you more control but requires more setup time.
