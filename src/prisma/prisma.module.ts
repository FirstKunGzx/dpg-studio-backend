import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global() // คำสั่งนี้คือการประกาศให้แผนกอื่นๆ เรียกใช้งาน Prisma ได้เลย
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // อนุญาตให้ส่งออกไปให้คนอื่นใช้
})
export class PrismaModule {}