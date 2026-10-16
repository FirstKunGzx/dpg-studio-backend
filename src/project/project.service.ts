import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  // 🌟 เพิ่ม images: true ใน include เพื่อให้ดึงรูปภาพแกลเลอรีทั้งหมดส่งกลับไปหน้าบ้าน
  findAll() {
    return this.prisma.project.findMany({
      include: { category: true, images: true },
    });
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { category: true, images: true },
    });
  }

  // 🌟 แก้ไขฟังก์ชัน create ให้รองรับการบันทึก additionalImages ลงตาราง ProjectImage
  create(createProjectDto: any) {
    const { additionalImages, ...projectData } = createProjectDto;

    return this.prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
        imageUrl: projectData.imageUrl, 
        videoUrl: projectData.videoUrl,       
        documentUrl: projectData.documentUrl, 
        categoryId: Number(projectData.categoryId),
        authorName: projectData.authorName || 'ไม่ระบุชื่อ', 
        authorId: projectData.authorId || null,
        location: projectData.location || null,
        // สร้างความสัมพันธ์บันทึกรูปลงตาราง ProjectImage อัตโนมัติ
        images: additionalImages && additionalImages.length > 0 ? {
          create: additionalImages.map((url: string) => ({ url }))
        } : undefined
      },
      include: { images: true, category: true }
    });
  }

  // 🌟 แก้ไขฟังก์ชัน update ให้รองรับการอัปเดตและจัดการรูปภาพแกลเลอรีเพิ่มเติม
  async update(id: number, updateProjectDto: any) {
    const { additionalImages, ...projectData } = updateProjectDto;

    // ถ้ามีการส่งข้อมูล additionalImages มา ให้เคลียร์รูปเก่าทิ้งแล้วสร้างใหม่ทั้งหมด
    if (additionalImages !== undefined) {
      await this.prisma.projectImage.deleteMany({ where: { projectId: id } });
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        title: projectData.title,
        description: projectData.description,
        imageUrl: projectData.imageUrl,
        videoUrl: projectData.videoUrl,       
        documentUrl: projectData.documentUrl, 
        categoryId: projectData.categoryId ? Number(projectData.categoryId) : undefined,
        authorName: projectData.authorName, 
        location: projectData.location,
        images: additionalImages && additionalImages.length > 0 ? {
          create: additionalImages.map((url: string) => ({ url }))
        } : undefined
      },
      include: { images: true, category: true }
    });
  }

  remove(id: number) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}