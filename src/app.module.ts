import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConceptsModule } from './modules/concepts/concepts.module';
import { UsersModule } from './modules/users/users.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ChatModule } from './modules/chat/chat.module';
import { AiGuideModule } from './modules/ai-guide/ai-guide.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    AuthModule,
    ConceptsModule,
    UsersModule,
    DashboardModule,
    ChatModule,
    AiGuideModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
