# Hostel Management System

This project is a full-stack hostel management application with a React frontend and a Spring Boot backend. It supports three main roles: Admin, Warden, and Student, plus public visitor pages.

The frontend is built with Vite and React 19. The backend is built with Spring Boot 3.2.5, Spring Security, JWT authentication, JPA, and MySQL.

## Architecture Overview

- Frontend: React, React Router, Axios, React Hook Form, Zod, React Query, Recharts, and JSPDF.
- Backend: Spring Boot, Spring Security, JWT, Spring Data JPA, Validation, Lombok, and MySQL.
- Authentication: login returns a JWT token, which the frontend stores in localStorage and sends as a Bearer token on every request.
- Default ports: frontend runs on 5173, backend runs on 8080.

## Frontend

The frontend code lives in the `frontend/` folder and uses a route-based role separation strategy.

### Frontend Tech Stack

- React 19
- Vite
- React Router DOM
- Axios
- React Hook Form
- Zod
- @tanstack/react-query
- Recharts
- Lucide React
- JSPDF

### Frontend Responsibilities

- Public site pages for visitors.
- Login and role-based redirects.
- Admin dashboard and management screens.
- Warden dashboard and operational screens.
- Student dashboard and self-service screens.
- Shared layouts, protected routes, and reusable UI components.

### Frontend Route Groups

Public routes:

- `/` home page
- `/login`
- `/visitor`
- `/visitor/facilities`
- `/visitor/inquiry`

Admin routes:

- `/admin/dashboard`
- `/admin/students`
- `/admin/students/add`
- `/admin/students/edit/:id`
- `/admin/students/assign/:id`
- `/admin/students/profile/:id`
- `/admin/rooms`
- `/admin/rooms/add`
- `/admin/rooms/:roomId/edit`
- `/admin/rooms/:roomId/beds`
- `/admin/rooms/occupancy`
- `/admin/wardens`
- `/admin/wardens/add`
- `/admin/wardens/edit/:id`
- `/admin/wardens/assign/:id`
- `/admin/fees`
- `/admin/fees/structure`
- `/admin/fees/details/:id`
- `/admin/fees/student/:id`
- `/admin/fees/invoice/:id`
- `/admin/fees/history`
- `/admin/complaints`
- `/admin/complaints/:id`
- `/admin/complaints/assign/:id`
- `/admin/complaints/response/:id`
- `/admin/announcements`
- `/admin/announcements/create`
- `/admin/announcements/edit/:id`
- `/admin/announcements/broadcast`
- `/admin/announcements/history`
- `/admin/profile`
- `/admin/profile/change-password`

Warden routes:

- `/warden/dashboard`
- `/warden/students`
- `/warden/students/edit/:id`
- `/warden/students/profile/:id`
- `/warden/rooms`
- `/warden/rooms/view/:id`
- `/warden/rooms/assign/:id`
- `/warden/complaints`
- `/warden/complaints/view/:id`
- `/warden/announcements`
- `/warden/announcements/create`
- `/warden/announcements/view/:id`
- `/warden/profile`
- `/warden/change-password`

Student routes:

- `/student/dashboard`
- `/student/room`
- `/student/roommates/:studentId`
- `/student/leave`
- `/student/complaints`
- `/student/complaints/new`
- `/student/complaints/:id`
- `/student/announcements`
- `/student/announcements/:id`
- `/student/fees`
- `/student/fees/request`
- `/student/fees/pay`
- `/student/fees/history`
- `/student/fees/certificate`
- `/student/fees/receipt/:id`
- `/student/profile`
- `/student/profile/edit`
- `/student/profile/change-password`

### Frontend API Behavior

The shared Axios client is in `src/services/api.js`.

- Base URL defaults to `http://localhost:8080`.
- You can override it with `VITE_API_URL`.
- The client automatically attaches the JWT from localStorage.
- A 401 response clears the stored auth data and redirects to `/login`.

### Frontend State and Auth

- Auth state is managed through `src/context/AuthContext.jsx` and `src/hooks/useAuth.js`.
- Protected routes are enforced by `src/components/ProtectedRoute.jsx`.
- Layout composition is handled by `src/layouts/AuthLayout.jsx` and `src/layouts/DashboardLayout.jsx`.

## Backend

The backend code lives in the `hostel-management-system/` folder and exposes REST APIs for authentication, admin operations, warden workflows, student self-service, fee handling, complaints, announcements, and dashboards.

### Backend Tech Stack

- Spring Boot 3.2.5
- Spring Security
- JWT authentication with JJWT
- Spring Data JPA
- Bean Validation
- Lombok
- MySQL

### Backend Configuration

- Application port: 8080
- Database: `hostel_management_db`
- Default local database user: `root`
- Default local database password: `root`
- Hibernate DDL mode: `update`

### Backend Security Model

- Login endpoint: `/auth/login`
- JWT token is issued after successful login.
- Role-based access is used for `ADMIN`, `WARDEN`, and `STUDENT`.
- The frontend sends the token in the `Authorization: Bearer <token>` header.

### Backend API Groups

Authentication:

- `POST /auth/login`

Admin APIs:

- `GET /api/admin`
- `POST /api/admin`
- `GET /api/admin/{id}`
- `GET /api/admin/me`
- `GET /api/admin/profile`
- `PUT /api/admin/profile`
- `POST /api/admin/change-password`
- `PUT /api/admin/{id}`
- `DELETE /api/admin/{id}`

Admin fee APIs:

- `GET /api/admin/fees`
- `GET /api/admin/fees/student/{studentId}`
- `GET /api/admin/fees/student/{studentId}/payments`
- `GET /api/admin/fees/payments`
- `PUT /api/admin/fees/payments/{paymentId}/verify`
- `PUT /api/admin/fees/payments/{paymentId}/reject`
- `PUT /api/admin/fees/payments/{paymentId}/refund`

Admin complaint APIs:

- `GET /api/admin/complaints`
- `GET /api/admin/complaints/{id}`
- `PUT /api/admin/complaints/{id}/assign`
- `PUT /api/admin/complaints/{id}/resolve`

Student APIs:

- `GET /api/student/profile`
- `PUT /api/student/profile`
- `POST /api/student/change-password`
- `GET /api/student/payment-history`
- `GET /api/student/complaints`
- `GET /api/student/complaints/{complaintId}`
- `POST /api/student/complaints`
- `DELETE /api/student/complaints/{complaintId}`
- `POST /api/student/logout-all`

Student fee APIs:

- `GET /api/student/fee-structure`
- `GET /api/student/my-fee`
- `GET /api/student/fees`
- `POST /api/student/fees/pay`
- `POST /api/student/fees/request`
- `GET /api/student/fees/payments`
- `GET /api/student/fees/payments/{paymentId}`

Warden APIs:

- `GET /api/warden/profile`
- `PUT /api/warden/profile`
- `POST /api/warden/change-password`
- `GET /api/warden/sessions`
- `POST /api/warden/logout-all`
- `GET /api/warden/complaints`
- `PUT /api/warden/complaints/{id}/status`
- `GET /api/warden/complaints/pending`
- `GET /api/warden/dashboard/stats`
- `GET /api/warden/alerts`
- `GET /api/warden/activities`

Room APIs:

- `POST /api/admin/rooms`
- `GET /api/admin/rooms`
- `GET /api/admin/rooms/{id}`
- `PUT /api/admin/rooms/{id}`
- `GET /api/admin/rooms/blocks`
- `GET /api/admin/rooms/test`
- `GET /api/warden/rooms`
- `GET /api/warden/rooms/{roomId}`
- `POST /api/warden/rooms/{roomId}/assign`

Student management APIs:

- `POST /api/admin/students`
- `GET /api/admin/students`
- `GET /api/admin/students/{id}`
- `GET /api/admin/students/{id}/profile`
- `PUT /api/admin/students/{id}`
- `POST /api/admin/students/{id}/assign-room`
- `DELETE /api/admin/students/{id}`
- `GET /api/warden/students`
- `GET /api/warden/students/{id}`
- `GET /api/warden/students/{id}/profile`
- `PUT /api/warden/students/{id}`

Warden management APIs:

- `POST /api/admin/wardens`
- `GET /api/admin/wardens`
- `GET /api/admin/wardens/{id}`
- `PUT /api/admin/wardens/{id}`
- `DELETE /api/admin/wardens/{id}`

Fee structure APIs:

- `GET /api/admin/fee-structures/health`
- `GET /api/admin/fee-structures/public`
- `POST /api/admin/fee-structures`
- `GET /api/admin/fee-structures`
- `GET /api/admin/fee-structures/{id}`
- `PUT /api/admin/fee-structures/{id}`
- `DELETE /api/admin/fee-structures/{id}`
- `GET /api/admin/fee-structures/block/{hostelBlock}`
- `GET /api/admin/fee-structures/room-type/{roomType}`
- `GET /api/admin/fee-structures/exists`

Announcement APIs:

- `GET /api/announcements/all`
- `POST /api/announcements`
- `POST /api/announcements/warden`
- `GET /api/announcements/{id}`
- `PUT /api/announcements/{id}`
- `DELETE /api/announcements/{id}`
- `GET /api/announcements/active`
- `GET /api/announcements/audience/{audience}`
- `GET /api/announcements/search`
- `GET /api/announcements/stats`

Dashboard APIs:

- `GET /api/admin/dashboard/stats`
- `GET /api/admin/dashboard/recent-activity`
- `GET /api/admin/dashboard/alerts`
- `GET /api/admin/dashboard/charts`

## Project Structure

Frontend structure:

- `src/components/` reusable UI and role-specific components
- `src/context/` auth context
- `src/layouts/` public and dashboard layouts
- `src/pages/` role-based page screens
- `src/routes/` route composition and protection
- `src/services/` API clients and request helpers
- `src/styles/` global and module-specific styles
- `src/data/` mock or seed data used by some screens

Backend structure:

- `src/main/java/com/hms/hms/controller/` REST controllers
- `src/main/java/com/hms/hms/service/` service interfaces and implementations
- `src/main/java/com/hms/hms/entity/` JPA entities
- `src/main/java/com/hms/hms/dto/` request and response DTOs
- `src/main/java/com/hms/hms/repository/` JPA repositories
- `src/main/java/com/hms/hms/security/` JWT and security configuration
- `src/main/java/com/hms/hms/config/` application configuration and bootstrap code
- `src/main/resources/` SQL scripts and application properties

## Running Locally

### Backend

1. Open a terminal in `hostel-management-system/`.
2. Make sure MySQL is running and the database `hostel_management_db` exists.
3. Update `src/main/resources/application.properties` if your local credentials differ.
4. Start the backend:

```bash
./mvnw spring-boot:run
```

On Windows, use:

```bash
mvnw.cmd spring-boot:run
```

### Frontend

1. Open a terminal in `frontend/`.
2. Install dependencies:

```bash
npm install
```

3. Start the Vite dev server:

```bash
npm run dev
```

### Optional Frontend Environment Variable

Create a `.env` file in `frontend/` if you want to override the backend URL:

```bash
VITE_API_URL=http://localhost:8080
```

## Available Frontend Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` previews the production build locally.

## Notes

- The frontend and backend are designed to work together through JWT-authenticated API calls.
- The student fee payment flow includes a request/verification path so admin fee records stay in sync.
- The router redirects authenticated users to the correct dashboard based on their role.
- If you extend the backend API, update the corresponding service file in `src/services/` and the relevant route/page in `src/pages/`.
