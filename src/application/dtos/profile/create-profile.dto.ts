import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, RelationshipStatus } from '@core/entities/profile.entity';

export class CreateProfileDto {
  @ApiPropertyOptional({ description: 'Profile bio', example: 'I love hiking and reading books' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Gender', enum: Gender, example: Gender.MALE })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Height in centimeters',
    example: 175,
    minimum: 100,
    maximum: 250,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  height?: number;

  @ApiPropertyOptional({
    description: 'Weight in kilograms',
    example: 70,
    minimum: 30,
    maximum: 300,
  })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  weight?: number;

  @ApiPropertyOptional({ description: 'Location', example: 'Paris, France' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Occupation', example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ description: 'Education', example: 'Master in Computer Science' })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({
    description: 'Relationship status',
    enum: RelationshipStatus,
    example: RelationshipStatus.SINGLE,
  })
  @IsOptional()
  @IsEnum(RelationshipStatus)
  relationshipStatus?: RelationshipStatus;

  @ApiPropertyOptional({
    description: 'List of interests',
    example: ['hiking', 'reading', 'cooking'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({ description: 'List of photo URLs', example: ['photo1.jpg', 'photo2.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];

  @ApiPropertyOptional({ description: 'Profile visibility', example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
