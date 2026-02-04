import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
