import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Password for the account (minimum 6 characters)',
    example: 'P@ssw0rd',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({
    description: 'Role of the user (CUSTOMER or PHOTOGRAPHER)',
    enum: UserRole,
    example: 'CUSTOMER',
  })
  @IsEnum(UserRole, { message: 'Role must be either CUSTOMER or PHOTOGRAPHER' })
  role: UserRole;

  @ApiProperty({
    description: 'Province/City of the user',
    example: 'Thành phố Hồ Chí Minh',
  })
  @IsString()
  @IsNotEmpty({ message: 'Province is required' })
  province: string;

  @ApiProperty({
    description: 'Ward/District of the user',
    example: 'Phường Thủ Dầu Một',
  })
  @IsString()
  @IsNotEmpty({ message: 'Ward is required' })
  ward: string;
}
