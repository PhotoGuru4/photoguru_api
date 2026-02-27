import {
  Injectable,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { FirebaseService } from 'src/shared/firebase/firebase.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UserRole } from '@prisma/client';
import * as admin from 'firebase-admin';
import { MESSAGES } from 'src/common/constants/messages';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private firebase: FirebaseService,
  ) {}

  async createChatRoom(
    userId: number,
    dto: CreateChatRoomDto,
    userRole: string,
  ) {
    if (userRole !== 'CUSTOMER') {
      throw new ForbiddenException(MESSAGES.CHAT.ONLY_CUSTOMER_CAN_CREATE);
    }
    const { photographerId, conceptId } = dto;

    const photographer = await this.prisma.photographer.findUnique({
      where: { userId: photographerId },
    });
    if (!photographer) {
      throw new BadRequestException(MESSAGES.CHAT.PHOTOGRAPHER_NOT_FOUND);
    }

    const concept = await this.prisma.concept.findFirst({
      where: { id: conceptId, photographerId },
    });
    if (!concept) {
      throw new BadRequestException(MESSAGES.CHAT.CONCEPT_NOT_FOUND);
    }

    let room = await this.prisma.chatRoom.findFirst({
      where: {
        clientId: userId,
        photographerId,
        conceptId,
      },
    });

    if (!room) {
      room = await this.prisma.chatRoom.create({
        data: {
          clientId: userId,
          photographerId,
          conceptId,
        },
      });

      try {
        await this.firebase.firestore
          .collection('chatRooms')
          .doc(room.id.toString())
          .set({
            id: room.id,
            clientId: userId,
            photographerId,
            conceptId,
            createdAt: admin.firestore.Timestamp.fromDate(room.createdAt),
            updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
          });
        this.logger.log(
          MESSAGES.CHAT.FIRESTORE_CREATE_SUCCESS.replace(
            '{id}',
            room.id.toString(),
          ),
        );
      } catch (error) {
        this.logger.error(
          `${MESSAGES.CHAT.FIRESTORE_CREATE_FAILED}: ${(error as Error).message}`,
        );
      }
    }

    return this.getChatRoomById(room.id, userId);
  }

  async getMyChatRooms(userId: number, role: string) {
    const userRole =
      role === 'PHOTOGRAPHER' ? UserRole.PHOTOGRAPHER : UserRole.CUSTOMER;
    const where =
      userRole === UserRole.CUSTOMER
        ? { clientId: userId }
        : { photographerId: userId };

    const rooms = await this.prisma.chatRoom.findMany({
      where,
      include: {
        client: { select: { id: true, fullName: true, avatarUrl: true } },
        photographer: {
          include: { user: { select: { fullName: true, avatarUrl: true } } },
        },
        concept: { select: { id: true, name: true, thumbnailUrl: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return rooms.map((room) => ({
      id: room.id,
      participant:
        userRole === UserRole.CUSTOMER
          ? {
              id: room.photographer.userId,
              name: room.photographer.user.fullName,
              avatar: room.photographer.user.avatarUrl,
            }
          : {
              id: room.client.id,
              name: room.client.fullName,
              avatar: room.client.avatarUrl,
            },
      concept: room.concept,
      createdAt: room.createdAt,
    }));
  }

  async getChatRoomById(roomId: number, currentUserId?: number) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        client: { select: { id: true, fullName: true, avatarUrl: true } },
        photographer: {
          include: { user: { select: { fullName: true, avatarUrl: true } } },
        },
        concept: {
          select: {
            id: true,
            name: true,
            thumbnailUrl: true,
            description: true,
          },
        },
      },
    });
    if (!room) {
      throw new BadRequestException(MESSAGES.CHAT.ROOM_NOT_FOUND);
    }

    if (
      currentUserId &&
      room.clientId !== currentUserId &&
      room.photographerId !== currentUserId
    ) {
      throw new ForbiddenException(MESSAGES.CHAT.ACCESS_DENIED);
    }

    return room;
  }
}
