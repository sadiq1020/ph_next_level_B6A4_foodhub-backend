import { auth as betterAuth } from "../lib/auth";
import { NextFunction, Request, Response } from "express"
import { UserRole } from "../shared";


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: UserRole;
                // emailVerified: boolean;
            };
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get user session using Better Auth
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            });

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized"
                });
            }

            // if (!session.user.emailVerified) {
            //     return res.status(403).json({
            //         success: false,
            //         message: "Email verification required"
            //     })
            // }

            // Map session user to req.user for use in controllers
            // We use 'as UserRole' because Better Auth sees additional fields as strings by default
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role as UserRole,
                // emailVerified: session.user.emailVerified
            };

            // Check if the user's role is allowed for this route
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have the required permissions"
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;