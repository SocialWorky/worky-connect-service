// create-notification.dto.ts
import { IsString, IsOptional, IsBoolean, IsJSON } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  type: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsJSON()
  additionalData?: Record<string, any>;
}
