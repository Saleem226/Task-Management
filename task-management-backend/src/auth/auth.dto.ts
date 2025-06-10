import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/users/user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface UserPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  email: string;
  sub: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
