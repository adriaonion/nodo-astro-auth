import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from './orders.service';
import { CreateOrderInput } from '../dto';
import { OrderModel } from '../models';
@Resolver() @UseGuards(GqlAuthGuard)
export class OrdersResolver {
  constructor(private service:OrdersService,private db:PrismaService) {}
  @Query(()=>[OrderModel]) myOrders(@Context() ctx:any) { return this.db.order.findMany({where:{userId:ctx.req.user.id},include:{items:true},orderBy:{createdAt:'desc'}}); }
  @Mutation(()=>OrderModel) createOrder(@Args('input') input:CreateOrderInput,@Context() ctx:any) { return this.service.create(ctx.req.user.id,input); }
}
