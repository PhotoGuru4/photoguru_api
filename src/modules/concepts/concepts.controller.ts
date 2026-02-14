import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ConceptsService } from './concepts.service';
import { GetRecommendationsDto } from './dto/get-recommendations.dto';
import { AtGuard } from '../auth/guards/at.guard';
import { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { GetConceptsDto } from './dto/get-concepts.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
interface RequestWithUser extends Request {
  user: JwtPayload;
}

@ApiTags('Concepts')
@ApiBearerAuth('access-token')
@Controller('concepts')
export class ConceptsController {
  constructor(private readonly conceptsService: ConceptsService) {}
  @UseGuards(AtGuard)
  @Get()
  @ApiOperation({
    summary: 'Search concepts by keyword and filter by location',
  })
  async findAll(@Query() query: GetConceptsDto) {
    return this.conceptsService.findAll(query);
  }
  @UseGuards(AtGuard)
  @Get('recommended')
  @ApiOperation({
    summary:
      'Get personalized concept recommendations for the authenticated user',
  })
  async getRecommended(
    @Req() req: RequestWithUser,
    @Query() query: GetRecommendationsDto,
  ) {
    return this.conceptsService.getRecommended(req.user.sub, query);
  }
}
