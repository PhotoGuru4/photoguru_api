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
import { FirebaseMessage } from './interfaces/message.interface';
import { ConceptDetailForChat } from './interfaces/concepdetail.interface';

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
    } else {
      this.logger.log(
        `Reusing existing chat room ${room.id} for user ${userId} and photographer ${photographerId}`,
      );
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

    const roomsWithDetails = await Promise.all(
      rooms.map(async (room) => {
        try {
          const messagesRef = this.firebase.firestore
            .collection('chatRooms')
            .doc(room.id.toString())
            .collection('messages');
          const lastMsgSnapshot = await messagesRef
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

          let lastMessage: FirebaseMessage | null = null;
          let lastMessageTime: Date | null = null;

          if (!lastMsgSnapshot.empty) {
            const doc = lastMsgSnapshot.docs[0];
            const data = doc.data() as FirebaseMessage;
            lastMessage = data;
            lastMessageTime = data.createdAt?.toDate?.() || null;
          }
          const unreadQuery = messagesRef
            .where('senderId', '!=', userId)
            .where('isRead', '==', false);

          const unreadSnapshot = await unreadQuery.count().get();
          const unreadCount = unreadSnapshot.data().count;

          return {
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
            lastMessage: lastMessage?.content || null,
            lastMessageTime,
            unreadCount,
            createdAt: room.createdAt,
          };
        } catch (error) {
          this.logger.error(
            `Failed to fetch details for room ${room.id}: ${(error as Error).message}`,
          );
          return {
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
            lastMessage: null,
            lastMessageTime: null,
            unreadCount: 0,
            createdAt: room.createdAt,
          };
        }
      }),
    );

    roomsWithDetails.sort((a, b) => {
      const timeA = a.lastMessageTime?.getTime() ?? a.createdAt.getTime();
      const timeB = b.lastMessageTime?.getTime() ?? b.createdAt.getTime();
      return timeB - timeA;
    });

    return roomsWithDetails;
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
          include: {
            packages: { select: { price: true } },
            locations: {
              select: { province: true, ward: true, addressDetail: true },
            },
          },
        },
      },
    });

    if (!room) {
      throw new BadRequestException(MESSAGES.CHAT.ROOM_NOT_FOUND);
    }

    if (!room.concept) {
      throw new BadRequestException(
        MESSAGES.CHAT.CONCEPT_NOT_FOUND_FOR_CHAT_ROOM,
      );
    }

    if (
      currentUserId &&
      room.clientId !== currentUserId &&
      room.photographerId !== currentUserId
    ) {
      throw new ForbiddenException(MESSAGES.CHAT.ACCESS_DENIED);
    }

    const prices = room.concept.packages?.map((p) => Number(p.price)) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const priceRange = `${minPrice} - ${maxPrice}`;

    const conceptDetail: ConceptDetailForChat = {
      id: room.concept.id,
      name: room.concept.name,
      thumbnailUrl: room.concept.thumbnailUrl,
      description: room.concept.description,
      minPrice,
      maxPrice,
      priceRange,
    };

    return {
      id: room.id,
      photographerId: room.photographerId,
      clientId: room.clientId,
      conceptId: room.conceptId,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      client: room.client,
      photographer: {
        userId: room.photographer.userId,
        bio: room.photographer.bio,
        experienceYears: room.photographer.experienceYears,
        ratingAvg: room.photographer.ratingAvg,
        isVerified: room.photographer.isVerified,
        socialLinks: room.photographer.socialLinks,
        user: {
          fullName: room.photographer.user.fullName,
          avatarUrl: room.photographer.user.avatarUrl,
        },
      },
      concept: conceptDetail,
    };
  }
}
