import { Request, Response, NextFunction, request, response } from 'express';
import authConfig from '@config/auth';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated (
    request: Request,
    response: Response,
    next: NextFunction,
) : void {
    const authHeader = request.headers.authorization;

    if(!authHeader){
        throw new AppError('JWT token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);
        const { sub } = decoded as ITokenPayload;

        request.user = {
            id: sub,
        };

        return next();
    } catch (error) {
        throw new AppError('Invali JWT token');
    }
}
