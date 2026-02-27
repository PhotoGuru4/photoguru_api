import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { FirebaseService } from 'src/shared/firebase/firebase.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService, FirebaseService],
  exports: [ChatService],
})
export class ChatModule {}
