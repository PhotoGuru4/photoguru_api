import { Request } from 'express';
import { JwtPayload, JwtPayloadWithRt } from './jwt-payload.interface';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

export interface RequestWithUserRt extends Request {
  user: JwtPayloadWithRt;
}
