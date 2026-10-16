import { Controller, Post, Body, Param, Patch, Get, Delete } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  // แอดมินอัปเดตสิทธิ์ (เช่น อนุมัติ CREATOR)
  @Patch('admin/role')
  updateRole(@Body() body: { adminId: number, targetUserId: number, newRole: string }) {
    return this.authService.changeRole(body.adminId, body.targetUserId, body.newRole);
  }

  // แอดมินระงับผู้ใช้
  @Patch('admin/status')
  updateStatus(@Body() body: { adminId: number, targetUserId: number, newStatus: string }) {
    return this.authService.changeStatus(body.adminId, body.targetUserId, body.newStatus);
  }

  // 🌟 แอดมินดึงรายชื่อผู้ใช้งานทั้งหมด
  @Get('users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  // 🌟 แอดมินลบผู้ใช้งาน
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(Number(id));
  }
}