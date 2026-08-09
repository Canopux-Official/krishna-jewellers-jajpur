import { IsString, IsBoolean, IsOptional, IsNumber, IsEnum, IsArray, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export enum PurityDto {
  KARAT_24 = 'KARAT_24',
  KARAT_22 = 'KARAT_22',
  KARAT_18 = 'KARAT_18',
  KARAT_14 = 'KARAT_14',
}

export class ImageMetaDto {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  order?: number;
  isFeatured?: boolean;
}

/**
 * FormData boolean parsing.
 * IMPORTANT: never treat bare `true` from Boolean("0") as intentional —
 * only accept explicit true markers: true | 1 | '1' | 'true'.
 * Absent / '0' / 'false' / false → false (or fallback).
 */
export function parseFormBool(value: unknown, fallback = false): boolean {
  if (value === undefined || value === null || value === '') return fallback;
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true' || v === 'yes' || v === 'on') return true;
    if (v === 'false' || v === 'no' || v === 'off') return false;
  }
  return fallback;
}

const toBool = ({ value }: { value: unknown }) => parseFormBool(value, false);

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  categoryId: string;

  @IsEnum(PurityDto)
  purity: PurityDto;

  /** Optional for quick bulk-add — can be filled in later from the Products list. */
  @IsOptional()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weightGrams?: number;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceValue?: number;

  /** Optional for quick bulk-add — can be filled in later from the Products list. */
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  makingStyle?: string;

  @IsOptional()
  @Transform(toBool)
  @IsBoolean()
  isNewArrival?: boolean;

  @IsOptional()
  @Transform(toBool)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @Transform(toBool)
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @Transform(toBool)
  @IsBoolean()
  isSoldOut?: boolean;

  @IsOptional()
  @Transform(toBool)
  @IsBoolean()
  isHidden?: boolean;

  /** Preferred over separate isAvailable/isSoldOut for FormData creates */
  @IsOptional()
  @IsString()
  stockStatus?: 'in_stock' | 'made_to_order' | 'sold_out';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  /** Populated by controller after Cloudinary upload */
  imagesMeta?: ImageMetaDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ReorderImagesDto {
  @IsArray()
  @IsString({ each: true })
  imageIds: string[];
}

export class ProductQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() purity?: string;
  @IsOptional() @IsString() sortBy?: string;
  @IsOptional() @IsString() order?: 'asc' | 'desc';
  @IsOptional() @Type(() => Number) @IsNumber() page?: number = 1;
  @IsOptional() @Type(() => Number) @IsNumber() limit?: number = 10;
  @IsOptional() @Transform(toBool) @IsBoolean() featured?: boolean;
  @IsOptional() @Transform(toBool) @IsBoolean() available?: boolean;
  @IsOptional() @Transform(toBool) @IsBoolean() newArrival?: boolean;
}
