import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConceptsModule } from './modules/concepts/concepts.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    CloudinaryModule,
    AuthModule,
    ConceptsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
