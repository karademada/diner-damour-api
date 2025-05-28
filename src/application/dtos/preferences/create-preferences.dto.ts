import { IsOptional, IsArray, IsBoolean, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@core/entities/profile.entity';
import { DistanceUnit } from '@core/entities/preferences.entity';

export class CreatePreferencesDto {
  @ApiPropertyOptional({
    description: 'Preferred genders',
    enum: Gender,
    isArray: true,
    example: [Gender.FEMALE],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Gender, { each: true })
  preferredGenders?: Gender[];

  @ApiPropertyOptional({
    description: 'Minimum age preference',
    example: 18,
    minimum: 18,
    maximum: 99,
  })
  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(99)
  minAge?: number;

  @ApiPropertyOptional({
    description: 'Maximum age preference',
    example: 35,
    minimum: 18,
    maximum: 99,
  })
  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(99)
  maxAge?: number;

  @ApiPropertyOptional({
    description: 'Maximum distance preference',
    example: 50,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  maxDistance?: number;

  @ApiPropertyOptional({
    description: 'Distance unit',
    enum: DistanceUnit,
    example: DistanceUnit.KILOMETERS,
  })
  @IsOptional()
  @IsEnum(DistanceUnit)
  distanceUnit?: DistanceUnit;

  @ApiPropertyOptional({
    description: 'Preferred interests',
    example: ['hiking', 'reading', 'cooking'],
  })
  @IsOptional()
  @IsArray()
  preferredInterests?: string[];

  @ApiPropertyOptional({
    description: 'Deal breakers',
    example: ['smoking', 'drinking'],
  })
  @IsOptional()
  @IsArray()
  dealBreakers?: string[];

  @ApiPropertyOptional({
    description: 'Show only verified profiles',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  showOnlyVerifiedProfiles?: boolean;

  @ApiPropertyOptional({
    description: 'Show only profiles with photos',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  showOnlyWithPhotos?: boolean;

  @ApiPropertyOptional({
    description: 'Allow messages from matches',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  allowMessagesFromMatches?: boolean;

  @ApiPropertyOptional({
    description: 'Allow messages from everyone',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  allowMessagesFromEveryone?: boolean;

  @ApiPropertyOptional({
    description: 'Show online status',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  showOnlineStatus?: boolean;

  @ApiPropertyOptional({
    description: 'Show last seen',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  showLastSeen?: boolean;

  @ApiPropertyOptional({
    description: 'Push notifications enabled',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Email notifications enabled',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Match notifications enabled',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  matchNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Message notifications enabled',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  messageNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Like notifications enabled',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  likeNotifications?: boolean;
}
