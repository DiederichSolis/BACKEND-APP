import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET || '';

export interface AuthRequest extends Request {
    usuario?: any;
}


//funcion para verificar el token
export const verificartoken = (req: AuthRequest, res: Response, next: NextFunction): any => {
    const token = req.header('Authorization')?.replace('Bearer ', '')


    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado, acceso de negado' });

    }

    try {
        const decodificado = jwt.verify(token, JWT_SECRET);

        req.usuario = decodificado;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token no valido o ya expiro, acceso de negado' });
    }



}