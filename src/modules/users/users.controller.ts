import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AtGuard } from '../auth/guards/at.guard';
import { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AtGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: RequestWithUser) {
    return this.usersService.getProfile(req.user.sub);
  }
}
