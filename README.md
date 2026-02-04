# 📸 PhotoGuru API

A robust and scalable Backend API for a photography connection platform, integrating AI-powered guidance, real-time communication, and professional portfolio management.

## 📦 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| NestJS | v11.0.1 | A progressive Node.js framework for building efficient, reliable and scalable server-side applications |
| Prisma | v7.3.0 | Next-generation ORM for Node.js and TypeScript (PostgreSQL) |
| TypeScript | v5.7.3 | Static typing for improved code quality and developer experience |
| PostgreSQL | v16+ | Powerful, open source object-relational database system |
| Google Gemini AI | v0.24.1 | AI Photo Guide integration for real-time photography instructions |
| Cloudinary | v2.9.0 | Cloud-based image management and optimization for portfolios |
| Firebase Admin | v13.6.0 | Real-time chat synchronization and push notifications |
| Passport & JWT | v11.0.5 | Secure authentication and Role-based Access Control (RBAC) |
| Swagger | v11.2.5 | Automated API documentation and testing interface |
| ESLint & Prettier | Latest | Code quality enforcement and automated formatting |
| Husky | v9.1.7 | Git hooks for automated pre-commit linting |

## 📂 Project Structure

The project follows a Modular Architecture, separating core business domains from shared infrastructure and common utilities.

```
src/
├── common/                  # Global cross-cutting concerns
│   ├── config/              # SSL, Environment and Library configurations
│   ├── constants/           # Global enums, error codes, and constants
│   ├── decorators/          # Custom decorators (e.g., @CurrentUser, @Roles)
│   ├── filters/             # Exception filters for centralized error handling
│   ├── guards/              # AuthGuards and Role-based Access Control
│   └── interceptors/        # Response transformation and Logging (e.g., CloudinaryInterceptor)
├── modules/                 # Core Business Domain Modules
│   ├── ai-guide/            # AI Photography Guidance logic (Gemini AI)
│   ├── auth/                # Authentication, Login, Register, JWT Strategies
│   ├── bookings/            # Scheduling and Booking state management
│   ├── chat/                # Real-time chat metadata and history
│   ├── concepts/            # Photographer's concepts and portfolio management
│   └── users/               # Customer and Photographer profile management
├── shared/                  # Reusable Infrastructure Providers
│   ├── cloudinary/          # Image upload and transformation service
│   ├── firebase/            # Firebase SDK for messaging/notifications
│   ├── gemini/              # AI Engine wrapper (Google Gemini)
│   └── prisma/              # Database connection (PrismaService)
├── app.module.ts            # Root application module
└── main.ts                  # Application entry point & Global configurations

prisma/
├── schema.prisma            # Database schema definition
├── migrations/              # Database version control history
└── seed.ts                  # Mock data for development environment
```

## 🚀 Getting Started

### 1️⃣ Installation

Install all project dependencies:

```bash
npm install
```

### 2️⃣ Database Setup

Configure your `.env` file with your PostgreSQL credentials, then run:

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations to create tables
npm run db:migrate

# Seed the database with mock data
npm run db:seed
```

### 3️⃣ Development

Start the development server with watch mode:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

Documentation (Swagger) can be accessed at `http://localhost:3000/api/docs`

### 4️⃣ Production Build

```bash
npm run build
npm run start:prod
```

## 🛠 Project Configuration

- **API Documentation**: Managed via `@nestjs/swagger`
- **Security**: Helmet, CORS, and Rate Limiting enabled
- **Validation**: Strict DTO validation using class-validator and class-transformer
- **Image Handling**: Dynamic URL transformation via CloudinaryInterceptor
- **CI/CD**: GitHub Actions configured for automated deployment to Render

## 📌 Key Features

✅ Modular Domain-Driven Design for high maintainability  
✅ AI-Powered Photo Guide using Google Gemini API  
✅ Real-time Chat integration with Firebase  
✅ Type-safe Database Operations with Prisma 7  
✅ Automated Image Optimization with Cloudinary CDN  
✅ Role-Based Access Control (RBAC) (Customer vs Photographer)  
✅ Standardized API Responses via Interceptors and Filters