import {
  Body,
  Controller,
  Post,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AtGuard } from './guards/at.guard';
import { RtGuard } from './guards/rt.guard';
import {
  JwtPayload,
  JwtPayloadWithRt,
} from './interfaces/jwt-payload.interface';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
interface RequestWithUser extends Request {
  user: JwtPayload;
}

interface RequestWithUserRt extends Request {
  user: JwtPayloadWithRt;
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @ApiOperation({ summary: 'Login to the system' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout the authenticated user' })
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(req.user.sub, res);
  }

  @UseGuards(RtGuard)
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: RequestWithUserRt,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokens(
      req.user.sub,
      req.user.refreshToken,
      res,
    );
  }
}
