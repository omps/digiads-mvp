# Podman Desktop Local Setup Guide for DigiAds MVP

This guide will help you set up the complete DigiAds MVP using Podman Desktop on your local machine.

## Prerequisites

- **Podman Desktop** installed ([Download](https://podman-desktop.io/downloads))
- **Docker Compose** CLI tool (comes with Podman Desktop)
- **Git** installed
- **At least 8GB RAM** recommended for running all services
- **At least 20GB disk space** for images and volumes

## Step-by-Step Setup

### Step 1: Install Podman Desktop

1. Download Podman Desktop from [podman-desktop.io](https://podman-desktop.io/downloads)
2. Install based on your OS (Windows, Mac, or Linux)
3. Launch Podman Desktop
4. Initialize the Podman machine:
   - On first launch, Podman Desktop will prompt you to set up a machine
   - Click "Create new Podman machine" or "Start" if one exists
   - For Windows/Mac: Choose at least 4 CPUs and 6GB RAM

### Step 2: Clone the Repository

```bash
git clone https://github.com/omps/digiads-mvp.git
cd digiads-mvp
```

### Step 3: Prepare Environment Files

```bash
# Copy environment file
cp .env.example .env

# Generate a new JWT secret (on macOS/Linux)
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env

# On Windows PowerShell:
# $secret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -Count 32 | ForEach-Object {[char]$_})))
# "JWT_SECRET=$secret" | Add-Content .env
```

### Step 4: Create Service Configuration Files

Create configuration files for each service inside their respective directories:

**User/config/development.json:**
```json
{
  "mysql": {
    "host": "mysql",
    "port": 3306,
    "user": "socioboard_user",
    "password": "socioboard_pass_123",
    "database": "socioboard_mvp"
  },
  "jwt": {
    "secret": "your_jwt_secret_here",
    "expiresIn": "7d"
  },
  "port": 3000
}
```

**Publish/config/development.json:**
```json
{
  "mysql": {
    "host": "mysql",
    "port": 3306,
    "user": "socioboard_user",
    "password": "socioboard_pass_123",
    "database": "socioboard_mvp"
  },
  "port": 3001,
  "userServiceUrl": "http://user-service:3000"
}
```

**Feeds/config/development.json:**
```json
{
  "mongodb": {
    "uri": "mongodb://admin:admin_pass_123@mongodb:27017/socioboard_feeds?authSource=admin"
  },
  "redis": {
    "url": "redis://redis:6379"
  },
  "port": 3002
}
```

**Notification/config/development.json:**
```json
{
  "mongodb": {
    "uri": "mongodb://admin:admin_pass_123@mongodb:27017/socioboard_notifications?authSource=admin"
  },
  "redis": {
    "url": "redis://redis:6379"
  },
  "smtp": {
    "host": "mailhog",
    "port": 1025,
    "secure": false
  },
  "port": 3003
}
```

### Step 5: Build Container Images

**Option A: Using Podman CLI**

```bash
# Build all service images
podman build -f Dockerfile.user -t digiads-user-service .
podman build -f Dockerfile.publish -t digiads-publish-service .
podman build -f Dockerfile.feeds -t digiads-feeds-service .
podman build -f Dockerfile.notification -t digiads-notification-service .
```

**Option B: Using Docker Compose (Recommended)**

```bash
# Use podman-compose
podman-compose build
```

If `podman-compose` is not available, install it:
```bash
pip install podman-compose
```

### Step 6: Start All Services

**Using Podman Compose:**

```bash
# Start all services in the background
podman-compose up -d

# Or with logs in foreground (Ctrl+C to exit)
podman-compose up
```

**Verify containers are running:**

```bash
podman-compose ps

# Or using podman directly
podman ps
```

### Step 7: Access Services and Dashboards

Once all containers are running, access them via:

**API Services:**
- User Service: http://localhost:3000
- Publish Service: http://localhost:3001
- Feeds Service: http://localhost:3002
- Notification Service: http://localhost:3003

**API Documentation (Swagger):**
- User Service Docs: http://localhost:3000/api-docs
- Publish Service Docs: http://localhost:3001/api-docs
- Feeds Service Docs: http://localhost:3002/api-docs
- Notification Service Docs: http://localhost:3003/api-docs

**Database Management Tools:**
- Adminer (MySQL): http://localhost:8080
  - Server: `mysql`
  - Username: `socioboard_user`
  - Password: `socioboard_pass_123`
  - Database: `socioboard_mvp`

- MongoDB Express: http://localhost:8081
  - Username: `admin`
  - Password: `admin_pass_123`

- MailHog (Email Testing): http://localhost:8025

## Using Podman Desktop GUI

### Viewing Containers

1. Open Podman Desktop
2. Navigate to **Containers** tab
3. You'll see all running containers:
   - `digiads-mysql`
   - `digiads-mongodb`
   - `digiads-redis`
   - `digiads-user-service`
   - `digiads-publish-service`
   - `digiads-feeds-service`
   - `digiads-notification-service`
   - `digiads-mailhog`
   - `digiads-adminer`
   - `digiads-mongo-express`

### Managing Services

- **Start**: Right-click on container → Start
- **Stop**: Right-click on container → Stop
- **Logs**: Click on container → Logs tab
- **Terminal**: Click on container → Terminal tab
- **Inspect**: Click on container → Inspect tab

### Viewing Volumes

1. Navigate to **Volumes** tab
2. See volumes for MySQL, MongoDB, and Redis data

## Useful Commands

### View Logs

```bash
# All services
podman-compose logs

# Specific service
podman-compose logs user-service
podman-compose logs -f user-service  # Follow logs

# From specific time
podman-compose logs --tail=100 user-service
```

### Stop All Services

```bash
podman-compose down

# With volume cleanup
podman-compose down -v
```

### Restart a Service

```bash
podman-compose restart user-service
```

### Execute Command in Container

```bash
# Access service terminal
podman-compose exec user-service sh

# Run command
podman-compose exec mysql mysql -u root -p socioboard_mvp -e "SHOW TABLES;"
```

### View Service Logs in Real-Time

```bash
podman-compose logs -f
```

### Rebuild Services

```bash
# Rebuild all
podman-compose build --no-cache

# Rebuild specific service
podman-compose build --no-cache user-service

# Rebuild and start
podman-compose up -d --build
```

## Troubleshooting

### Services won't start

1. Check Podman machine status:
   ```bash
   podman machine ls
   podman machine start  # If not running
   ```

2. Check container logs:
   ```bash
   podman-compose logs service-name
   ```

3. Verify port availability:
   ```bash
   # On Linux/Mac
   lsof -i :3000
   
   # On Windows PowerShell
   Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
   ```

### Database connection issues

```bash
# Test MySQL connection
podman-compose exec mysql mysql -h localhost -u socioboard_user -p socioboard_pass_123 -e "SELECT 1;"

# Test MongoDB connection
podman-compose exec mongodb mongosh "mongodb://admin:admin_pass_123@localhost:27017/admin?authSource=admin" --eval "db.adminCommand('ping')"
```

### Memory issues

Increase Podman machine memory:

```bash
# Stop machine
podman machine stop

# Update machine with more resources
podman machine set --memory 8192 --cpus 4

# Restart
podman machine start
```

### Rebuild from scratch

```bash
# Remove all containers and volumes
podman-compose down -v

# Remove unused images
podman image prune -a

# Rebuild
podman-compose build --no-cache

# Start fresh
podman-compose up -d
```

## Development Workflow

### Live Code Changes

Services are configured with volume mounts for live development:

```bash
# Changes in ./User directory will reflect in the container
# Service will restart automatically (if configured with nodemon)
```

### Adding Dependencies

```bash
# Install in service container
podman-compose exec user-service npm install package-name

# Update package.json and reinstall
podman-compose rebuild user-service
```

### Database Migrations

```bash
# Run migrations
podman-compose exec user-service npm run db:migrate

# Create migration
podman-compose exec user-service npx sequelize-cli migration:generate --name add_new_column
```

## Performance Optimization

### Resource Allocation

```bash
# Check current allocation
podman machine inspect

# Recommended settings for development
podman machine set --cpus 4 --memory 8192 --disk-size 100
```

### Prune Unused Resources

```bash
# Remove unused containers
podman container prune

# Remove unused images
podman image prune

# Remove unused volumes
podman volume prune

# Complete cleanup
podman system prune -a
```

## Production Considerations

This setup is for **local development only**. For production:

1. Use strong, unique passwords
2. Enable SSL/TLS for all connections
3. Use external database services (AWS RDS, Google Cloud SQL)
4. Implement proper logging and monitoring
5. Set up CI/CD pipelines
6. Use container orchestration (Kubernetes)
7. Configure backup and disaster recovery

## Next Steps

1. Verify all services are running
2. Test API endpoints using Swagger UI
3. Populate sample data via API
4. Begin front-end development
5. Integrate with social media APIs
6. Set up CI/CD pipeline

## Support & Resources

- [Podman Desktop Documentation](https://podman-desktop.io/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)

## Cheat Sheet

```bash
# Start all services
podman-compose up -d

# Stop all services
podman-compose down

# View running services
podman-compose ps

# View logs for all services
podman-compose logs -f

# View logs for specific service
podman-compose logs -f user-service

# Access service shell
podman-compose exec user-service sh

# Rebuild all services
podman-compose build --no-cache

# Remove all containers and volumes
podman-compose down -v

# Check resource usage
podman stats
```

---

**Last Updated**: 2024
**Podman Desktop Version**: 1.0+
**Docker Compose Version**: 2.0+
