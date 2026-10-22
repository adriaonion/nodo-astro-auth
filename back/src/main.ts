import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { rateLimit } from 'express-rate-limit';
import { AppModule } from './app.module';
async function bootstrap() {
  const app=await NestFactory.create(AppModule);
  const origins=(process.env.FRONTEND_ORIGIN||'http://localhost:4321').split(',').map(s=>s.trim());
  app.enableCors({origin:origins,methods:['POST','GET','OPTIONS'],allowedHeaders:['Content-Type','Authorization']});
  app.use('/graphql',rateLimit({windowMs:60_000,limit:120,standardHeaders:true,legacyHeaders:false}));
  app.useGlobalPipes(new ValidationPipe({transform:true,whitelist:true,forbidNonWhitelisted:true}));
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT||3000),process.env.HOST||'127.0.0.1');
}
bootstrap().catch(e=>{console.error(e.message);process.exitCode=1});
