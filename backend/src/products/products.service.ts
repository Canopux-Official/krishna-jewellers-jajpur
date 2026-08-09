import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto, ImageMetaDto, parseFormBool } from './dto/product.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { CloudinaryService } from '../uploads/cloudinary.service';
import { Purity, Prisma } from '@prisma/client';

export const PURITY_MAP: Record<string, Purity> = {
  '24K': Purity.KARAT_24, '22K': Purity.KARAT_22, '18K': Purity.KARAT_18, '14K': Purity.KARAT_14,
  KARAT_24: Purity.KARAT_24, KARAT_22: Purity.KARAT_22, KARAT_18: Purity.KARAT_18, KARAT_14: Purity.KARAT_14,
};
export const PURITY_LABEL: Record<Purity, string> = {
  KARAT_24: '24K', KARAT_22: '22K', KARAT_18: '18K', KARAT_14: '14K',
};

const INCLUDE_IMAGES = {
  images: { orderBy: { order: 'asc' as const } },
  category: { select: { id: true, name: true, slug: true } },
};

const MAX_IMAGES = 10;

function formatProduct(p: any) {
  return { ...p, purity: PURITY_LABEL[p.purity as Purity], categorySlug: p.category?.slug };
}

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
    private cloudinary: CloudinaryService,
  ) {}

  async findAll(query: ProductQueryDto) {
    const { search, category, purity, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10, featured, available, newArrival } = query;

    const where: Prisma.ProductWhereInput = {
      isHidden: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
          { tags: { hasSome: [search.toLowerCase()] } },
        ],
      }),
      ...(category && { category: { slug: category } }),
      ...(purity && PURITY_MAP[purity] && { purity: PURITY_MAP[purity] }),
      ...(featured !== undefined && { isFeatured: featured }),
      ...(available !== undefined && { isAvailable: available }),
      ...(newArrival !== undefined && { isNewArrival: newArrival }),
    };

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({ where, include: INCLUDE_IMAGES, orderBy: { [sortBy]: order }, skip: (page - 1) * limit, take: limit }),
    ]);

    return { data: products.map(formatProduct), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllAdmin(query: ProductQueryDto) {
    const { search, category, purity, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = query;
    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
          { purity: PURITY_MAP[search] ? { equals: PURITY_MAP[search] } : undefined },
        ].filter(Boolean) as any,
      }),
      ...(category && { category: { slug: category } }),
      ...(purity && PURITY_MAP[purity] && { purity: PURITY_MAP[purity] }),
    };
    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({ where, include: INCLUDE_IMAGES, orderBy: { [sortBy]: order }, skip: (page - 1) * limit, take: limit }),
    ]);
    return { data: products.map(formatProduct), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({ where: { slug }, include: INCLUDE_IMAGES });
    if (!product || product.isHidden) throw new NotFoundException('Product not found');
    return formatProduct(product);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: INCLUDE_IMAGES });
    if (!product) throw new NotFoundException('Product not found');
    return formatProduct(product);
  }

  async create(dto: CreateProductDto, userId?: string) {
    const slug = await this.generateSlug(dto.name);
    const purity = PURITY_MAP[dto.purity] || (dto.purity as Purity);
    const { imagesMeta = [], ...rest } = dto;

    if (imagesMeta.length > MAX_IMAGES) {
      throw new BadRequestException(`Maximum ${MAX_IMAGES} images per product`);
    }

    let isAvailable = true;
    let isSoldOut = false;
    if (rest.stockStatus === 'made_to_order') {
      isAvailable = false;
      isSoldOut = false;
    } else if (rest.stockStatus === 'sold_out') {
      isAvailable = false;
      isSoldOut = true;
    } else if (rest.stockStatus === 'in_stock') {
      isAvailable = true;
      isSoldOut = false;
    } else {
      // Legacy boolean fields (only if stockStatus omitted)
      isAvailable = parseFormBool(rest.isAvailable, true);
      isSoldOut = isAvailable ? false : parseFormBool(rest.isSoldOut, false);
    }

    const product = await this.prisma.product.create({
      data: {
        name: rest.name,
        categoryId: rest.categoryId,
        weight: rest.weight ?? '',
        weightGrams: rest.weightGrams ?? 0,
        price: rest.price,
        priceValue: rest.priceValue,
        description: rest.description ?? '',
        makingStyle: rest.makingStyle,
        isNewArrival: parseFormBool(rest.isNewArrival, false),
        isFeatured: parseFormBool(rest.isFeatured, false),
        isAvailable,
        isSoldOut,
        // Always publish on create — hide later from Products list
        isHidden: false,
        tags: rest.tags ?? [],
        slug,
        purity,
        images: {
          create: imagesMeta.map((img, i) => ({
            url: img.url,
            publicId: img.publicId,
            width: img.width,
            height: img.height,
            order: img.order ?? i,
            isFeatured: img.isFeatured ?? i === 0,
          })),
        },
      },
      include: INCLUDE_IMAGES,
    });
    await this.activityLog.log('product', 'Product Created', `"${product.name}" added to catalogue`, userId);
    if (imagesMeta.length) {
      await this.activityLog.log('product', 'Image Uploaded', `${imagesMeta.length} image(s) uploaded for "${product.name}"`, userId);
    }
    return formatProduct(product);
  }

  async update(id: string, dto: UpdateProductDto, userId?: string) {
    await this.findOne(id);
    const { imagesMeta, ...rest } = dto;
    const purity = rest.purity ? (PURITY_MAP[rest.purity] || (rest.purity as Purity)) : undefined;

    const data: Prisma.ProductUpdateInput = {
      ...(rest.name !== undefined && { name: rest.name }),
      ...(rest.categoryId && { category: { connect: { id: rest.categoryId } } }),
      ...(rest.weight !== undefined && { weight: rest.weight }),
      ...(rest.weightGrams !== undefined && { weightGrams: rest.weightGrams }),
      ...(rest.price !== undefined && { price: rest.price }),
      ...(rest.priceValue !== undefined && { priceValue: rest.priceValue }),
      ...(rest.description !== undefined && { description: rest.description }),
      ...(rest.makingStyle !== undefined && { makingStyle: rest.makingStyle }),
      ...(rest.isNewArrival !== undefined && { isNewArrival: parseFormBool(rest.isNewArrival, false) }),
      ...(rest.isFeatured !== undefined && { isFeatured: parseFormBool(rest.isFeatured, false) }),
      ...(rest.isHidden !== undefined && { isHidden: parseFormBool(rest.isHidden, false) }),
      ...(rest.tags !== undefined && { tags: rest.tags }),
      ...(purity && { purity }),
    };

    if (rest.isAvailable !== undefined || rest.isSoldOut !== undefined) {
      const nextAvailable =
        rest.isAvailable !== undefined
          ? parseFormBool(rest.isAvailable, true)
          : undefined;
      const nextSoldOut =
        rest.isSoldOut !== undefined
          ? parseFormBool(rest.isSoldOut, false)
          : undefined;

      if (nextAvailable !== undefined) data.isAvailable = nextAvailable;
      if (nextSoldOut !== undefined) data.isSoldOut = nextSoldOut;
      // Available in-stock wins over sold-out when both would be true
      if ((nextAvailable ?? true) === true && (nextSoldOut ?? false) === true) {
        data.isSoldOut = false;
      }
      if (nextSoldOut === true && nextAvailable === undefined) {
        data.isAvailable = false;
      }
    }

    // Append new images (do not wipe existing unless client sends replace flag via imagesMeta replace-all)
    if (imagesMeta?.length) {
      const existingCount = await this.prisma.productImage.count({ where: { productId: id } });
      if (existingCount + imagesMeta.length > MAX_IMAGES) {
        throw new BadRequestException(`Maximum ${MAX_IMAGES} images per product`);
      }
      data.images = {
        create: imagesMeta.map((img, i) => ({
          url: img.url,
          publicId: img.publicId,
          width: img.width,
          height: img.height,
          order: existingCount + i,
          isFeatured: false,
        })),
      };
    }

    const product = await this.prisma.product.update({ where: { id }, data, include: INCLUDE_IMAGES });
    await this.activityLog.log('product', 'Product Updated', `"${product.name}" updated`, userId);
    return formatProduct(product);
  }

  async addImages(productId: string, imagesMeta: ImageMetaDto[], userId?: string) {
    const product = await this.findOne(productId);
    const existingCount = product.images?.length || 0;
    if (existingCount + imagesMeta.length > MAX_IMAGES) {
      throw new BadRequestException(`Maximum ${MAX_IMAGES} images per product`);
    }
    await this.prisma.productImage.createMany({
      data: imagesMeta.map((img, i) => ({
        productId,
        url: img.url,
        publicId: img.publicId,
        width: img.width,
        height: img.height,
        order: existingCount + i,
        isFeatured: existingCount === 0 && i === 0,
      })),
    });
    await this.activityLog.log('product', 'Image Uploaded', `${imagesMeta.length} image(s) added to "${product.name}"`, userId);
    return this.findOne(productId);
  }

  async deleteImage(productId: string, imageId: string, userId?: string) {
    const image = await this.prisma.productImage.findFirst({ where: { id: imageId, productId } });
    if (!image) throw new NotFoundException('Image not found');
    if (image.publicId) await this.cloudinary.deleteByPublicId(image.publicId);
    await this.prisma.productImage.delete({ where: { id: imageId } });
    await this.activityLog.log('product', 'Image Deleted', `Image removed from product`, userId);
    return this.findOne(productId);
  }

  async reorderImages(productId: string, imageIds: string[], userId?: string) {
    await this.findOne(productId);
    await this.prisma.$transaction(
      imageIds.map((id, order) =>
        this.prisma.productImage.updateMany({ where: { id, productId }, data: { order } }),
      ),
    );
    await this.activityLog.log('product', 'Product Updated', `Image order changed`, userId);
    return this.findOne(productId);
  }

  async setFeaturedImage(productId: string, imageId: string) {
    await this.findOne(productId);
    await this.prisma.$transaction([
      this.prisma.productImage.updateMany({ where: { productId }, data: { isFeatured: false } }),
      this.prisma.productImage.updateMany({ where: { id: imageId, productId }, data: { isFeatured: true } }),
    ]);
    return this.findOne(productId);
  }

  async toggleHidden(id: string, userId?: string) {
    const product = await this.findOne(id);
    const updated = await this.prisma.product.update({ where: { id }, data: { isHidden: !product.isHidden }, include: INCLUDE_IMAGES });
    await this.activityLog.log('product', updated.isHidden ? 'Product Hidden' : 'Product Shown', `"${updated.name}" visibility changed`, userId);
    return formatProduct(updated);
  }

  async toggleFeatured(id: string, userId?: string) {
    const product = await this.findOne(id);
    const updated = await this.prisma.product.update({ where: { id }, data: { isFeatured: !product.isFeatured }, include: INCLUDE_IMAGES });
    await this.activityLog.log('product', 'Product Updated', `"${updated.name}" featured=${updated.isFeatured}`, userId);
    return formatProduct(updated);
  }

  async toggleSoldOut(id: string, userId?: string) {
    const product = await this.findOne(id);
    const updated = await this.prisma.product.update({ where: { id }, data: { isSoldOut: !product.isSoldOut }, include: INCLUDE_IMAGES });
    return formatProduct(updated);
  }

  async remove(id: string, userId?: string) {
    const product = await this.findOne(id);
    for (const img of product.images || []) {
      if (img.publicId) await this.cloudinary.deleteByPublicId(img.publicId);
    }
    await this.prisma.product.delete({ where: { id } });
    await this.activityLog.log('product', 'Product Deleted', `"${product.name}" permanently deleted`, userId);
    return { message: 'Product deleted' };
  }

  private async generateSlug(name: string): Promise<string> {
    const base = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let slug = base;
    let counter = 1;
    while (await this.prisma.product.findUnique({ where: { slug } })) {
      slug = `${base}-${counter++}`;
    }
    return slug;
  }
}
