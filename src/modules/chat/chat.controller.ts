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
    return this.chatService.createChatRoom(req.user.sub, dto, req.user.role);
  }

  @Get()
  @ApiOperation({ summary: 'Get my chat rooms' })
  async getMyRooms(@Req() req: RequestWithUser) {
    return this.chatService.getMyChatRooms(req.user.sub, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat room details by ID' })
  async getRoom(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.chatService.getChatRoomById(Number(id), req.user.sub);
  }
}
