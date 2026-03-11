import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PhotographersService } from './photographers.service';
import { AtGuard } from '../auth/guards/at.guard';
import { MESSAGES } from 'src/common/constants/messages';

@ApiTags('Photographers')
@ApiBearerAuth('access-token')
@Controller('photographers')
@UseGuards(AtGuard)
export class PhotographersController {
  constructor(private readonly photographersService: PhotographersService) {}
  @Get(':id/available-slots')
  @ApiOperation({ summary: 'Generate dynamic slots based on package duration' })
  async getAvailableSlots(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date: string,
    @Query('packageId', ParseIntPipe) packageId: number,
  ) {
    const data = await this.photographersService.generateDynamicSlots(
      id,
      date,
      packageId,
    );
    return { message: MESSAGES.PHOTOGRAPHER.AVAILABLE_SLOTS_FETCHED, data };
  }
}
