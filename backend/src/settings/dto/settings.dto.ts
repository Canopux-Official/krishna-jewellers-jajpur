import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

const toBool = ({ value }: { value: unknown }) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return value;
};

export class UpdateSettingsDto {
  @IsOptional() @IsString() storeName?: string;
  @IsOptional() @IsString() adminName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() weekdayHours?: string;
  @IsOptional() @IsString() sundayHours?: string;
  @IsOptional() @IsString() instagramUrl?: string;
  @IsOptional() @IsString() instagramCaption?: string;
  @IsOptional() @IsString() facebookUrl?: string;
  @IsOptional() @IsString() googleMapsUrl?: string;

  @IsOptional() @Transform(toBool) @IsBoolean() showRates?: boolean;
  @IsOptional() @Transform(toBool) @IsBoolean() showBrandStory?: boolean;
  @IsOptional() @Transform(toBool) @IsBoolean() showCollections?: boolean;
  @IsOptional() @Transform(toBool) @IsBoolean() showCraftsmanship?: boolean;
  @IsOptional() @Transform(toBool) @IsBoolean() showTestimonials?: boolean;
  @IsOptional() @Transform(toBool) @IsBoolean() showVisitStore?: boolean;
  @IsOptional() @Transform(toBool) @IsBoolean() showOffers?: boolean;
  @IsOptional() @Transform(toBool) @IsBoolean() showGallery?: boolean;
}
