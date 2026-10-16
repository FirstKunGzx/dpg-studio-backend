import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { JwtModule } from '@nestjs/jwt'; // 🌟 1. นำเข้า JwtModule

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CategoryModule } from './category/category.module.js';
import { ProjectModule } from './project/project.module.js';

import { AuthController } from './auth/auth.controller.js'; // 🌟 2. นำเข้า AuthController
import { AuthService } from './auth/auth.service.js'; // 🌟 3. นำเข้า AuthService

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'portfolio-backend',
    }),
    PrismaModule,
    CategoryModule,
    ProjectModule,
    
    // 🌟 4. ลงทะเบียน JwtModule สำหรับสร้าง Token
    JwtModule.register({
      global: true,
      secret: 'YOUR_SECRET_KEY', // ในระบบจริงควรดึงจากไฟล์ .env
      signOptions: { expiresIn: '1d' }, // กำหนดให้ Login อยู่ได้ 1 วัน
    }),
  ],
  controllers: [AppController, AuthController], // 🌟 5. เพิ่ม AuthController ลงในระบบ
  providers: [AppService, AuthService], // 🌟 6. เพิ่ม AuthService ลงในระบบ
})
export class AppModule {}