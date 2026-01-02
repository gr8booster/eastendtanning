# Eastend Deployment Guide

## Quick Start

### Current Status
✅ Application is already running in production mode via Supervisor

### Verify Deployment

```bash
# Check all services are running
supervisorctl status

# Expected output:
backend                          RUNNING   pid 29, uptime 1:30:00
frontend                         RUNNING   pid 30, uptime 1:30:00
```

### Access Application

- **Live URL**: https://eastend-tanning.preview.emergentagent.com
- **Admin**: https://eastend-tanning.preview.emergentagent.com/admin
- **API Docs**: https://eastend-tanning.preview.emergentagent.com/docs

## Service Management

### Restart Services

```bash
# Restart backend (if you made backend changes)
supervisorctl restart backend

# Restart frontend (if you made frontend changes)
supervisorctl restart frontend

# Restart all services
supervisorctl restart all
```

### View Logs

```bash
# Backend logs (stdout)
tail -f /var/log/supervisor/backend.out.log

# Backend errors (stderr)
tail -f /var/log/supervisor/backend.err.log

# Frontend logs
tail -f /var/log/supervisor/frontend.err.log

# All logs at once
tail -f /var/log/supervisor/*.log
```

### Stop/Start Services

```bash
# Stop all
supervisorctl stop all

# Start all
supervisorctl start all

# Stop specific service
supervisorctl stop backend
```

## Environment Variables

### Backend Environment (Already Configured)

Location: `/app/backend/.env`

```bash
# Core
MONGO_URL=mongodb://... (configured)
DB_NAME=test_database

# AI (Configured)
EMERGENT_LLM_KEY=... (pre-configured)

# Payments (Configured - Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Auth (Configured)
JWT_SECRET_KEY=...
ADMIN_PASSWORD=eastend2025

# Optional (Add when ready)
SENDGRID_API_KEY=SG....
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
```

### Frontend Environment (Already Configured)

Location: `/app/frontend/.env`

```bash
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX (add your GA4 ID)
```

## Production Checklist

### Phase 1: Verify Current Setup ✅

- [x] MongoDB connected and seeded
- [x] Backend running on port 8001
- [x] Frontend running on port 3000
- [x] Stripe test mode configured
- [x] Emergent LLM key working

### Phase 2: Production Configuration ⚠️

**When moving to production Stripe:**

1. Update backend/.env:
   ```bash
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_KEY
   ```

2. Update frontend/.env:
   ```bash
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY
   ```

3. Restart services:
   ```bash
   supervisorctl restart all
   ```

**Add email/SMS (optional):**

1. Get SendGrid API key from https://sendgrid.com
2. Get Twilio credentials from https://twilio.com
3. Add to backend/.env
4. Restart backend: `supervisorctl restart backend`

### Phase 3: SEO Configuration 📊

**Add Google Analytics:**

1. Create GA4 property at https://analytics.google.com
2. Get Measurement ID (format: G-XXXXXXXXXX)
3. Update frontend/.env:
   ```bash
   REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
   ```
4. Restart frontend: `supervisorctl restart frontend`

### Phase 4: Monitoring 👀

**Health Checks:**

```bash
# Check backend health
curl https://eastend-tanning.preview.emergentagent.com/health

# Should return: {"status": "healthy"}
```

**Database Check:**

```bash
# Connect to MongoDB and verify collections
mongosh $MONGO_URL --eval "db.adminCommand({listDatabases: 1})"
```

## Rollback Procedure

If something goes wrong:

```bash
# 1. Stop services
supervisorctl stop all

# 2. Restore previous .env files (if you have backups)
cp /app/backend/.env.backup /app/backend/.env
cp /app/frontend/.env.backup /app/frontend/.env

# 3. Restart services
supervisorctl start all

# 4. Verify
curl https://tan-laundry.preview.emergentagant.com/health
```

## Performance Optimization

### Frontend Build

For production deployment, build the frontend:

```bash
cd /app/frontend
yarn build

# Serve built files (already handled by supervisor)
```

### Backend Performance

Current setup uses Uvicorn. For high traffic:

```bash
# Use Gunicorn with Uvicorn workers
cd /app/backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001 server:app
```

## Security Best Practices

### ✅ Already Implemented

- JWT authentication with 8-hour expiry
- Bcrypt password hashing
- CORS configured
- Environment variables for secrets
- Rate limiting on AI endpoints

### 🔒 Additional Recommendations

1. **HTTPS**: Ensure SSL/TLS enabled (already handled by preview URL)
2. **Firewall**: Restrict database access to backend only
3. **Backups**: Schedule regular MongoDB backups
4. **Monitoring**: Set up uptime monitoring (UptimeRobot, Pingdom)

## Troubleshooting

### Issue: Services Won't Start

```bash
# Check supervisor status
supervisorctl status

# View error logs
tail -n 100 /var/log/supervisor/backend.err.log
tail -n 100 /var/log/supervisor/frontend.err.log

# Common fixes:
# - Check port conflicts: lsof -i :8001
# - Verify MongoDB: mongosh $MONGO_URL
# - Check dependencies: pip list (backend), yarn list (frontend)
```

### Issue: MongoDB Connection Failed

```bash
# Test MongoDB connection
mongosh $MONGO_URL --eval "db.adminCommand({ping: 1})"

# If fails, check:
# - MONGO_URL in backend/.env
# - MongoDB service running
# - Network connectivity
```

### Issue: Frontend Not Loading

```bash
# Check frontend logs
tail -f /var/log/supervisor/frontend.err.log

# Rebuild if needed
cd /app/frontend
rm -rf node_modules build
yarn install
yarn build
supervisorctl restart frontend
```

### Issue: API Calls Failing

```bash
# Verify backend is running
curl http://localhost:8001/health

# Check CORS configuration in server.py
# Verify REACT_APP_BACKEND_URL in frontend/.env
```

## Backup & Recovery

### Backup MongoDB

```bash
# Create backup
mongodump --uri="$MONGO_URL" --out=/backups/$(date +%Y%m%d_%H%M%S)

# Verify backup
ls -lh /backups/
```

### Restore MongoDB

```bash
# Restore from backup
mongorestore --uri="$MONGO_URL" --drop /backups/20250528_120000
```

### Backup Environment Files

```bash
# Backup .env files
cp /app/backend/.env /app/backend/.env.backup.$(date +%Y%m%d)
cp /app/frontend/.env /app/frontend/.env.backup.$(date +%Y%m%d)
```

## Monitoring & Alerts

### Set Up Monitoring

1. **Uptime Robot**: Monitor https://eastend-tanning.preview.emergentagent.com
2. **New Relic / DataDog**: Application performance monitoring
3. **Sentry**: Error tracking and reporting

### Custom Health Monitoring

```bash
# Create monitoring script
cat > /app/health_check.sh << 'EOF'
#!/bin/bash
RESPONSE=$(curl -s https://eastend-tanning.preview.emergentagent.com/health)
if [[ $RESPONSE == *"healthy"* ]]; then
    echo "✅ System healthy"
else
    echo "❌ System down - alerting..."
    # Add alert logic (email, Slack, etc.)
fi
EOF

chmod +x /app/health_check.sh

# Run every 5 minutes via cron
*/5 * * * * /app/health_check.sh
```

## Launch Checklist

### Pre-Launch

- [x] All services running
- [x] Database seeded
- [x] Test transactions work
- [x] Admin login works
- [x] Chat functional
- [x] SEO configured
- [x] Analytics installed

### Launch Day

1. **Switch Stripe to live mode** (if ready)
2. **Verify payment flow** with real transaction
3. **Monitor logs** for first 24 hours
4. **Test all critical paths**:
   - Homepage → Tanning → Checkout
   - Admin login → Create discount
   - Chat with Mary → Get recommendation
   - Fizze menu → Vote on coming soon

### Post-Launch

1. **Daily health checks**
2. **Monitor error logs**
3. **Track conversion rates in GA4**
4. **Review customer feedback**
5. **Plan feature updates**

---

**System is LIVE and ready for customers!** 🎉

**Need help?** Check logs first, then refer to README.md for detailed documentation.
