# FoodHub — Backend

REST API for the FoodHub meal ordering platform. Built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**. Handles authentication via **better-auth**, role-based access control, and all business logic for customers, providers, and admins.

---

## 🔗 Links

| | URL |
|---|---|
| **Backend Live** | https://ph-next-level-b6a4-foodhub-backend.onrender.com |
| **Frontend Live** | https://ph-next-level-b6-a4-foodhub-fronten.vercel.app |
| **Frontend Repo** | https://github.com/your-username/foodhub-frontend |

---

## ✨ Features

- **better-auth** session-based authentication with role support (CUSTOMER, INSTRUCTOR, ADMIN)
- Role-based middleware protecting every private endpoint
- Full meal CRUD for providers
- Order lifecycle management (PLACED → PREPARING → READY → DELIVERED / CANCELLED)
- Customer reviews on delivered meals
- Admin user management (suspend / activate)
- Category management
- Admin statistics endpoint (totals for users, orders, categories)
- Seeder script for the admin account

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| TypeScript | Type safety |
| Prisma ORM | Database access |
| PostgreSQL | Primary database |
| better-auth | Authentication & session management |
| pg | PostgreSQL driver |
| dotenv | Environment variable management |
| tsx | TypeScript execution (dev & prod) |

---

## 📁 Project Structure

```
src/
├── modules/
│   ├── admin/          # Stats, user management
│   ├── category/       # Meal categories CRUD
│   ├── meal/           # Meals CRUD + public browse with filters
│   ├── order/          # Order creation, status updates, history
│   ├── provider/       # Provider profile + meal management
│   ├── review/         # Customer reviews
│   └── user/           # User profile updates
├── middlewares/
│   └── auth.middleware.ts   # Role-based route protection
├── lib/
│   ├── auth.ts              # better-auth configuration
│   └── prisma.ts            # Prisma client singleton
├── scripts/
│   └── seedAdmin.ts         # Seeds the admin account
├── shared/
│   └── index.ts             # Shared constants (ROLES enum)
├── app.ts                   # Express app setup, CORS, routes
└── server.ts                # Server entry point (DB connect + listen)
prisma/
└── schema.prisma            # Database schema
```

---

## 🗄️ Database Schema

| Model | Description |
|---|---|
| `User` | All users — customers, providers, admins |
| `Session` | better-auth session tokens |
| `Account` | better-auth account records |
| `ProviderProfiles` | Business info linked to provider users |
| `Category` | Meal categories (e.g. Biryani, Pizza) |
| `Meal` | Menu items belonging to a provider |
| `Order` | Customer orders with delivery info and status |
| `OrderItem` | Individual meals within an order |
| `Review` | Customer reviews on meals after delivery |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud e.g. Neon, Supabase)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/foodhub-backend.git
cd foodhub-backend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
# Server port
PORT=5000

# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/foodhub?schema=public"

# better-auth secret (minimum 32 random characters)
BETTER_AUTH_SECRET="your_random_secret_here_minimum_32_chars"

# This server's own URL (used by better-auth internally)
BETTER_AUTH_URL=http://localhost:5000

# Frontend URL (for CORS)
APP_URL=http://localhost:3000

# Admin seed credentials
ADMIN_NAME="Admin"
ADMIN_EMAIL="admin@foodhub.com"
ADMIN_PASSWORD="admin123456"
```

### Database Setup

```bash
# Run migrations to create all tables
npx prisma migrate deploy

# Or in development (creates migration files)
npx prisma migrate dev --name init

# Seed the admin account
npm run seed:admin
```

### Run Locally

```bash
# Development (hot reload)
npm run dev

# Production
npm run start
```

Server runs at [http://localhost:5000](http://localhost:5000)

---

## 🌐 Deployment (Render)

1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo
4. Set the following:

| Setting | Value |
|---|---|
| **Runtime** | Node |
| **Build Command** | `npm install && npx prisma generate && npx prisma migrate deploy` |
| **Start Command** | `npm run start` |

5. Add environment variables in Render dashboard (same as `.env` above, with production values)
6. Deploy

> **Note:** Render free tier spins down after inactivity. First request after sleep takes 5–15 seconds. Consider using [cron-job.org](https://cron-job.org) to ping the server every 14 minutes to keep it warm.

---

## 📡 API Endpoints

### Authentication (better-auth)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/sign-up/email` | Register new user |
| POST | `/api/auth/sign-in/email` | Login |
| POST | `/api/auth/sign-out` | Logout |
| GET | `/api/auth/get-session` | Get current session |

### Meals (Public)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/meals` | Get all meals (filters: search, categoryId, dietary, minPrice, maxPrice) |
| GET | `/meals/:id` | Get single meal with reviews |

### Provider — Meals
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/meals/my-meals` | Get provider's own meals | INSTRUCTOR |
| POST | `/meals` | Add new meal | INSTRUCTOR |
| PUT | `/meals/:id` | Update meal | INSTRUCTOR |
| DELETE | `/meals/:id` | Delete meal | INSTRUCTOR |

### Categories
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/categories` | Get all categories | Public |
| POST | `/categories` | Create category | ADMIN |
| PUT | `/categories/:id` | Update category | ADMIN |
| DELETE | `/categories/:id` | Delete category | ADMIN |

### Orders
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/orders` | Place new order | CUSTOMER |
| GET | `/orders` | Get my orders | CUSTOMER |
| GET | `/orders/:id` | Get order detail | CUSTOMER / INSTRUCTOR |
| PUT | `/orders/:id/status` | Update order status | INSTRUCTOR |
| PUT | `/orders/:id/cancel` | Cancel order | CUSTOMER |
| GET | `/orders/admin/all` | Get all orders | ADMIN |

### Provider Profile
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/provider-profile` | List all providers | Public |
| GET | `/provider-profile/:id` | Get provider + meals | Public |
| POST | `/provider/profile` | Create provider profile | INSTRUCTOR |

### Users
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/users` | Get all users | ADMIN |
| PATCH | `/users/:id/status` | Suspend / activate user | ADMIN |
| PUT | `/users/profile` | Update own profile | Any authenticated |

### Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/stats` | Platform statistics | ADMIN |

### Reviews
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/reviews` | Submit review (delivered orders only) | CUSTOMER |

---

## 🔐 Role-Based Access

The `auth.middleware.ts` verifies the session cookie and checks the user's role before allowing access to protected routes.

```
ADMIN    → full platform access
INSTRUCTOR → own meals, incoming orders
CUSTOMER → cart, orders, reviews, profile
```

---

## 🧑‍💻 Admin Credentials

```
Email:    admin@foodhub.com
Password: admin123456
```

Run `npm run seed:admin` after setting up the database to create this account.

---

## 📄 License

MIT
