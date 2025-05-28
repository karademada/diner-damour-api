import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

// Guards & Decorators
import { RolesGuard } from '@presentation/guards/roles.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

// DTOs
import { CreateProfileDto } from '@application/dtos/profile/create-profile.dto';
import { UpdateProfileDto } from '@application/dtos/profile/update-profile.dto';

// Services
import { ProfileService } from '@core/services/profile.service';

// Types
import { IJwtPayload } from '@application/dtos/responses/user.response';

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user profile' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Profile created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Profile already exists' })
  async createProfile(
    @CurrentUser() user: IJwtPayload,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    // Create the profile first
    const profile = await this.profileService.createProfile(user.sub);

    // Then update it with the provided data
    if (createProfileDto.bio) {
      await this.profileService.updateBio(user.sub, createProfileDto.bio);
    }

    if (
      createProfileDto.dateOfBirth ||
      createProfileDto.gender ||
      createProfileDto.height ||
      createProfileDto.weight ||
      createProfileDto.location
    ) {
      await this.profileService.updateBasicInfo(
        user.sub,
        createProfileDto.dateOfBirth ? new Date(createProfileDto.dateOfBirth) : undefined,
        createProfileDto.gender,
        createProfileDto.height,
        createProfileDto.weight,
        createProfileDto.location,
      );
    }

    if (createProfileDto.occupation || createProfileDto.education) {
      await this.profileService.updateProfessionalInfo(
        user.sub,
        createProfileDto.occupation,
        createProfileDto.education,
      );
    }

    if (createProfileDto.relationshipStatus) {
      await this.profileService.updateRelationshipStatus(
        user.sub,
        createProfileDto.relationshipStatus,
      );
    }

    if (createProfileDto.interests && createProfileDto.interests.length > 0) {
      await this.profileService.updateInterests(user.sub, createProfileDto.interests);
    }

    if (createProfileDto.isVisible !== undefined) {
      await this.profileService.setVisibility(user.sub, createProfileDto.isVisible);
    }

    return this.profileService.getProfileByUserId(user.sub);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns current user profile' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Profile not found' })
  async getCurrentUserProfile(@CurrentUser() user: IJwtPayload) {
    return this.profileService.getProfileByUserId(user.sub);
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Profile not found' })
  async updateCurrentUserProfile(
    @CurrentUser() user: IJwtPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    // Update different parts of the profile based on what's provided
    if (updateProfileDto.bio) {
      await this.profileService.updateBio(user.sub, updateProfileDto.bio);
    }

    if (
      updateProfileDto.dateOfBirth ||
      updateProfileDto.gender ||
      updateProfileDto.height ||
      updateProfileDto.weight ||
      updateProfileDto.location
    ) {
      await this.profileService.updateBasicInfo(
        user.sub,
        updateProfileDto.dateOfBirth ? new Date(updateProfileDto.dateOfBirth) : undefined,
        updateProfileDto.gender,
        updateProfileDto.height,
        updateProfileDto.weight,
        updateProfileDto.location,
      );
    }

    if (updateProfileDto.occupation || updateProfileDto.education) {
      await this.profileService.updateProfessionalInfo(
        user.sub,
        updateProfileDto.occupation,
        updateProfileDto.education,
      );
    }

    if (updateProfileDto.relationshipStatus) {
      await this.profileService.updateRelationshipStatus(
        user.sub,
        updateProfileDto.relationshipStatus,
      );
    }

    if (updateProfileDto.interests && updateProfileDto.interests.length > 0) {
      await this.profileService.updateInterests(user.sub, updateProfileDto.interests);
    }

    if (updateProfileDto.isVisible !== undefined) {
      await this.profileService.setVisibility(user.sub, updateProfileDto.isVisible);
    }

    return this.profileService.getProfileByUserId(user.sub);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Profile not found' })
  async deleteCurrentUserProfile(@CurrentUser() user: IJwtPayload) {
    await this.profileService.deleteProfile(user.sub);

    return { message: 'Profile deleted successfully' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get profile by ID' })
  @ApiParam({
    name: 'id',
    description: 'Profile ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns profile information' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Profile not found' })
  async getProfileById(@Param('id') id: string) {
    return this.profileService.getProfileById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get visible profiles' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns list of visible profiles' })
  async getVisibleProfiles(@CurrentUser() user: IJwtPayload) {
    return this.profileService.getVisibleProfiles(user.sub);
  }

  @Post('me/interests')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add interest to current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Interest added successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Profile not found' })
  async addInterest(@CurrentUser() user: IJwtPayload, @Body('interest') interest: string) {
    return this.profileService.addInterest(user.sub, interest);
  }

  @Delete('me/interests/:interest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove interest from current user profile' })
  @ApiParam({ name: 'interest', description: 'Interest to remove', example: 'hiking' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Interest removed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Profile not found' })
  async removeInterest(@CurrentUser() user: IJwtPayload, @Param('interest') interest: string) {
    return this.profileService.removeInterest(user.sub, interest);
  }

  @Post('me/photos')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add photo to current user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo added successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Profile not found' })
  async addPhoto(@CurrentUser() user: IJwtPayload, @Body('photoUrl') photoUrl: string) {
    return this.profileService.addPhoto(user.sub, photoUrl);
  }

  @Delete('me/photos/:photoUrl')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove photo from current user profile' })
  @ApiParam({ name: 'photoUrl', description: 'Photo URL to remove' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo removed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Profile not found' })
  async removePhoto(@CurrentUser() user: IJwtPayload, @Param('photoUrl') photoUrl: string) {
    return this.profileService.removePhoto(user.sub, decodeURIComponent(photoUrl));
  }

  @Put('me/visibility')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update profile visibility' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Visibility updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Profile not found' })
  async updateVisibility(@CurrentUser() user: IJwtPayload, @Body('isVisible') isVisible: boolean) {
    return this.profileService.setVisibility(user.sub, isVisible);
  }
}
