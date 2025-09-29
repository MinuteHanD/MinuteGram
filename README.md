# MinuteGram

A full-stack scalable social media engine built with Spring Boot and React, featuring topic-based discussions, user authentication, and administrative controls with a mid design interface. I'd be happy to recieve all suggestions on that.

## Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.3.1
- **Language**: Java 17
- **Database**: PostgreSQL with Spring Data JPA
- **Security**: JWT-based authentication with Spring Security
- **File Storage**: Cloudinary integration
- **Testing**: JUnit 5, Mockito, TestContainers

### Frontend (React)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: Context API

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 13
- **Build Tools**: Maven (backend), Vite (frontend)

## Features

### Core Functionality
- User registration and JWT authentication
- Topic creation and management
- Post creation with image upload support
- Threaded comment system with replies
- Post like/unlike functionality
- User profile management

### Administrative Features
- Role-based access control (User, Moderator, Admin)
- User management (ban/unban, role assignment)
- Content moderation (post/comment deletion)
- Administrative dashboard with analytics

### Security
- JWT token-based authentication
- Role-based authorization
- CSRF protection
- Input validation and sanitization
- Secure password handling with BCrypt

## API Documentation

### Authentication Endpoints
```
POST   /api/auth/signup     - User registration
POST   /api/auth/login      - User authentication
POST   /api/auth/logout     - Token invalidation
```

### Content Management
```
GET    /api/topics          - List topics (paginated)
POST   /api/topics          - Create topic (authenticated)
GET    /api/topics/{id}     - Get topic details
GET    /api/topics/{id}/posts - Get topic posts

GET    /api/posts           - List posts (paginated)
POST   /api/posts           - Create post (authenticated)
GET    /api/posts/{id}      - Get post with comments
POST   /api/posts/{id}/like - Like/unlike post

POST   /api/comments        - Create comment (authenticated)
GET    /api/comments/post/{postId} - Get post comments
```

### Administration
```
GET    /api/admin/users     - User management (admin only)
GET    /api/admin/posts     - Content overview (moderator+)
POST   /api/admin/users/{id}/ban - User moderation
DELETE /api/admin/posts/{id} - Content removal
```

## Development Setup

### Prerequisites
- Java 17+
- Node.js 16+
- PostgreSQL 13+
- Maven 3.6+

### Backend Configuration

1. **Database Setup**
   ```bash
   docker run --name minutegram-postgres \
     -e POSTGRES_DB=minutegram_db \
     -e POSTGRES_USER=${DB_USERNAME} \
     -e POSTGRES_PASSWORD=${DB_PASSWORD} \
     -p 5432:5432 -d postgres:13
   ```

2. **Environment Variables**
   
   Create a `.env` file in the root directory (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in your `.env` file:
   ```bash
   # Database Configuration
   DB_URL=jdbc:postgresql://localhost:5432/minutegram_db
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_secure_db_password
   
   # JWT Configuration
   JWT_SECRET=your_256_bit_secret_key_here
   JWT_EXPIRATION=86400000
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Server Configuration
   SERVER_PORT=8080
   ```

3. **Run Backend**
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Configuration

1. **Install Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Environment Setup**
   ```bash
   echo "VITE_API_BASE_URL=http://localhost:8080" > .env.local
   ```

3. **Run Frontend**
   ```bash
   npm run dev
   ```

### Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Testing

### Backend Tests
```bash
# Run all tests
./mvnw test

# Run specific test suites
./mvnw test -Dtest="*ServiceTest"
./mvnw test -Dtest="*RepositoryTest"

# Run with coverage
./mvnw test jacoco:report
```

### Frontend Tests
```bash
cd client
npm test
```

## Project Structure

```
├── src/main/java/com/minutegram/
│   ├── controller/          # REST controllers
│   ├── service/            # Business logic
│   ├── repository/         # Data access layer
│   ├── entity/             # JPA entities
│   ├── dto/                # Data transfer objects
│   ├── config/             # Configuration classes
│   └── exception/          # Custom exceptions
├── src/test/java/          # Unit and integration tests
├── client/
│   ├── src/
│   │   ├── component/      # React components
│   │   └── service/        # API services
│   └── public/             # Static assets
└── docker-compose.yml      # Container orchestration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.

