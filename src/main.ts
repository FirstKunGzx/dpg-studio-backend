import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { json, urlencoded } from 'express'; // 🌟 1. เพิ่มบรรทัดนี้

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // เปิดให้ Vercel เรียกใช้งานได้
  app.enableCors();
  
  // 🌟 2. เพิ่ม 2 บรรทัดนี้ เพื่อขยายขนาดข้อมูลที่รับได้ให้เป็น 50MB (รองรับรูป Base64)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();