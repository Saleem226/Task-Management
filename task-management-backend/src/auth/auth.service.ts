import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { AuthResponse, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(payload: { email: string; password: string }) {
    const existingUser = await this.userRepo.findOne({
      where: { email: payload.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hash = await bcrypt.hash(payload.password, 10);
    const user = this.userRepo.create({
      email: payload.email,
      password: hash,
      role: 'USER',
    });
    await this.userRepo.save(user);
    return {
      accessToken: this.generateToken(user).access_token,
      user: { id: user.id, email: user.email, role: user.role as UserRole },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role as UserRole },
    };
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
