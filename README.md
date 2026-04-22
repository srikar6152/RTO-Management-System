# 🚗 RTO Management System

A full-stack Regional Transport Office (RTO) portal built with **Spring Boot** (backend) and **React.js** (frontend), featuring JWT authentication, role-based access control, and automated report processing for 500+ users.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3, Spring Security, JPA/Hibernate |
| Frontend | React.js 18, Axios, React Router v6 |
| Database | MySQL 8 |
| Auth | JWT (JSON Web Tokens) |
| API Testing | Postman |
| Build | Maven, npm |

## 📁 Project Structure

```
rto-management-system/
├── backend/                  # Spring Boot Application
│   └── src/main/java/com/rto/
│       ├── controller/       # REST API Controllers
│       ├── service/          # Business Logic
│       ├── repository/       # JPA Repositories
│       ├── model/            # Entity Classes
│       ├── dto/              # Data Transfer Objects
│       ├── security/         # JWT Auth, Filters
│       └── config/           # App Configuration
└── frontend/                 # React Application
    └── src/
        ├── components/       # Reusable UI Components
        ├── pages/            # Route Pages
        ├── services/         # API Service Layer
        ├── context/          # Auth Context
        └── utils/            # Helper Utilities
```

## ⚙️ Setup & Installation

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

### Backend Setup

```bash
cd backend

# 1. Create MySQL database
mysql -u root -p
CREATE DATABASE rto_db;
EXIT;

# 2. Configure application.properties
# Edit: src/main/resources/application.properties

# 3. Build and run
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend

npm install
npm start
```

App runs at: `http://localhost:3000`  
API runs at: `http://localhost:8080`

## 🔐 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin@rto.com | Admin@123 |
| User | user@rto.com | User@123 |

## 📌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | Public |
| POST | /api/auth/login | Login & get JWT | Public |
| GET | /api/vehicles | Get all vehicles | User |
| POST | /api/vehicles | Register vehicle | User |
| GET | /api/licenses | Get licenses | User |
| POST | /api/licenses/apply | Apply for license | User |
| GET | /api/admin/reports | Get all reports | Admin |
| PUT | /api/admin/users/{id} | Update user | Admin |

## 🗃️ Database Schema

6 relational entities:
- `users` — User accounts & roles
- `vehicles` — Vehicle registrations
- `licenses` — License applications
- `reports` — Generated reports
- `appointments` — Booking slots
- `payments` — Payment records

## 🚀 Features

- ✅ JWT-based authentication & role-based authorization
- ✅ Vehicle registration and management
- ✅ License application & status tracking
- ✅ Appointment scheduling
- ✅ Admin dashboard with report generation
- ✅ Responsive React frontend
- ✅ DTO validation & ModelMapper
- ✅ 90%+ Postman test coverage
