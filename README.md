# KitchenClass — Backend

A RESTful API for the KitchenClass cooking course marketplace. Built with **Express**, **Prisma 7**, **PostgreSQL**, and **Better Auth**.

**Frontend Repo:** [github.com/sadiq1020/kitchenclass-frontend](https://github.com/sadiq1020/kitchenclass-frontend)

---

## Features

- **Authentication** — Email/password + Google OAuth via Better Auth with `oAuthProxy` plugin for cross-domain production support
- **Role-based access** — Three roles: `CUSTOMER`, `INSTRUCTOR`, `ADMIN`
- **Instructor approval flow** — New instructors apply and wait for admin approval before publishing courses
- **Course management** — Full CRUD for courses with category, difficulty, duration, video URL
- **Enrollment system** — Orders with line items (`EnrollmentItem`), 1-year access window, status tracking
- **Reviews** — Verified reviews (only enrolled students with ACTIVE/COMPLETED status can review)
- **Admin panel API** — Stats, charts data (enrollment trend, revenue, user distribution), user management
- **Chart endpoints** — Real data for frontend analytics dashboards

---

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| ORM | Prisma 7 |
| Database | PostgreSQL (Neon) |
| Auth | Better Auth |
| Validation | TypeScript interfaces |

---

## Project Structure

```
src/
├── app.ts                    # Express app setup, route registration
├── server.ts                 # Server entry point
├── lib/
│   ├── auth.ts               # Better Auth configuration
│   └── prisma.ts             # Prisma client instance
├── middlewares/
│   └── auth.middleware.ts    # Session-based auth guard
├── modules/
│   ├── admin/
│   │   ├── admin.service.ts  # Stats, charts, instructor management
│   │   ├── admin.controller.ts
│   │   └── admin.route.ts
│   ├── category/
│   ├── course/
│   ├── instructor/
│   ├── order/
│   ├── review/
│   └── user/
└── shared/
    ├── roles.types.ts        # ROLES constant
    └── orderStatus.types.ts  # ORDER_STATUS constant
```

---

## Database Schema

| Model | Description |
|---|---|
| `User` | All users — customers, instructors, admins |
| `InstructorProfiles` | Instructor details + approval status (PENDING/APPROVED/REJECTED) |
| `Category` | Course categories |
| `Course` | Courses with videoUrl, duration, difficulty, lessonsCount |
| `Order` | Enrollments with 1-year accessUntil |
| `EnrollmentItem` | Line items linking orders to courses |
| `Review` | Course reviews (rating 1–5 + comment) |
| `Session / Account / Verification` | Better Auth managed tables |

---

## API Endpoints

### Auth (Better Auth — managed automatically)
```
POST   /api/auth/sign-up/email
POST   /api/auth/sign-in/email
POST   /api/auth/sign-out
GET    /api/auth/session
GET    /api/auth/callback/google
GET    /api/auth/oauth-proxy-callback
```

### Courses (public + instructor)
```
GET    /courses                   # Browse with filters, sort, pagination
GET    /courses/my-courses        # Instructor's own courses (auth required)
GET    /courses/:id               # Course detail with reviews
POST   /courses                   # Create course (INSTRUCTOR)
PUT    /courses/:id               # Update course (INSTRUCTOR)
DELETE /courses/:id               # Delete course (INSTRUCTOR)
```

### Instructor
```
POST   /instructor/profile        # Apply as instructor (any logged-in user)
GET    /instructor/profile        # Get own profile (INSTRUCTOR)
PUT    /instructor/profile        # Update own profile (INSTRUCTOR)
GET    /instructor/orders         # Get enrollments for own courses (INSTRUCTOR)
GET    /instructor/charts         # Chart data for instructor dashboard (INSTRUCTOR)
GET    /instructor-profiles       # Public instructor list
GET    /instructor-profiles/:id   # Public instructor profile
```

### Orders / Enrollments
```
POST   /orders                    # Create enrollment (CUSTOMER)
GET    /orders                    # Get own enrollments (CUSTOMER)
GET    /orders/admin/all          # All platform enrollments (ADMIN)
GET    /orders/:id                # Order detail (owner or ADMIN)
PUT    /orders/:id/status         # Update status (INSTRUCTOR)
PUT    /orders/:id/cancel         # Cancel enrollment (CUSTOMER)
```

### Reviews
```
GET    /reviews/top               # Latest 5-star reviews (public)
POST   /reviews                   # Submit review (CUSTOMER, must be enrolled)
```

### Admin
```
GET    /admin/stats                          # Platform stats
GET    /admin/charts/enrollment-trend        # 30-day enrollment data
GET    /admin/charts/revenue                 # 6-month revenue data
GET    /admin/charts/user-roles              # User role distribution
GET    /admin/instructors                    # All instructor applications
PATCH  /admin/instructors/:id/approve        # Approve instructor
PATCH  /admin/instructors/:id/reject         # Reject instructor
GET    /admin/orders                         # Not used (use /orders/admin/all)
```

### Users
```
GET    /users                     # All users (ADMIN)
PATCH  /users/:id/status          # Suspend/activate user (ADMIN)
PUT    /users/profile             # Update own name/phone (any auth)
```

### Categories
```
GET    /categories                # All categories (public)
POST   /categories                # Create category (ADMIN)
PUT    /categories/:id            # Update category (ADMIN)
DELETE /categories/:id            # Delete category (ADMIN)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech))

### Installation

```bash
git clone https://github.com/sadiq1020/kitchenclass-backend.git
cd kitchenclass-backend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@host/dbname"

# Better Auth
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=http://localhost:3000/api/auth

# Frontend URL (used by oAuthProxy)
APP_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin seed credentials
ADMIN_NAME="Admin Sadiq2"
ADMIN_EMAIL="admin@sadiq2.com"
ADMIN_PASSWORD="admin1234"
```

> **Important:** `BETTER_AUTH_URL` must be the **frontend URL + `/api/auth`**, not the backend URL. This is required for the Google OAuth proxy to work.

### Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed admin user
npm run seed
```

### Development

```bash
npm run dev
```

Server starts on [http://localhost:5000](http://localhost:5000)

---

## Deployment (Render)

### Environment Variables on Render

| Key | Value |
|---|---|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Your secret key |
| `BETTER_AUTH_URL` | `https://your-frontend.vercel.app/api/auth` |
| `APP_URL` | `https://your-frontend.vercel.app` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `ADMIN_NAME` | Admin display name |
| `ADMIN_EMAIL` | Admin email |
| `ADMIN_PASSWORD` | Admin password |

### Google Cloud Console Setup

Authorized JavaScript origins:
```
http://localhost:3000
https://your-frontend.vercel.app
```

Authorized redirect URIs:
```
http://localhost:5000/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/oauth-proxy-callback
https://your-backend.onrender.com/api/auth/callback/google
https://your-frontend.vercel.app/api/auth/callback/google
https://your-frontend.vercel.app/api/auth/oauth-proxy-callback
```

---

## Key Implementation Notes

**Prisma 7** — No `url` field in the `datasource` block. Database URL is read from `prisma.config.ts` automatically.

**Route ordering** — `GET /courses/my-courses` must be defined **before** `GET /courses/:id` in the router, otherwise Express matches `my-courses` as a course ID.

**Instructor registration** — After `signUp.email()`, the frontend must call `signIn.email()` before hitting `POST /instructor/profile`. The sign-up alone does not establish a session cookie in time.

**Review eligibility** — Only customers with an enrollment in `ACTIVE` or `COMPLETED` status can submit a review. The service validates this before creating the review record.
