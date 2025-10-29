# Deployment to Render

This guide walks you through deploying the School Management System to Render's cloud platform.

## Prerequisites

- GitHub account with repository access
- Render account (sign up at https://render.com)
- SMTP credentials (for email notifications)

## Step 1: Prepare Your Repository

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Verify `render.yaml` is present**
   The `render.yaml` file in the repository root defines all services and their configurations.

## Step 2: Connect to Render

1. **Log in to Render Dashboard**
   - Go to https://dashboard.render.com
   - Sign in or create an account

2. **Create New Blueprint**
   - Click "New +"
   - Select "Blueprint"
   - Connect your GitHub account if not already connected
   - Select your School Management System repository
   - Choose the branch (usually `main`)

3. **Render will auto-detect `render.yaml`**
   - Review the services that will be created:
     - PostgreSQL database
     - Redis instance
     - API web service
     - Worker service
     - Web frontend service

## Step 3: Configure Environment Variables

Render will create environment variables from `render.yaml`, but you need to set some manually:

### API Service Environment Variables

Navigate to the API service settings and add/update:

```env
# Admin Credentials (Important: Change these!)
SEED_ADMIN_EMAIL=admin@yourschool.com
SEED_ADMIN_PASSWORD=<Generate-Strong-Password>

# JWT Secrets (Use random strings, don't use the examples below)
JWT_SECRET=<Generate-Random-String-At-Least-32-Chars>
JWT_REFRESH_SECRET=<Generate-Different-Random-String>

# CORS (Your frontend URL)
CORS_ORIGIN=https://your-app-name.onrender.com

# SMTP Configuration (for production emails)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=apikey
SMTP_PASS=<Your-SendGrid-API-Key>
SMTP_FROM=noreply@yourschool.com

# SMS Provider (leave as 'log' for now, or configure Orange/MTN)
SMS_PROVIDER=log
```

### Worker Service Environment Variables

Same SMTP configuration as API service.

### Web Service Environment Variables

The `NEXT_PUBLIC_API_URL` will be automatically set to your API service URL.

## Step 4: Generate Secure Secrets

Use these commands to generate secure random strings:

```bash
# For JWT_SECRET and JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use this online: https://www.random.org/strings/
```

## Step 5: Deploy

1. **Click "Apply" or "Create Blueprint"**
   - Render will start provisioning all services
   - This may take 10-15 minutes for the first deployment

2. **Monitor deployment progress**
   - Watch the deployment logs for each service
   - Check for any errors

3. **Database migration will run automatically**
   - The API service's startup command includes:
     ```bash
     npm run prisma:deploy && npm run prisma:seed
     ```
   - This creates all database tables and seeds initial data

## Step 6: Verify Deployment

### Check Service Health

1. **API Health Check**
   ```
   https://your-api-name.onrender.com/health
   ```
   Should return: `{ "status": "ok", "timestamp": "...", "timezone": "Africa/Monrovia" }`

2. **API Readiness Check**
   ```
   https://your-api-name.onrender.com/ready
   ```
   Should return: `{ "status": "ready", "database": "connected" }`

3. **Swagger Documentation**
   ```
   https://your-api-name.onrender.com/docs
   ```

### Test Login

1. **Visit your web frontend**
   ```
   https://your-app-name.onrender.com
   ```

2. **Login with admin credentials**
   - Email: The one you set in `SEED_ADMIN_EMAIL`
   - Password: The one you set in `SEED_ADMIN_PASSWORD`

## Step 7: SMTP Configuration

### Using SendGrid (Recommended)

1. **Sign up for SendGrid**
   - Go to https://sendgrid.com
   - Create a free account (100 emails/day free tier)

2. **Create API Key**
   - Navigate to Settings → API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the API key

3. **Update Render environment variables**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=true
   SMTP_USER=apikey
   SMTP_PASS=<Your-API-Key>
   SMTP_FROM=noreply@yourschool.com
   ```

4. **Verify sender email**
   - In SendGrid, verify your sender email address
   - This is required to send emails

### Alternative SMTP Providers

- **AWS SES**: Low cost, reliable
- **Mailgun**: Developer-friendly
- **Postmark**: Transaction emails
- **Gmail**: Development only (use App Password)

## Step 8: Custom Domain (Optional)

1. **Add custom domain in Render**
   - Go to your web service settings
   - Click "Custom Domain"
   - Add your domain (e.g., `school.yourschool.com`)

2. **Configure DNS**
   - Add CNAME record pointing to Render's URL
   - Or use A record if using apex domain

3. **Update CORS_ORIGIN**
   - Update API service `CORS_ORIGIN` to your custom domain
   - Redeploy the service

## Step 9: Database Backups

### Automatic Backups

Render's managed PostgreSQL includes daily backups on paid plans.

### Manual Backup

1. **From Render Dashboard**
   - Go to your database service
   - Click "Backups"
   - Create manual backup

2. **Using pg_dump (local)**
   ```bash
   # Get connection string from Render dashboard
   pg_dump <DATABASE_URL> > backup.sql
   ```

3. **Restore from backup**
   ```bash
   psql <DATABASE_URL> < backup.sql
   ```

## Troubleshooting

### Build Failures

**Issue**: Build fails during `npm install`
- **Solution**: Check `package.json` for correct dependencies
- Verify Node version is 20+ in Dockerfile

**Issue**: Prisma migration fails
- **Solution**: Check DATABASE_URL is correctly set
- Verify database service is running

### Runtime Errors

**Issue**: API returns 500 errors
- **Solution**: Check API service logs in Render dashboard
- Verify environment variables are set correctly

**Issue**: Cannot connect to database
- **Solution**: Check DATABASE_URL format
- Verify database service is healthy

**Issue**: Emails not sending
- **Solution**: Verify SMTP credentials
- Check SMTP provider logs
- Test with worker service logs

### Performance Issues

**Issue**: Slow response times
- **Solution**: Upgrade to paid plan for better resources
- Check database query performance
- Enable Redis caching

**Issue**: Worker jobs not processing
- **Solution**: Check Redis connection
- Verify worker service is running
- Check worker logs for errors

## Updating the Deployment

### Via Git Push

1. **Make changes locally**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Render auto-deploys**
   - Render watches the `main` branch
   - Automatic deployment on push
   - Monitor in dashboard

### Manual Deploy

1. **Go to service in Render dashboard**
2. **Click "Manual Deploy"**
3. **Select "Clear build cache & deploy"** if needed

## Monitoring

### Render Dashboard

- View real-time logs
- Monitor resource usage
- Check deployment history
- View metrics (CPU, memory)

### Health Checks

Set up external monitoring:
- Pingdom
- UptimeRobot
- StatusCake

Monitor these endpoints:
- `https://your-api.onrender.com/health`
- `https://your-api.onrender.com/ready`

## Scaling

### Horizontal Scaling

1. **Increase instance count**
   - Go to service settings
   - Increase "Num Instances"
   - Render load balances automatically

### Vertical Scaling

1. **Upgrade service plan**
   - More CPU and RAM
   - Better for database-heavy operations

### Database Scaling

1. **Upgrade PostgreSQL plan**
   - More storage
   - Better performance
   - Connection pooling

## Cost Estimation

### Free Tier (Development)

- Web Services: Free (750 hrs/month)
- Database: Free (90 days, then $7/month)
- Redis: Free (25 MB)
- **Total**: $0-7/month

### Production (Recommended)

- Web Service (API): $7/month
- Web Service (Frontend): $7/month
- Worker: $7/month
- PostgreSQL Starter: $7/month
- Redis Starter: $7/month
- **Total**: ~$35/month

### Enterprise

- Professional plans: $25-85/service
- Dedicated instances
- SLA guarantees
- Priority support

## Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong JWT secrets (32+ characters, random)
- [ ] Enable HTTPS (automatic with Render)
- [ ] Set correct CORS origins (no wildcards in production)
- [ ] Enable Render's DDoS protection
- [ ] Set up database backups (daily minimum)
- [ ] Configure rate limiting (already in code)
- [ ] Review and test all RBAC permissions
- [ ] Set up monitoring and alerts
- [ ] Document recovery procedures
- [ ] Test password reset flow
- [ ] Verify audit logging works
- [ ] Review error messages (don't expose internals)

## Post-Deployment Tasks

1. **Create backup admin account**
   - Use API or direct database access
   - Store credentials securely

2. **Test all critical flows**
   - User registration
   - Login/logout
   - Password reset
   - Student enrollment
   - Report generation
   - Payment processing

3. **Set up monitoring**
   - Error tracking (Sentry, Rollbar)
   - Performance monitoring (New Relic, DataDog)
   - Uptime monitoring

4. **Documentation**
   - Document any custom configurations
   - Record admin procedures
   - Create runbooks for common issues

5. **Train users**
   - Admin training
   - Teacher training
   - Create user guides

## Support Resources

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Prisma Docs: https://www.prisma.io/docs
- NestJS Docs: https://docs.nestjs.com
- Next.js Docs: https://nextjs.org/docs

## Emergency Procedures

### Service Down

1. Check Render status page
2. Review service logs
3. Check recent deployments
4. Rollback if needed

### Database Issues

1. Check database service status
2. Review connection limits
3. Check for long-running queries
4. Consider scaling up

### Data Loss Prevention

1. Regular backups (automated)
2. Test restore procedures
3. Keep local development database synced
4. Document critical data

---

**Need Help?** Check the logs first, then consult this guide, then reach out to Render support.
