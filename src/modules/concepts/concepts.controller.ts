import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ConceptsService } from './concepts.service';
import { GetRecommendationsDto } from './dto/get-recommendations.dto';
import { AtGuard } from '../auth/guards/at.guard';
import { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { GetConceptsDto } from './dto/get-concepts.dto';
interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('concepts')
export class ConceptsController {
  constructor(private readonly conceptsService: ConceptsService) {}
  @UseGuards(AtGuard)
  @Get()
  async findAll(@Query() query: GetConceptsDto) {
    return this.conceptsService.findAll(query);
  }
  @UseGuards(AtGuard)
  @Get('recommended')
  async getRecommended(
    @Req() req: RequestWithUser,
    @Query() query: GetRecommendationsDto,
  ) {
    return this.conceptsService.getRecommended(req.user.sub, query);
  }
}
