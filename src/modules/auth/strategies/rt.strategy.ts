import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtPayload, JwtPayloadWithRt } from '../interfaces/jwt-payload.interface';
import { MESSAGES } from 'src/common/constants/messages';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let data = req?.cookies?.refresh_token;
          if (!data) data = req?.body?.refresh_token;
          return data;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayloadWithRt> {
    const refreshToken = req?.cookies?.refresh_token || req?.body?.refresh_token;
    if (!refreshToken) throw new ForbiddenException(MESSAGES.AUTH.TOKEN_MALFORMED);
    return { ...payload, refreshToken };
  }
}
