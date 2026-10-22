import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthResolver } from './auth/auth.resolver';
import { GqlAuthGuard, RolesGuard } from './auth/guards';
import { ProductsResolver } from './products/products.resolver';
import { OrdersService } from './orders/orders.service';
import { OrdersResolver } from './orders/orders.resolver';
const secret=process.env.JWT_SECRET;
if(!secret||secret.length<32) throw new Error('JWT_SECRET debe tener al menos 32 caracteres. Ejecuta npm run setup.');
@Module({
  imports:[
    JwtModule.register({secret,signOptions:{expiresIn:'30m',issuer:'nodo-api',audience:'nodo-web'},verifyOptions:{issuer:'nodo-api',audience:'nodo-web',algorithms:['HS256']}}),
    GraphQLModule.forRoot<ApolloDriverConfig>({driver:ApolloDriver,autoSchemaFile:true,sortSchema:true,context:({req}:any)=>({req}),playground:false,introspection:process.env.NODE_ENV!=='production',includeStacktraceInErrorResponses:false})
  ],
  providers:[PrismaService,AuthService,AuthResolver,GqlAuthGuard,RolesGuard,ProductsResolver,OrdersService,OrdersResolver]
})
export class AppModule {}
