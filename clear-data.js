import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clearAll() {
  // สั่งลบข้อมูลในตาราง Project ทั้งหมด
  const result = await prisma.project.deleteMany();
  console.log(`✅ ล้างผลงานทิ้งไปทั้งหมด ${result.count} ชิ้น เรียบร้อยแล้ว!`);
}

clearAll()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });