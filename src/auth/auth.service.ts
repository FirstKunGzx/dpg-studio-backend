import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js'; 
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // สมัครสมาชิก
  async register(data: any) {
    const existingUser = await this.prisma.user.findUnique({ where: { username: data.username } });
    if (existingUser) throw new BadRequestException('ชื่อผู้ใช้นี้มีในระบบแล้ว');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { 
        username: data.username, 
        password: hashedPassword, 
        role: data.role || 'CREATOR' // 🌟 ปรับให้รับค่า role จากหน้าบ้าน (ค่าเริ่มต้นเป็น CREATOR)
      },
    });
  }

  // เข้าสู่ระบบ
  async login(data: any) {
    const user = await this.prisma.user.findUnique({ where: { username: data.username } });
    if (!user) throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    
    if (user.status === 'BLOCKED') throw new UnauthorizedException('บัญชีของคุณถูกระงับการใช้งาน');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload, { secret: 'YOUR_SECRET_KEY' }),
      user: { id: user.id, username: user.username, role: user.role }
    };
  }

  // แอดมิน: เปลี่ยนสิทธิ์ผู้ใช้ (เช่น VIEWER -> CREATOR)
  async changeRole(adminId: number, targetUserId: number, newRole: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (admin?.role !== 'ADMIN') throw new UnauthorizedException('คุณไม่มีสิทธิ์ทำรายการนี้');
    return this.prisma.user.update({ where: { id: targetUserId }, data: { role: newRole } });
  }

  // แอดมิน: บล็อก/ปลดบล็อกผู้ใช้
  async changeStatus(adminId: number, targetUserId: number, newStatus: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (admin?.role !== 'ADMIN') throw new UnauthorizedException('คุณไม่มีสิทธิ์ทำรายการนี้');
    return this.prisma.user.update({ where: { id: targetUserId }, data: { status: newStatus } });
  }

  // 🌟 แอดมิน: ดึงรายชื่อผู้ใช้งานทั้งหมด (ส่งกลับไปเฉพาะข้อมูลที่จำเป็น ไม่ส่ง Password)
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 🌟 แอดมิน: ลบผู้ใช้งานตาม ID
  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}