import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [
        process.env.APP_URL!, // http://localhost:3000
        "http://localhost:3000"
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "CUSTOMER",
                input: true, // Allow setting during registration
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
        requireEmailVerification: false
    },
});