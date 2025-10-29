# Deploying to Render

This guide walks you through deploying the School Management System to Render.com.

## Prerequisites

- A Render account (sign up at https://render.com)
- This repository pushed to GitHub
- SMTP credentials (e.g., SendGrid, Mailgun, or Amazon SES)

## Deployment Steps

### 1. Fork/Push Repository

Ensure your code is in a GitHub repository that Render can access.

### 2. Create New Blueprint

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Select the branch to deploy (usually `main`)

### 3. Configure Environment Variables

Render will read `render.yaml` and create all services automatically. However, you need to set some sensitive variables manually:

#### API Service Variables

In the Render dashboard, go to the `school-api` service and set:

- `SEED_ADMIN_PASSWORD` - Set a strong password for the admin account
- `SMTP_HOST` - Your SMTP server hostname
- `SMTP_USER` - Your SMTP username
- `SMTP_PASSWORD` - Your SMTP password

#### Worker Service Variables

In the `school-worker` service, set the same SMTP variables:

- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASSWORD`

### 4. Deploy

Click "Apply" to deploy all services. Render will:

1. Create a PostgreSQL database
2. Create a Redis instance
3. Build and deploy the API service
4. Build and deploy the Web service
5. Build and deploy the Worker service

### 5. Run Database Migrations

The API service is configured to run migrations automatically on startup via the `startCommand` in `render.yaml`:

```bash
npx prisma migrate deploy && npx prisma db seed && npm start
```

### 6. Access Your Application

Once deployed, Render will provide URLs for your services:

- **Web App**: `https://school-web-xxx.onrender.com`
- **API**: `https://school-api-xxx.onrender.com`
- **API Docs**: `https://school-api-xxx.onrender.com/docs`

## Post-Deployment

### 1. Update Web Environment

Update the `NEXT_PUBLIC_API_URL` in the web service to point to your API URL:

```
NEXT_PUBLIC_API_URL=https://school-api-xxx.onrender.com
```

### 2. Log In

Visit your web app URL and log in with:

```
Email: admin@school.local
Password: [your SEED_ADMIN_PASSWORD]
```

### 3. Change Admin Email (Optional)

You can update the admin email in the Render dashboard by changing `SEED_ADMIN_EMAIL` and redeploying.

## Scaling

### Database

To scale your database:

1. Go to the `school-db` service in Render
2. Upgrade the plan (Starter → Standard → Pro)
3. Consider enabling connection pooling for better performance

### Web/API Services

To handle more traffic:

1. Upgrade service plans (Starter → Standard → Pro)
2. Enable auto-scaling if available on your plan
3. Consider horizontal scaling for the worker

### Redis

To scale Redis:

1. Upgrade the Redis plan in Render
2. Monitor memory usage in the Render dashboard

## Monitoring

### Logs

View logs in the Render dashboard:

1. Select a service
2. Click "Logs" tab
3. Filter by time range and severity

### Health Checks

Render automatically monitors health endpoints:

- API: `GET /health` and `GET /ready`

Configure alerts in the Render dashboard for downtime notifications.

### Metrics

Monitor key metrics in Render dashboard:

- CPU usage
- Memory usage
- Request rates
- Response times

## Troubleshooting

### Database Connection Issues

If the API can't connect to the database:

1. Check `DATABASE_URL` is correctly set
2. Verify the database is running
3. Check database logs for connection errors

### Migration Failures

If migrations fail on deployment:

1. SSH into the API service (if available on your plan)
2. Run migrations manually:
   ```bash
   npx prisma migrate deploy
   ```
3. Check migration status:
   ```bash
   npx prisma migrate status
   ```

### Email Not Sending

If emails aren't being sent:

1. Verify SMTP credentials are correct
2. Check Mailhog (dev) or SMTP provider dashboard
3. Review worker logs for email job failures
4. Test SMTP connection manually

### Worker Not Processing Jobs

If background jobs aren't running:

1. Check worker logs in Render dashboard
2. Verify Redis connection
3. Ensure worker service is running
4. Check Redis memory usage

## Custom Domain

To use a custom domain:

1. Go to your web service in Render
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `school.example.com`)
4. Update your DNS records as instructed
5. Wait for SSL certificate provisioning

## Backups

### Database Backups

Render automatically backs up PostgreSQL databases on paid plans. To create manual backups:

1. Go to `school-db` service
2. Click "Backups" tab
3. Click "Create Backup"

To restore:

1. Click on a backup
2. Click "Restore"
3. Confirm restoration

### File Backups

For uploaded files (report cards, etc.):

1. Configure persistent disk in `render.yaml` (not included by default)
2. Or use external storage (S3, Cloudinary)

## Cost Optimization

### Free Tier

Render offers free tiers for:

- PostgreSQL (90-day limit)
- Redis (limited)
- Web services (spin down after inactivity)

### Paid Plans

Optimize costs:

1. Start with Starter plans ($7-15/month each)
2. Scale up only when needed
3. Use single database for all environments
4. Monitor usage in billing dashboard

## Security

### Secrets Rotation

Rotate secrets regularly:

1. Generate new JWT secrets
2. Update in Render dashboard
3. Restart API service

### SSL/TLS

Render automatically provisions SSL certificates for all services.

### IP Allowlisting

For database access:

1. Go to database settings
2. Add allowed IP addresses
3. Save changes

## Support

For Render-specific issues:

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Render Support: support@render.com

For application issues:

- Open an issue on GitHub
- Check application logs
- Review API documentation
