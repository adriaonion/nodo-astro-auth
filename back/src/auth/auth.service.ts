import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginInput, RegisterInput } from '../dto';
@Injectable()
export class AuthService {
  constructor(private db: PrismaService, private jwt: JwtService) {}
  async register(input: RegisterInput) {
    if (Buffer.byteLength(input.password,'utf8') > 72 || input.name.trim().length < 2) throw new BadRequestException('Revisa tu nombre y contraseña.');
    const email = input.email.trim().toLowerCase();
    if (await this.db.user.findUnique({where:{email}})) throw new ConflictException('Ese correo ya está registrado.');
    try {
      const user = await this.db.user.create({data:{name:input.name.trim(),email,passwordHash:await bcrypt.hash(input.password,12),role:'CLIENTE'}});
      return this.issue(user);
    } catch (e: any) { if(e.code==='P2002') throw new ConflictException('Ese correo ya está registrado.'); throw e; }
  }
  async login(input: LoginInput) {
    const user = await this.db.user.findUnique({where:{email:input.email.trim().toLowerCase()}});
    if (Buffer.byteLength(input.password,'utf8') > 72 || !user || !await bcrypt.compare(input.password,user.passwordHash)) throw new UnauthorizedException('Correo o contraseña incorrectos.');
    return this.issue(user);
  }
  private async issue(user: {id:string;name:string;email:string;role:string}) {
    const session = await this.db.session.create({data:{userId:user.id,expiresAt:new Date(Date.now()+30*60*1000)}});
    return {accessToken:await this.jwt.signAsync({sub:user.id,sid:session.id}),user};
  }
}
