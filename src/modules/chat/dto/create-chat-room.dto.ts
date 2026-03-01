import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRoomDto {
  @ApiProperty({
    description: 'ID of the photographer',
    example: 5,
  })
  @IsInt()
  @IsPositive()
  photographerId: number;

  @ApiProperty({
    description: 'ID of the concept',
    example: 12,
  })
  @IsInt()
  @IsPositive()
  conceptId: number;
}
