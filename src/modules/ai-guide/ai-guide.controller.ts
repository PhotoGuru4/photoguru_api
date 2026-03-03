import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AtGuard } from '../auth/guards/at.guard';
import { AiGuideService } from './ai-guide.service';
import { AnalyzeImageDto } from './dto/analyze-image.dto';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@ApiTags('AI Guide')
@ApiBearerAuth()
@UseGuards(AtGuard)
@Controller('ai-guide')
export class AiGuideController {
  constructor(private readonly service: AiGuideService) {}

  @Post('analyze')
  @ApiOperation({
    summary: 'Analyze photo and return voice instruction in English',
  })
  async analyze(@Req() req: RequestWithUser, @Body() dto: AnalyzeImageDto) {
    const instruction = await this.service.analyzeImage(dto.image, dto.context);
    return { instruction };
  }
}
