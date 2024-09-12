import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Payload, { IPayload } from '../../Models/Auth/Payload';

@Injectable()
export class JwtSecurityService {
    constructor(private readonly _jwtService: JwtService) { }

    async generateAccessToken(uuid: string, id: number): Promise<string | null> {
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not defined');
        }

        try {
            const payload: IPayload = { uuid, id };
            const tokenExpiration = '1h';
            return this._jwtService.sign(payload, {
                expiresIn: tokenExpiration,
                secret: process.env.JWT_SECRET_KEY,
            });
        } catch (error) {
            console.error('JWT creation error', error);
            return null;
        }
    }

    async generateRefreshToken(uuid: string, id: number): Promise<string> {
        try {
            const payload: IPayload = { uuid, id };
            return this._jwtService.sign(payload, {
                secret: process.env.JWT_SECRET_KEY_REFRESH_TOKEN,
                expiresIn: '5w',
            });
        } catch (error) {
            console.error('JWT RefreshToken creation error');
            return null;
        }
    }

    async verifyRefreshToken(token: string): Promise<Payload> {
        return this._jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY_REFRESH_TOKEN });
    }

    async verifyAccessToken(token: string): Promise<Payload> {
        try {
            return this._jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}