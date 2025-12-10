# Docker & Podman Setup Guide for DigiAds MVP

## Quick Start with Podman

### Prerequisites
- **Podman Desktop** installed ([download](https://podman-desktop.io/downloads))
- **Git** for cloning the repository
- **podman-compose** installed

### Installation Steps

#### 1. Install Podman Compose (if not already installed)

**macOS:**
```bash
brew install podman-compose
```

**Linux:**
```bash
pip3 install podman-compose
```

**Windows (via WSL):**
```bash
pip3 install podman-compose
```

#### 2. Clone the Repository

```bash
git clone https://github.com/omps/digiads-mvp.git
cd digiads-mvp
```

#### 3. Create Environment File

```bash
cp .env.example .env

# Generate JWT Secret
# Linux/macOS:
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env

# Windows PowerShell:
# $secret = [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Min 0 -Max 256) }))
# Add-Content .env "JWT_SECRET=$secret"
```

#### 4. Copy Service Configuration Files

```bash
# Create config files from examples
cp User/config/development.json.example User/config/development.json
cp Publish/config/development.json.example Publish/config/development.json
cp Feeds/config/development.json.example Feeds/config/development.json
cp Notification/config/development.json.example Notification/config/development.json
```

#### 5. Build Docker Images

```bash
# Build all service images
podman-compose build

# Or build a specific service
podman-compose build user-service
```

**Expected Output:**
```
Building user-service
Building publish-service
Building feeds-service
Building notification-service
✓ Successfully tagged digiads-mvp_user-service:latest
✓ Successfully tagged digiads-mvp_publish-service:latest
✓ Successfully tagged digiads-mvp_feeds-service:latest
✓ Successfully tagged digiads-mvp_notification-service:latest
```

#### 6. Start All Services

```bash
# Start production environment
podman-compose up -d

# Or start development environment with hot-reload
podman-compose -f docker-compose.dev.yml up -d
```

#### 7. Verify Services Are Running

```bash
# Check all containers
podman-compose ps

# Expected output:
CONTAINER ID  IMAGE                               COMMAND             CREATED     STATUS
...           digiads-mvp_user-service:latest     node src/app.js     2 min ago   Up 2 min
...           digiads-mvp_publish-service:latest  node src/app.js     2 min ago   Up 2 min
...           digiads-mvp_feeds-service:latest    node src/app.js     2 min ago   Up 2 min
...           digiads-mvp_notification-service    node src/app.js     2 min ago   Up 2 min
...           mysql:8.0                           mysqld              2 min ago   Up 2 min
...           mongo:6.0                           mongod              2 min ago   Up 2 min
...           redis:7-alpine                      redis-server        2 min ago   Up 2 min
```

## Service Endpoints

| Service | Endpoint | Documentation |
|---------|----------|---------------|
| User Service | http://localhost:3000 | http://localhost:3000/api-docs |
| Publish Service | http://localhost:3001 | http://localhost:3001/api-docs |
| Feeds Service | http://localhost:3002 | http://localhost:3002/api-docs |
| Notification Service | http://localhost:3003 | http://localhost:3003/api-docs |
| MySQL Admin (Adminer) | http://localhost:8080 | - |
| MongoDB Admin | http://localhost:8081 | - |
| Email Testing (MailHog) | http://localhost:8025 | - |

## Database Credentials

### MySQL
- **Host:** localhost:3306
- **User:** socioboard_user
- **Password:** socioboard_pass_123
- **Database:** socioboard_mvp

### MongoDB
- **Connection String:** mongodb://admin:admin_pass_123@localhost:27017/
- **Username:** admin
- **Password:** admin_pass_123

### Redis
- **Connection String:** redis://localhost:6379

## Common Commands

### Viewing Logs

```bash
# View logs for all services
podman-compose logs -f

# View logs for a specific service
podman-compose logs -f user-service

# View last 50 lines
podman-compose logs --tail 50
```

### Accessing Service Shell

```bash
# Access user service shell
podman-compose exec user-service sh

# Access MySQL shell
podman-compose exec mysql mysql -u socioboard_user -p socioboard_mvp

# Access MongoDB shell
podman-compose exec mongodb mongosh -u admin -p admin_pass_123
```

### Managing Services

```bash
# Stop all services (keep data)
podman-compose stop

# Start all services
podman-compose start

# Restart a specific service
podman-compose restart user-service

# Remove all containers and volumes (WARNING: deletes data)
podman-compose down -v

# Rebuild without cache
podman-compose build --no-cache
```

### Monitoring

```bash
# View resource usage
podman stats

# Watch in real-time
podman stats --no-stream=false
```

## Development Workflow

### Using Development Compose File

The `docker-compose.dev.yml` includes:
- Hot-reload for code changes
- Debug logging enabled
- Volume mounts for real-time code updates

```bash
# Start development environment
podman-compose -f docker-compose.dev.yml up -d

# Follow logs in development mode
podman-compose -f docker-compose.dev.yml logs -f user-service
```

### Local Development (Without Docker)

If you prefer to run services locally while keeping databases in containers:

```bash
# Start only databases
podman-compose up -d mysql mongodb redis mailhog

# Run services locally
cd User && npm run dev
cd ../Publish && npm run dev
cd ../Feeds && npm run dev
cd ../Notification && npm run dev
```

## Troubleshooting

### Issue: "Error initializing source" or "requested access to the resource is denied"

**Solution:** Build images locally first
```bash
podman-compose build
podman-compose up -d
```

### Issue: "Port already in use"

**Solution:** Either stop the existing service or change the port mapping in `docker-compose.yml`
```bash
# Find what's using the port
lsof -i :3000

# Kill the process or use a different port
# Edit docker-compose.yml and change "3000:3000" to "3001:3000"
```

### Issue: "Database connection refused"

**Solution:** Wait for databases to be ready
```bash
# Check if MySQL is healthy
podman-compose exec mysql mysqladmin ping

# Check if MongoDB is healthy
podman-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Issue: "Out of memory" or "Insufficient resources"

**Solution:** Increase Podman machine resources
```bash
# Stop the machine
podman machine stop

# Set more resources (example: 8GB RAM, 4 CPUs)
podman machine set --memory 8192 --cpus 4

# Start again
podman machine start
```

### Issue: "Cannot connect to database from Podman Desktop on Windows"

**Solution:** Use the container network name instead of localhost
```bash
# Inside containers, use:
mysql://socioboard_user:password@mysql:3306/socioboard_mvp
mongodb://admin:password@mongodb:27017/
```

## Performance Tips

1. **Use docker-compose.yml for production** - It's optimized for performance
2. **Use docker-compose.dev.yml for development** - It's optimized for hot-reload
3. **Keep Podman machine updated** - Run `podman machine update` regularly
4. **Monitor resource usage** - Use `podman stats` to avoid resource exhaustion
5. **Use named volumes** - They're faster than bind mounts for data-heavy operations

## Cleanup

```bash
# Remove stopped containers
podman container prune

# Remove unused images
podman image prune

# Remove unused volumes
podman volume prune

# Complete cleanup (WARNING: removes everything not currently in use)
podman system prune -a --volumes
```

## Using Podman Desktop GUI

### Viewing Containers
1. Open **Podman Desktop**
2. Go to **Containers** tab
3. See all running services with status

### Viewing Logs
1. Right-click any container
2. Select **View logs**
3. See real-time output

### Accessing Terminal
1. Right-click any container
2. Select **Open terminal**
3. Execute commands inside container

### Inspecting Container
1. Right-click any container
2. Select **Inspect**
3. View full container configuration

## Networking

All services communicate through the `digiads-network` bridge network:

```yaml
services:
  user-service:
    networks:
      - digiads-network
    # Can access other services as:
    # http://publish-service:3001
    # http://feeds-service:3002
```

## Data Persistence

All data is persisted in named volumes:
- `mysql_data` - MySQL database
- `mongodb_data` - MongoDB database
- `redis_data` - Redis cache

Data survives container restarts but is removed when running `podman-compose down -v`.

## Next Steps

1. **Test API endpoints** - Use Swagger UI at service endpoints
2. **Explore database** - Use Adminer (MySQL) or MongoDB Express
3. **Check emails** - View sent emails in MailHog
4. **Read service docs** - Check README.md in each service directory
5. **Integrate social APIs** - Add your credentials for Facebook, Twitter, etc.

## Support

For issues or questions:
1. Check Docker logs: `podman-compose logs -f`
2. Review service error messages
3. Verify database connectivity
4. Check network configuration

Happy coding! 🚀