import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ----------------------------
  // Enregistrement utilisateur
  // ----------------------------
  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        role: registerDto.role || Role.USER,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user,
      access_token: token,
    };
  }

  // ----------------------------
  // Connexion utilisateur
  // ----------------------------
  async login({ email, password }: LoginDto) {
    const [user] = await Promise.all([this.prisma.user.findUnique({
      where: { email },
    })]);

    // Toujours même message pour éviter de révéler l'existence d'un compte
    if (!user) throw new UnauthorizedException('Invalid credentials');

    let isPasswordValid: Promise<boolean>;
    isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      access_token: token,
    };
  }

  // ----------------------------
  // Validation utilisateur par JWT
  // ----------------------------
  async validateUser(userId: string): Promise<{ id: string; email: string; role: Role }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  // ----------------------------
  // Génération JWT
  // ----------------------------
  private generateToken(userId: string, email: string, role: Role): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }
}
