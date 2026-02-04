import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { MESSAGES } from 'src/common/constants/messages';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private setCookie(res: Response, refreshToken: string): void {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  async register(dto: RegisterDto, res: Response) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (userExists) throw new BadRequestException(MESSAGES.AUTH.EMAIL_EXISTS);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          fullName: dto.fullName,
          role: dto.role,
        },
      });
      if (dto.role === UserRole.PHOTOGRAPHER) {
        await tx.photographer.create({ data: { userId: user.id } });
      }
      return user;
    });

    const tokens = await this.generateTokens(
      newUser.id,
      newUser.email,
      newUser.role,
    );
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);
    this.setCookie(res, tokens.refresh_token);

    return {
      message: MESSAGES.AUTH.REGISTER_SUCCESS,
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
      },
    };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user)
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    this.setCookie(res, tokens.refresh_token);

    return {
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: { id: user.id, email: user.email, role: user.role },
      },
    };
  }

  async logout(userId: number, res: Response) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { message: MESSAGES.AUTH.LOGOUT_SUCCESS };
  }

  async refreshTokens(userId: number, rt: string, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.refreshToken)
      throw new ForbiddenException(MESSAGES.AUTH.ACCESS_DENIED);

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException(MESSAGES.AUTH.ACCESS_DENIED);

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    this.setCookie(res, tokens.refresh_token);

    return {
      message: MESSAGES.AUTH.REFRESH_SUCCESS,
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }

  async generateTokens(userId: number, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };
    const accessTokenOptions: JwtSignOptions = {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: process.env
        .JWT_ACCESS_EXPIRES_IN as JwtSignOptions['expiresIn'],
    };

    const refreshTokenOptions: JwtSignOptions = {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: process.env
        .JWT_REFRESH_EXPIRES_IN as JwtSignOptions['expiresIn'],
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, accessTokenOptions),
      this.jwtService.signAsync(payload, refreshTokenOptions),
    ]);

    return { access_token: at, refresh_token: rt };
  }
}
