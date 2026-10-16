import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // เปิดให้หน้าบ้าน (พอร์ต 4200) ส่งข้อมูลมาหาหลังบ้านได้
  app.enableCors(); 
  
  // 🌟 ขยายขนาดประตูรับข้อมูลให้รองรับรูปภาพ Base64 ได้สูงสุด 50MB
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(3000);
}
bootstrap();