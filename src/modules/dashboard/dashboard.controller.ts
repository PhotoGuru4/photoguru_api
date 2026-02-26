import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from '../auth/guards/at.guard';
import { GetDashboardDto } from './dto/get-dashboard.dto';
import { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@UseGuards(AtGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('photographer/summary')
  @ApiOperation({
    summary: 'Get photographer greeting and earnings (today & this month)',
  })
  async getSummary(@Req() req: RequestWithUser) {
    return this.dashboardService.getDashboardSummary(req.user.sub);
  }

  @Get('photographer/schedules')
  @ApiOperation({
    summary: 'Get photographer booking schedules for a specific month',
  })
  async getSchedules(
    @Req() req: RequestWithUser,
    @Query() query: GetDashboardDto,
  ) {
    return this.dashboardService.getDashboardSchedules(req.user.sub, query);
  }
}
