import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryModel, ProductModel } from '../models';
import { ProductInput } from '../dto';
import { GqlAuthGuard, RolesGuard, Roles } from '../auth/guards';
@Resolver()
export class ProductsResolver {
  constructor(private db:PrismaService) {}
  @Query(()=>[CategoryModel]) categories() { return this.db.category.findMany({orderBy:{name:'asc'}}); }
  @Query(()=>[ProductModel]) products() { return this.db.product.findMany({include:{category:true},orderBy:{name:'asc'}}); }
  @Mutation(()=>ProductModel) @UseGuards(GqlAuthGuard,RolesGuard) @Roles('ADMIN')
  async createProduct(@Args('input') input:ProductInput) {
    await this.category(input.categoryId);
    return this.db.product.create({data:input,include:{category:true}});
  }
  @Mutation(()=>ProductModel) @UseGuards(GqlAuthGuard,RolesGuard) @Roles('ADMIN')
  async updateProduct(@Args('id') id:string,@Args('input') input:ProductInput) {
    await this.exists(id); await this.category(input.categoryId);
    return this.db.product.update({where:{id},data:input,include:{category:true}});
  }
  @Mutation(()=>Boolean) @UseGuards(GqlAuthGuard,RolesGuard) @Roles('ADMIN')
  async deleteProduct(@Args('id') id:string) { await this.exists(id);await this.db.product.delete({where:{id}});return true; }
  private async exists(id:string) { if(!await this.db.product.findUnique({where:{id}})) throw new NotFoundException('El producto ya no existe.'); }
  private async category(id:string) { if(!await this.db.category.findUnique({where:{id}})) throw new BadRequestException('Selecciona una categoría válida.'); }
}
