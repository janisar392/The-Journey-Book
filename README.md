# ✈️ The Journey Book

[![Live Demo](https://img.shields.io/badge/Live-Demo-green.svg)](https://the-journey-book.netlify.app)
[![Backend API](https://img.shields.io/badge/Backend-API-blue.svg)](https://the-journey-book-backend.onrender.com)
[![React](https://img.shields.io/badge/React-17-blue.svg)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)

A comprehensive travel platform that allows users to discover destinations, book unique travel experiences, share travel stories, and use essential travel tools. Built with modern web technologies and deployed on Render (backend) and Netlify (frontend).

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## 🚀 Features

### 🔐 Authentication
- Manual registration with password encryption (BCrypt)
- Google OAuth integration via Auth0
- JWT token-based authentication
- Secure password change and profile update

### 🔍 Search & Discovery
- Google Places API integration for real place search
- Fallback mock data for 50+ destinations
- Category-based filtering (beaches, mountains, cities, desert)
- Place details with images, ratings, and descriptions

### 📅 Booking System
- Complete booking CRUD operations
- Multiple ticket types (adult/child/senior)
- Guest information collection
- Booking status management (confirmed, pending, completed, cancelled)
- Booking history and upcoming trips dashboard

### 💳 Payment Integration
- Razorpay payment gateway integration
- Order creation and payment verification
- Secure signature validation (HMAC-SHA256)
- Payment status tracking

### 📝 Travel Stories (User-Generated Content)
- Create, read, update, delete travel stories
- Tags system for categorization
- Like functionality
- Comment system with user authentication
- Image upload support

### 🛠️ Travel Tools
- **Currency Converter** - Real-time exchange rates with fallback
- **Time Zone Converter** - World clock with 16+ time zones
- **Visa Checker** - Visa requirements for 30+ country pairs
- **Weather Forecast** - Live weather with 5-day forecast for any city

### 👤 User Management
- Profile page with personal information
- Settings page with account, security, and preferences
- My Trips dashboard showing all bookings
- Wishlist functionality

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 22 | Programming language |
| Spring Boot | 3.5.5 | REST API framework |
| Spring Security | 3.5.5 | Authentication & Authorization |
| Spring Data MongoDB | 3.5.5 | Database connectivity |
| JWT | 0.11.5 | Token-based authentication |
| Auth0 | 1.44.2 | OAuth2 integration |
| Razorpay | 1.4.3 | Payment gateway |
| Maven | 3.x | Build tool |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 17.0.1 | UI framework |
| React Router | 6.3.0 | Routing |
| Bootstrap | 5.3.8 | UI components & styling |
| Axios | 1.12.2 | HTTP client |
| Font Awesome | 6.4.0 | Icons |

### Database
- **MongoDB Atlas** - NoSQL cloud database

### Deployment
- **Render.com** - Backend API hosting
- **Netlify** - Frontend hosting

---

## 🌐 Live Demo

| Environment | URL |
|-------------|-----|
| **Frontend** | https://the-journey-book.netlify.app |
| **Backend API** | https://the-journey-book-backend.onrender.com |

---

## 🏗️ Architecture

### Frontend Layer (React)
- **Home Page** - Landing page with search functionality
- **Explore Page** - Destination discovery and filtering
- **Login/Register** - Authentication forms
- **Profile Page** - User profile and settings
- **Booking Page** - Experience booking flow
- **My Trips Page** - Booking history and management
- **Travel Stories** - User-generated content with likes/comments
- **Travel Tools** - Currency, Weather, Time Zone, Visa checker

### Backend Layer (Spring Boot)

**Controllers**
- AuthController - Authentication endpoints
- SearchController - Destination search
- BookingController - Booking CRUD operations
- PaymentController - Razorpay integration
- UserController - Profile management
- ExperienceController - Travel stories management

**Services**
- AuthService - Registration and login logic
- JwtService - Token generation and validation
- BookingService - Booking operations
- UserService - Profile updates and password change
- ExperienceService - Story management with likes/comments

**Repositories**
- UserRepository - User data access
- BookingRepository - Booking data access
- ExperienceRepository - Story data access

### Database Layer (MongoDB Atlas)
- **users** - User accounts and profiles
- **bookings** - Booking records and payment status
- **travel_experiences** - Travel stories with comments and likes

### External Integrations
- Google Places API - Destination search
- Razorpay - Payment processing
- Auth0 - OAuth authentication
- OpenWeatherMap - Weather data
- ExchangeRate-API - Currency rates

---
## 📁 Project Structure

### Backend Structure

```bash
The-Journey-Book-Backend/
├── src/main/java/com/janisar/
│   ├── config/        # Security, CORS, Auth0 configurations
│   ├── controller/    # REST API endpoints
│   ├── dto/           # Data transfer objects
│   ├── entity/        # MongoDB entities
│   ├── repository/    # Database operations
│   └── service/       # Business logic layer
├── src/main/resources/
│   ├── application.properties
│   └── static/
├── pom.xml
└── Dockerfile
```

### Frontend Structure

```bash
front-end/
├── public/
│   ├── images/
│   └── videos/
├── src/
│   ├── components/
│   │   ├── auth/        # Login, Register
│   │   ├── booking/     # Booking flow
│   │   ├── explore/     # Explore page
│   │   ├── home/        # Home page
│   │   ├── navigation/  # NavBar, Footer
│   │   ├── stories/     # Travel stories
│   │   ├── tools/       # Travel tools
│   │   ├── trips/       # My Trips
│   │   └── user/        # Profile, Settings
│   ├── context/         # AuthContext
│   ├── pages/           # Search results
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Java 22 or higher
* Node.js 16 or higher
* MongoDB Atlas account (or local MongoDB)
* Auth0 account (optional)
* Razorpay account (optional)
* Google Cloud Platform account (optional)

---

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/The-Journey-Book.git

# Navigate to backend
cd The-Journey-Book/The-Journey-Book-Backend

# Configure application.properties
# Add MongoDB URI, JWT secret, API keys

# Build project
mvn clean install

# Run application
mvn spring-boot:run
```

---

### Frontend Setup

```bash
# Navigate to frontend
cd ../front-end

# Install dependencies
npm install

# Configure API endpoint
# Update BASE_URL

# Start app
npm start
```

App runs at: **http://localhost:3000**

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint                 | Description     | Auth |
| ------ | ------------------------ | --------------- | ---- |
| POST   | /api/auth/register       | Register user   | ❌    |
| POST   | /api/auth/login          | Login           | ❌    |
| GET    | /api/auth/auth0/login    | Auth0 login URL | ❌    |
| POST   | /api/auth/auth0/callback | Auth0 callback  | ❌    |

### User Endpoints

| Method | Endpoint                   | Description     | Auth |
| ------ | -------------------------- | --------------- | ---- |
| GET    | /api/users/profile         | Get profile     | ✅    |
| PUT    | /api/users/profile         | Update profile  | ✅    |
| PUT    | /api/users/change-password | Change password | ✅    |

### Search Endpoints

| Method | Endpoint    | Description         | Auth |
| ------ | ----------- | ------------------- | ---- |
| POST   | /api/search | Search destinations | ❌    |

### Booking Endpoints

| Method | Endpoint                         | Description    | Auth |
| ------ | -------------------------------- | -------------- | ---- |
| POST   | /api/bookings                    | Create booking | ✅    |
| GET    | /api/bookings/user/{userId}      | User bookings  | ✅    |
| GET    | /api/bookings/{bookingId}        | Get booking    | ✅    |
| PUT    | /api/bookings/{bookingId}/status | Update status  | ✅    |
| POST   | /api/bookings/{bookingId}/cancel | Cancel booking | ✅    |

### Travel Stories Endpoints

| Method | Endpoint                      | Description  | Auth |
| ------ | ----------------------------- | ------------ | ---- |
| GET    | /api/experiences              | Get stories  | ❌    |
| GET    | /api/experiences/{id}         | Get story    | ❌    |
| POST   | /api/experiences              | Create story | ✅    |
| PUT    | /api/experiences/{id}         | Update story | ✅    |
| DELETE | /api/experiences/{id}         | Delete story | ✅    |
| POST   | /api/experiences/{id}/like    | Like story   | ✅    |
| POST   | /api/experiences/{id}/comment | Add comment  | ✅    |

### Travel Tools Endpoints

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | /api/travel-tools/currency | Currency conversion |
| GET    | /api/travel-tools/weather  | Weather forecast    |
| GET    | /api/travel-tools/timezone | Time zone           |
| GET    | /api/travel-tools/visa     | Visa check          |

---

## 🔧 Environment Variables

### Backend (application.properties)

| Variable              | Description     | Required |
| --------------------- | --------------- | -------- |
| MONGODB_ATLAS_URI     | MongoDB URI     | ✅        |
| JWT_SECRET_KEY        | JWT key         | ✅        |
| GOOGLE_PLACES_API_KEY | Places API      | ❌        |
| AUTH0_DOMAIN          | Auth0 domain    | ❌        |
| AUTH0_CLIENT_ID       | Auth0 ID        | ❌        |
| AUTH0_CLIENT_SECRET   | Auth0 secret    | ❌        |
| RAZORPAY_KEY_ID       | Razorpay key    | ❌        |
| RAZORPAY_KEY_SECRET   | Razorpay secret | ❌        |

### Frontend (.env)

| Variable          | Description | Required |
| ----------------- | ----------- | -------- |
| REACT_APP_API_URL | Backend URL | ✅        |

---

## 🚢 Deployment

### Backend (Render)

* Push to GitHub
* Create Web Service
* Build: `./mvnw clean install`
* Start: `java -jar target/*.jar`

### Frontend (Netlify)

* Connect repo
* Build: `npm run build`
* Publish: `build`

---

## 🎯 Future Enhancements

### High Priority

* Admin Dashboard
* Email Notifications
* Real-time Chat
* Mobile App

### Medium Priority

* Multi-language Support
* Advanced Filters
* Hotel Integration
* Travel Insurance

### Low Priority

* AI Recommendations
* Virtual Tours
* Carbon Calculator
* Social Features

---

## 👨‍💻 Author

**Janisar Akhtar**

* GitHub: https://github.com/janisar392
* LinkedIn: https://www.linkedin.com/in/janisar392/
* Portfolio: https://portfolio-janisar.netlify.app/
* Email: janisar392@gmail.com

---

## 🙏 Acknowledgments

* OpenWeatherMap
* ExchangeRate-API
* Google Places API
* Razorpay
* Auth0
* MongoDB Atlas
* Render
* Netlify

---

## ⭐ Show Your Support

If you found this project helpful, give it a ⭐ on GitHub!

**Made with ❤️ by Janisar Akhtar**

