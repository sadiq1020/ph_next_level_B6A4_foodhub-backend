import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oAuthProxy } from "better-auth/plugins";
import { prisma } from "./prisma";

export const auth = betterAuth({
  // ── CRITICAL for deployed OAuth ───────────────────────────────────────────
  // BETTER_AUTH_URL must be the FRONTEND Vercel URL + /api/auth
  // e.g. https://your-kitchenclass.vercel.app/api/auth
  // This tells Better Auth where the proxy lives (Next.js rewrites forward to backend)
  baseURL: process.env.BETTER_AUTH_URL!,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    "http://localhost:3000",
    process.env.APP_URL!, // your Vercel frontend URL
  ],

  // ── CRITICAL for deployed OAuth state verification ────────────────────────
  // Stores OAuth state in the database instead of a cookie.
  // Required when backend (Render) and frontend (Vercel) are on different domains,
  // because the state cookie set by the backend can't be read by the frontend.
  account: {
    storeStateStrategy: "database",
    skipStateCookieCheck: true,
  },

  // ── Cookie settings ────────────────────────────────────────────────────────
  // Empty object = use Better Auth defaults (SameSite: Lax).
  // Works because the frontend proxies auth through Next.js rewrites,
  // so the browser sees the same domain for all auth requests.
  advanced: {
    defaultCookieAttributes: {},
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },

  // ── Google OAuth ───────────────────────────────────────────────────────────
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // All Google users are CUSTOMER by default.
      // They can apply to become instructors after signing in.
      mapProfileToUser: () => ({
        role: "CUSTOMER",
        isActive: true,
        emailVerified: true,
      }),
    },
  },

  // ── oAuthProxy plugin ──────────────────────────────────────────────────────
  // Enables Google OAuth to work in production when backend and frontend
  // are on different domains. The proxy intercepts the OAuth callback on
  // the frontend (Vercel) and forwards it to the backend (Render).
  plugins: [
    oAuthProxy({
      // Must match your Vercel frontend URL exactly (no trailing slash)
      productionURL: process.env.APP_URL!,
    }),
  ],
});

// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { prisma } from "./prisma";

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),
//   baseURL: process.env.BETTER_AUTH_URL!, // ✅ Backend URL
//   trustedOrigins: [
//     "http://localhost:3000",
//     "https://ph-next-level-b6-a4-foodhub-fronten.vercel.app",
//     process.env.APP_URL!,
//   ],
//   // ✅ Correct session configuration
//   session: {
//     cookieCache: {
//       enabled: true,
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     },
//     // ✅ Cookie options at session level
//     cookieOptions: {
//       sameSite: "none", // Required for cross-domain
//       secure: true, // Required when using sameSite: none
//       httpOnly: true,
//       path: "/",
//     },
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "CUSTOMER",
//         input: true,
//       },
//       phone: {
//         type: "string",
//         required: false,
//         input: true,
//       },
//       isActive: {
//         type: "boolean",
//         defaultValue: true,
//       },
//     },
//   },
//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: false,
//     requireEmailVerification: false,
//   },
// });
