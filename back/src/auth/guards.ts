import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException, SetMetadata } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export const Roles = (...roles:string[]) => SetMetadata('roles',roles);
@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private jwt:JwtService,private db:PrismaService) {}
  async canActivate(context:ExecutionContext) {
    const req = GqlExecutionContext.create(context).getContext().req;
    const header=req.headers.authorization;
    if(typeof header!=='string' || !header.startsWith('Bearer ')) throw new UnauthorizedException('Inicia sesión para continuar.');
    try {
      const payload=await this.jwt.verifyAsync(header.slice(7));
      if(typeof payload.sid!=='string'||typeof payload.sub!=='string') throw new Error();
      const session=await this.db.session.findUnique({where:{id:payload.sid},include:{user:true}});
      if(!session||session.revoked||session.userId!==payload.sub||session.expiresAt<=new Date()) throw new Error();
      req.user=session.user; req.sessionId=session.id;
      return true;
    } catch { throw new UnauthorizedException('Tu sesión expiró. Vuelve a iniciar sesión.'); }
  }
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector:Reflector) {}
  canActivate(context:ExecutionContext) {
    const roles=this.reflector.getAllAndOverride<string[]>('roles',[context.getHandler(),context.getClass()]);
    const user=GqlExecutionContext.create(context).getContext().req.user;
    if(roles?.length && !roles.includes(user?.role)) throw new ForbiddenException('Esta acción requiere el rol administrador.');
    return true;
  }
}
