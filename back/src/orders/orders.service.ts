import { BadRequestException, Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from '../dto';
@Injectable()
export class OrdersService {
  constructor(private db:PrismaService) {}
  async create(userId:string,input:CreateOrderInput) {
    if(new Set(input.items.map(i=>i.productId)).size!==input.items.length) throw new BadRequestException('Un producto no puede aparecer dos veces.');
    return this.db.$transaction(async tx=>{
      const previous=await tx.order.findUnique({where:{requestKey:input.requestKey},include:{items:true}});
      if(previous) {
        if(previous.userId!==userId) throw new BadRequestException('Identificador de pedido inválido.');
        return previous;
      }
      const lines=[];let totalCents=0;
      for(const line of input.items) {
        const product=await tx.product.findUnique({where:{id:line.productId}});
        if(!product) throw new BadRequestException('Un producto del carrito ya no está disponible.');
        const reserved=await tx.product.updateMany({where:{id:product.id,stock:{gte:line.quantity}},data:{stock:{decrement:line.quantity}}});
        if(reserved.count!==1) throw new ConflictException(`No hay suficiente stock de ${product.name}.`);
        totalCents+=product.priceCents*line.quantity;
        lines.push({productId:product.id,name:product.name,priceCents:product.priceCents,quantity:line.quantity});
      }
      if(totalCents>2000000000) throw new BadRequestException('El total excede el límite permitido.');
      return tx.order.create({data:{userId,requestKey:input.requestKey,totalCents,items:{create:lines}},include:{items:true}});
    });
  }
}
