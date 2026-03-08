import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditImageDto {
  @ApiProperty({
    description: 'Base64 encoded image to edit (JPEG/PNG)',
    example: '/9j/4AAQSkZJRgABAQAAAQABAAD...',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Instruction for editing the image',
    example: 'Make the colors more vibrant and increase the contrast',
  })
  @IsString()
  @IsNotEmpty()
  instruction: string;
}
