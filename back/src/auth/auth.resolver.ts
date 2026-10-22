import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards';
import { AuthPayload, UserModel } from '../models';
import { LoginInput, RegisterInput } from '../dto';
import { PrismaService } from '../prisma/prisma.service';
@Resolver()
export class AuthResolver {
  constructor(private service:AuthService,private db:PrismaService) {}
  @Mutation(()=>AuthPayload) register(@Args('input') input:RegisterInput) { return this.service.register(input); }
  @Mutation(()=>AuthPayload) login(@Args('input') input:LoginInput) { return this.service.login(input); }
  @Query(()=>UserModel) @UseGuards(GqlAuthGuard) me(@Context() context:any) { return context.req.user; }
  @Mutation(()=>Boolean) @UseGuards(GqlAuthGuard)
  async logout(@Context() context:any) { await this.db.session.update({where:{id:context.req.sessionId},data:{revoked:true}}); return true; }
}
