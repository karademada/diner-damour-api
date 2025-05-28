import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

// Guards & Decorators
import { RolesGuard } from '@presentation/guards/roles.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';

// DTOs
import { CreatePreferencesDto } from '@application/dtos/preferences/create-preferences.dto';
import { UpdatePreferencesDto } from '@application/dtos/preferences/update-preferences.dto';

// Services
import { PreferencesService } from '@core/services/preferences.service';

// Types
import { IJwtPayload } from '@application/dtos/responses/user.response';
import { Gender } from '@core/entities/profile.entity';
import { DistanceUnit } from '@core/entities/preferences.entity';

@ApiTags('preferences')
@Controller('preferences')
@UseGuards(RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user preferences' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Preferences created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Preferences already exist' })
  async createPreferences(
    @CurrentUser() user: IJwtPayload,
    @Body() createPreferencesDto: CreatePreferencesDto,
  ) {
    // Create the preferences first
    const preferences = await this.preferencesService.createPreferences(user.sub);

    // Then update them with the provided data
    if (createPreferencesDto.preferredGenders && createPreferencesDto.preferredGenders.length > 0) {
      await this.preferencesService.updateGenderPreferences(
        user.sub,
        createPreferencesDto.preferredGenders,
      );
    }

    if (createPreferencesDto.minAge !== undefined || createPreferencesDto.maxAge !== undefined) {
      await this.preferencesService.updateAgeRange(
        user.sub,
        createPreferencesDto.minAge ?? 18,
        createPreferencesDto.maxAge ?? 99,
      );
    }

    if (
      createPreferencesDto.maxDistance !== undefined ||
      createPreferencesDto.distanceUnit !== undefined
    ) {
      await this.preferencesService.updateDistancePreference(
        user.sub,
        createPreferencesDto.maxDistance ?? 50,
        createPreferencesDto.distanceUnit ?? DistanceUnit.KILOMETERS,
      );
    }

    if (
      createPreferencesDto.preferredInterests &&
      createPreferencesDto.preferredInterests.length > 0
    ) {
      await this.preferencesService.updateInterestPreferences(
        user.sub,
        createPreferencesDto.preferredInterests,
      );
    }

    if (createPreferencesDto.dealBreakers && createPreferencesDto.dealBreakers.length > 0) {
      await this.preferencesService.updateDealBreakers(user.sub, createPreferencesDto.dealBreakers);
    }

    if (
      createPreferencesDto.showOnlyVerifiedProfiles !== undefined ||
      createPreferencesDto.showOnlyWithPhotos !== undefined
    ) {
      await this.preferencesService.updateFilterPreferences(
        user.sub,
        createPreferencesDto.showOnlyVerifiedProfiles,
        createPreferencesDto.showOnlyWithPhotos,
      );
    }

    if (
      createPreferencesDto.allowMessagesFromMatches !== undefined ||
      createPreferencesDto.allowMessagesFromEveryone !== undefined
    ) {
      await this.preferencesService.updateMessagingPreferences(
        user.sub,
        createPreferencesDto.allowMessagesFromMatches,
        createPreferencesDto.allowMessagesFromEveryone,
      );
    }

    if (
      createPreferencesDto.showOnlineStatus !== undefined ||
      createPreferencesDto.showLastSeen !== undefined
    ) {
      await this.preferencesService.updatePrivacyPreferences(
        user.sub,
        createPreferencesDto.showOnlineStatus,
        createPreferencesDto.showLastSeen,
      );
    }

    if (
      createPreferencesDto.pushNotifications !== undefined ||
      createPreferencesDto.emailNotifications !== undefined ||
      createPreferencesDto.matchNotifications !== undefined ||
      createPreferencesDto.messageNotifications !== undefined ||
      createPreferencesDto.likeNotifications !== undefined
    ) {
      await this.preferencesService.updateNotificationPreferences(
        user.sub,
        createPreferencesDto.pushNotifications,
        createPreferencesDto.emailNotifications,
        createPreferencesDto.matchNotifications,
        createPreferencesDto.messageNotifications,
        createPreferencesDto.likeNotifications,
      );
    }

    return this.preferencesService.getPreferencesByUserId(user.sub);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user preferences' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns current user preferences' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Preferences not found' })
  async getCurrentUserPreferences(@CurrentUser() user: IJwtPayload) {
    return this.preferencesService.getPreferencesByUserId(user.sub);
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user preferences' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Preferences updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Preferences not found' })
  async updateCurrentUserPreferences(
    @CurrentUser() user: IJwtPayload,
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ) {
    // Update different parts of the preferences based on what's provided
    if (updatePreferencesDto.preferredGenders && updatePreferencesDto.preferredGenders.length > 0) {
      await this.preferencesService.updateGenderPreferences(
        user.sub,
        updatePreferencesDto.preferredGenders,
      );
    }

    if (updatePreferencesDto.minAge !== undefined || updatePreferencesDto.maxAge !== undefined) {
      const current = await this.preferencesService.getPreferencesByUserId(user.sub);
      await this.preferencesService.updateAgeRange(
        user.sub,
        updatePreferencesDto.minAge ?? current.minAge,
        updatePreferencesDto.maxAge ?? current.maxAge,
      );
    }

    if (
      updatePreferencesDto.maxDistance !== undefined ||
      updatePreferencesDto.distanceUnit !== undefined
    ) {
      const current = await this.preferencesService.getPreferencesByUserId(user.sub);
      await this.preferencesService.updateDistancePreference(
        user.sub,
        updatePreferencesDto.maxDistance ?? current.maxDistance,
        updatePreferencesDto.distanceUnit ?? current.distanceUnit,
      );
    }

    if (updatePreferencesDto.preferredInterests !== undefined) {
      await this.preferencesService.updateInterestPreferences(
        user.sub,
        updatePreferencesDto.preferredInterests,
      );
    }

    if (updatePreferencesDto.dealBreakers !== undefined) {
      await this.preferencesService.updateDealBreakers(user.sub, updatePreferencesDto.dealBreakers);
    }

    if (
      updatePreferencesDto.showOnlyVerifiedProfiles !== undefined ||
      updatePreferencesDto.showOnlyWithPhotos !== undefined
    ) {
      await this.preferencesService.updateFilterPreferences(
        user.sub,
        updatePreferencesDto.showOnlyVerifiedProfiles,
        updatePreferencesDto.showOnlyWithPhotos,
      );
    }

    if (
      updatePreferencesDto.allowMessagesFromMatches !== undefined ||
      updatePreferencesDto.allowMessagesFromEveryone !== undefined
    ) {
      await this.preferencesService.updateMessagingPreferences(
        user.sub,
        updatePreferencesDto.allowMessagesFromMatches,
        updatePreferencesDto.allowMessagesFromEveryone,
      );
    }

    if (
      updatePreferencesDto.showOnlineStatus !== undefined ||
      updatePreferencesDto.showLastSeen !== undefined
    ) {
      await this.preferencesService.updatePrivacyPreferences(
        user.sub,
        updatePreferencesDto.showOnlineStatus,
        updatePreferencesDto.showLastSeen,
      );
    }

    if (
      updatePreferencesDto.pushNotifications !== undefined ||
      updatePreferencesDto.emailNotifications !== undefined ||
      updatePreferencesDto.matchNotifications !== undefined ||
      updatePreferencesDto.messageNotifications !== undefined ||
      updatePreferencesDto.likeNotifications !== undefined
    ) {
      await this.preferencesService.updateNotificationPreferences(
        user.sub,
        updatePreferencesDto.pushNotifications,
        updatePreferencesDto.emailNotifications,
        updatePreferencesDto.matchNotifications,
        updatePreferencesDto.messageNotifications,
        updatePreferencesDto.likeNotifications,
      );
    }

    return this.preferencesService.getPreferencesByUserId(user.sub);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete current user preferences' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Preferences deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Preferences not found' })
  async deleteCurrentUserPreferences(@CurrentUser() user: IJwtPayload) {
    await this.preferencesService.deletePreferences(user.sub);

    return { message: 'Preferences deleted successfully' };
  }

  @Put('me/gender-preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update gender preferences' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Gender preferences updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Preferences not found' })
  async updateGenderPreferences(
    @CurrentUser() user: IJwtPayload,
    @Body('genders') genders: string[],
  ) {
    return this.preferencesService.updateGenderPreferences(user.sub, genders as Gender[]);
  }

  @Put('me/age-range')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update age range preferences' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Age range updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Preferences not found' })
  async updateAgeRange(
    @CurrentUser() user: IJwtPayload,
    @Body() body: { minAge: number; maxAge: number },
  ) {
    return this.preferencesService.updateAgeRange(user.sub, body.minAge, body.maxAge);
  }

  @Put('me/distance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update distance preferences' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Distance preferences updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Preferences not found' })
  async updateDistancePreference(
    @CurrentUser() user: IJwtPayload,
    @Body() body: { maxDistance: number; unit: string },
  ) {
    return this.preferencesService.updateDistancePreference(
      user.sub,
      body.maxDistance,
      body.unit as DistanceUnit,
    );
  }

  @Put('me/notifications')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification preferences updated successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Preferences not found' })
  async updateNotificationPreferences(
    @CurrentUser() user: IJwtPayload,
    @Body()
    body: {
      pushNotifications?: boolean;
      emailNotifications?: boolean;
      matchNotifications?: boolean;
      messageNotifications?: boolean;
      likeNotifications?: boolean;
    },
  ) {
    return this.preferencesService.updateNotificationPreferences(
      user.sub,
      body.pushNotifications,
      body.emailNotifications,
      body.matchNotifications,
      body.messageNotifications,
      body.likeNotifications,
    );
  }

  @Put('me/privacy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update privacy preferences' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Privacy preferences updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Preferences not found' })
  async updatePrivacyPreferences(
    @CurrentUser() user: IJwtPayload,
    @Body() body: { showOnlineStatus?: boolean; showLastSeen?: boolean },
  ) {
    return this.preferencesService.updatePrivacyPreferences(
      user.sub,
      body.showOnlineStatus,
      body.showLastSeen,
    );
  }
}
