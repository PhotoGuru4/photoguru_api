import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { MESSAGES } from 'src/common/constants/messages';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatarUrl: true,
        role: true,
        province: true,
        ward: true,
      },
    });

    if (!user) {
      throw new NotFoundException(MESSAGES.USER.NOT_FOUND);
    }

    return {
      message: MESSAGES.USER.FETCH_PROFILE_SUCCESS,
      data: user,
    };
  }
}
