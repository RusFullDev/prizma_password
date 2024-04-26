import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';



 const start = async()=>{
  const PORT = process.env.PORT
  const app = await NestFactory.create(AppModule);
app.setGlobalPrefix('api')
app.use(cookieParser())
app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`); 
  });
}
start();
