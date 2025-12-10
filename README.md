# DigiAds MVP - Social Media Management Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![MySQL](https://img.shields.io/badge/mysql-8.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-4.4-green.svg)

A powerful social media management and content marketing platform built with Node.js microservices architecture. This MVP is based on Socioboard and includes comprehensive features for managing multiple social media accounts.

## 🚀 Features

✅ **User Authentication & Management** - JWT-based auth with bcrypt password hashing
✅ **Social Media Publishing** - Schedule and publish to multiple networks
✅ **Feed Aggregation & Curation** - Fetch feeds from social networks and RSS sources
✅ **Real-time Notifications** - Socket.io-based instant notifications
✅ **Analytics & Reporting** - Comprehensive dashboard analytics
✅ **Team Collaboration** - Role-based permissions and task management
✅ **Content Management** - Media library and content organization
✅ **Payment & Subscription** - Subscription management system

## 🏗️ Architecture

Microservices architecture with 4 independent services:

- **User Service** (Port 3000) - Authentication, user management, teams, payments
- **Publish Service** (Port 3001) - Post scheduling and publishing
- **Feeds Service** (Port 3002) - Feed aggregation and content curation
- **Notification Service** (Port 3003) - Real-time notifications and emails

### Tech Stack

- **Backend**: Node.js (v14+), Express.js
- **Databases**: MySQL (relational data), MongoDB (feeds & logs)
- **Authentication**: JWT, bcrypt
- **Real-time**: Socket.io
- **ORM/ODM**: Sequelize (MySQL), Mongoose (MongoDB)
- **API Docs**: Swagger UI
- **Logging**: Winston
- **Security**: Helmet, express-rate-limit, CSRF protection

## 📋 Prerequisites

- Node.js >= 14.0.0
- npm >= 7.0.0
- MySQL >= 8.0
- MongoDB >= 4.4
- PM2 (optional, for production)
- Nodemon (for development)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/omps/digiads-mvp.git
cd digiads-mvp
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install all service dependencies
npm run install-all
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your database credentials and configuration
```

### 4. Setup MySQL Database

```bash
# Create database
mysql -u root -p
CREATE DATABASE socioboard_mvp;
exit;

# Run migrations
npm run db-migrate
```

### 5. Configure each service

Copy the configuration template for each service:

```bash
cp User/config/development.json.example User/config/development.json
cp Publish/config/development.json.example Publish/config/development.json
cp Feeds/config/development.json.example Feeds/config/development.json
cp Notification/config/development.json.example Notification/config/development.json
```

Edit each `development.json` file with your credentials.

## 🚀 Running the Application

### Development Mode (4 separate terminals)

```bash
# Terminal 1 - User Service
npm run dev-user

# Terminal 2 - Publish Service
npm run dev-publish

# Terminal 3 - Feeds Service
npm run dev-feeds

# Terminal 4 - Notification Service
npm run dev-notify
```

### Production Mode (with PM2)

```bash
cd User && pm2 start user.server.js --name user-service
cd ../Publish && pm2 start publish.server.js --name publish-service
cd ../Feeds && pm2 start feeds.server.js --name feeds-service
cd ../Notification && pm2 start notify.server.js --name notification-service

pm2 status
```

## 📚 API Documentation

Once services are running, access Swagger documentation:

- User Service: http://localhost:3000/api-docs
- Publish Service: http://localhost:3001/api-docs
- Feeds Service: http://localhost:3002/api-docs
- Notification Service: http://localhost:3003/api-docs

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/teams` - Get user teams

### Posts (Publishing)
- `POST /api/posts` - Create/schedule post
- `GET /api/posts` - List scheduled posts
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/publish` - Publish immediately

### Feeds
- `GET /api/feeds` - Get aggregated feeds
- `POST /api/feeds/sources` - Add feed source
- `GET /api/feeds/trending` - Get trending content

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/posts/:id` - Post performance
- `GET /api/analytics/export` - Export reports

## 🗄️ Database Schema

### MySQL Tables
- `users` - User accounts
- `teams` - Team management
- `team_members` - Team membership
- `posts` - Scheduled posts
- `social_accounts` - Connected social accounts
- `analytics` - Performance metrics
- `payments` - Payment records
- `subscriptions` - User subscriptions

### MongoDB Collections
- `feeds` - Aggregated feed data
- `logs` - Application logs
- `notifications` - Notification history

## 🔒 Security Features

- JWT authentication with secure token management
- Password hashing with bcrypt (salt rounds: 10)
- Helmet.js for HTTP header security
- Rate limiting to prevent abuse
- CSRF protection
- Input validation with Joi
- SQL injection prevention via Sequelize ORM
- XSS protection

## 🧪 Testing

```bash
cd User && npm test
cd ../Publish && npm test
cd ../Feeds && npm test
```

## 📝 Configuration Files

Each service has a `config/development.json` with:

```json
{
  "port": 3000,
  "mysql": {
    "host": "localhost",
    "username": "root",
    "password": "",
    "database": "socioboard_mvp"
  },
  "mongodb": {
    "uri": "mongodb://localhost:27017/socioboard_feeds"
  },
  "jwt": {
    "secret": "your-secret-key",
    "expiry": "7d"
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Based on [Socioboard](https://github.com/aoplus/digiads) - Open source social media management platform

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Happy Social Media Managing! 🚀**
