import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { AtGuard } from '../auth/guards/at.guard';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { MESSAGES } from 'src/common/constants/messages';

@ApiTags('Chat')
@ApiBearerAuth('access-token')
@UseGuards(AtGuard)
@Controller('chat-rooms')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat room (when clicking Contact)' })
  async createRoom(
    @Req() req: RequestWithUser,
    @Body() dto: CreateChatRoomDto,
  ) {
    const data = await this.chatService.createChatRoom(
      req.user.sub,
      dto,
      req.user.role,
    );
    return {
      message: MESSAGES.CHAT.ROOM_CREATED,
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get my chat rooms' })
  async getMyRooms(@Req() req: RequestWithUser) {
    const data = await this.chatService.getMyChatRooms(
      req.user.sub,
      req.user.role,
    );
    return {
      message: MESSAGES.CHAT.ROOMS_FETCHED,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat room details by ID' })
  async getRoom(@Req() req: RequestWithUser, @Param('id') id: string) {
    const data = await this.chatService.getChatRoomById(
      Number(id),
      req.user.sub,
    );
    return {
      message: MESSAGES.CHAT.ROOM_FETCHED,
      data,
    };
  }
}
