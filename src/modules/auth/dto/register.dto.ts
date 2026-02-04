import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
    email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
    fullName: string;

  @IsEnum(UserRole, { message: 'Role must be either CLIENT or PHOTOGRAPHER' })
    role: UserRole;
}
