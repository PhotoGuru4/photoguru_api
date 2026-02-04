import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '../../common/config/prisma';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client = prisma;

  async onModuleInit() {
    await prisma.$connect();
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
  }
}
