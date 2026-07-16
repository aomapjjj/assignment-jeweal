import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, InventoryStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data: dto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = (error.meta?.target as string[])?.join(', ');
        throw new ConflictException(`${target} already exits`);
      }
      throw error;
    }
  }

  async findAll(query: QueryProductDto) {
    const {
      search,
      category,
      productType,
      material,
      status,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const where: Prisma.ProductWhereInput = {
      ...(category && { category }),
      ...(productType && { productType }),
      ...(material && { material }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { sku: { contains: search, mode: 'insensitive' } },
          { productCode: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
          { productType: { contains: search, mode: 'insensitive' } },
          { gemstone: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    // ใช้ $transaction เพื่อให้ count และ data มาจาก snapshot เดียวกัน
    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Not found ${id}`);
    }
    return product;
  }

  /**
   * แนะนำสินค้าที่คล้ายกัน
   * เกณฑ์: category เดียวกัน + ราคาอยู่ในช่วง ±20% + ยังไม่ถูกขาย (ไม่ใช่ SOLD)
   * เรียงตามความใกล้เคียงของราคา (ห่างจากสินค้าอ้างอิงน้อยสุดมาก่อน)
   *
   * ข้อเสนอแนะสำหรับ production (ไม่ทำในเวลาจำกัดวันนี้):
   * - เพิ่ม weighting: material ตรงกัน, gemstone ตรงกัน ให้คะแนนสูงกว่า
   * - ใช้ pgvector + embedding จาก description/รูปภาพ สำหรับ similarity search จริง
   * - เก็บ "view together" / "bought together" behavior เพื่อทำ collaborative filtering
   */
  async findSimilar(id: string, take = 8) {
    const product = await this.findOne(id);

    const priceMin = Number(product.price) * 0.8;
    const priceMax = Number(product.price) * 1.2;

    const similar = await this.prisma.product.findMany({
      where: {
        id: { not: id },
        category: product.category,
        status: { not: InventoryStatus.SOLD },
        price: { gte: priceMin, lte: priceMax },
      },
      take,
    });

    // เรียงตามระยะห่างราคาจากสินค้าอ้างอิง (ใกล้สุดมาก่อน) - ทำใน memory เพราะ Prisma ไม่รองรับ ORDER BY ABS() ตรงๆ
    const targetPrice = Number(product.price);
    similar.sort(
      (a, b) =>
        Math.abs(Number(a.price) - targetPrice) -
        Math.abs(Number(b.price) - targetPrice),
    );

    return similar;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    // ป้องกันการลบสินค้าที่เคยถูกอ้างอิงใน OrderItem (data integrity / ประวัติการขาย)
    const orderItemCount = await this.prisma.orderItem.count({
      where: { productId: id },
    });
    if (orderItemCount > 0) {
      throw new ConflictException(
        'ไม่สามารถลบสินค้าที่มีประวัติการสั่งซื้อได้ แนะนำให้ใช้ soft delete แทน',
      );
    }
    return this.prisma.product.delete({ where: { id } });
  }
}
