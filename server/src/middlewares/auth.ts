import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken";

interface JwtPayload {
    id: string;
    email: string;
    admin: boolean;
}

// Adiciona o tipo `user` na Request (para TypeScript)
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken; // lê o cookie
    if (!token) {
        res.status(401).json({ error: "Acesso negado" });
        return;
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
        req.user = decoded; // adiciona o usuário decodificado
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido" });
    }
};

// Middleware para verificar admin
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.admin) {
        res.status(403).json({ error: "Acesso restrito a administradores" });
        return;
    }
    next();
};
