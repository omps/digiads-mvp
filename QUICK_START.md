# Quick Start Guide - Podman Setup

## 5-Minute Setup

### Prerequisites Check

```bash
# Verify Podman is installed and running
podman --version
podman machine ls  # Should show a running machine

# Verify Docker Compose
podman-compose --version
```

### Quick Start Steps

```bash
# 1. Clone repository (if not already cloned)
git clone https://github.com/omps/digiads-mvp.git
cd digiads-mvp

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
podman-compose up -d

# 4. Wait for services to be healthy (30-60 seconds)
podman-compose ps

# 5. Verify services are running
curl http://localhost:3000/health
curl http://localhost:3001/health
```

### Access Your Services

| Service | URL | Purpose |
|---------|-----|----------|
| User Service | http://localhost:3000 | Authentication & Management |
| User Service Docs | http://localhost:3000/api-docs | API Documentation |
| Publish Service | http://localhost:3001 | Social Media Publishing |
| Publish Service Docs | http://localhost:3001/api-docs | API Documentation |
| Feeds Service | http://localhost:3002 | Feed Aggregation |
| Feeds Service Docs | http://localhost:3002/api-docs | API Documentation |
| Notification Service | http://localhost:3003 | Real-time Notifications |
| Notification Service Docs | http://localhost:3003/api-docs | API Documentation |
| Adminer (MySQL) | http://localhost:8080 | Database Management |
| MongoDB Express | http://localhost:8081 | MongoDB Management |
| MailHog | http://localhost:8025 | Email Testing |

### Test the Setup

```bash
# Check all services are running
podman-compose ps

# View logs
podman-compose logs -f

# Test User Service endpoint
curl -X GET http://localhost:3000/api/users/health

# Create a test user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### Stop Services

```bash
# Stop all services (containers stay)
podman-compose stop

# Start services again
podman-compose start

# Stop and remove all containers
podman-compose down

# Stop all and remove volumes (clean slate)
podman-compose down -v
```

### Common Issues & Quick Fixes

**Services won't start:**
```bash
# Restart Podman machine
podman machine stop
podman machine start
```

**Port already in use:**
```bash
# Find what's using the port
lsof -i :3000  # or your port number

# Stop that process or use a different port
```

**Database connection failed:**
```bash
# Ensure database is healthy
podman-compose logs mysql
podman-compose logs mongodb

# Restart database
podman-compose restart mysql
```

**Out of memory:**
```bash
# Increase Podman machine memory
podman machine stop
podman machine set --memory 8192
podman machine start
```

## Next Steps

1. ✅ All services are running
2. 📚 Read the full setup guide: `PODMAN_SETUP.md`
3. 🔌 Integrate social media APIs
4. 🎨 Build your frontend
5. 🚀 Deploy to production

## Useful Commands

```bash
# View real-time logs
podman-compose logs -f

# Access service terminal
podman-compose exec user-service sh

# Run service commands
podman-compose exec user-service npm run db:migrate

# Rebuild a service
podman-compose build --no-cache user-service

# Check resource usage
podman stats
```

## Database Credentials (Development Only)

**MySQL:**
- Host: `mysql` (from containers) or `localhost:3306` (from host)
- User: `socioboard_user`
- Password: `socioboard_pass_123`
- Database: `socioboard_mvp`

**MongoDB:**
- URI: `mongodb://admin:admin_pass_123@localhost:27017/`
- Admin Username: `admin`
- Admin Password: `admin_pass_123`

**Redis:**
- Host: `localhost`
- Port: `6379`

---

**Need help?** See `PODMAN_SETUP.md` for detailed troubleshooting and advanced usage.
