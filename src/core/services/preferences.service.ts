import { Injectable, Inject } from '@nestjs/common';
import { Preferences, DistanceUnit } from '@core/entities/preferences.entity';
import { Gender } from '@core/entities/profile.entity';
import { IPreferencesRepository } from '@core/repositories/preferences.repository.interface';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  InvalidInputException,
} from '@core/exceptions/domain-exceptions';

@Injectable()
export class PreferencesService {
  constructor(
    @Inject('IPreferencesRepository')
    private readonly preferencesRepository: IPreferencesRepository,
  ) {}

  async createPreferences(userId: string): Promise<Preferences> {
    const existingPreferences = await this.preferencesRepository.findByUserId(userId);
    if (existingPreferences) {
      throw new EntityAlreadyExistsException('Preferences', 'user');
    }

    const preferences = new Preferences(userId);

    return await this.preferencesRepository.create(preferences);
  }

  async getPreferencesById(id: string): Promise<Preferences> {
    const preferences = await this.preferencesRepository.findById(id);
    if (!preferences) {
      throw new EntityNotFoundException('Preferences', id);
    }

    return preferences;
  }

  async getPreferencesByUserId(userId: string): Promise<Preferences> {
    const preferences = await this.preferencesRepository.findByUserId(userId);
    if (!preferences) {
      throw new EntityNotFoundException('Preferences');
    }

    return preferences;
  }

  async updateGenderPreferences(userId: string, genders: Gender[]): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.updateGenderPreferences(genders);

    return await this.preferencesRepository.update(preferences);
  }

  async updateAgeRange(userId: string, minAge: number, maxAge: number): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);

    try {
      preferences.updateAgeRange(minAge, maxAge);
    } catch (error) {
      throw new InvalidInputException(error.message);
    }

    return await this.preferencesRepository.update(preferences);
  }

  async updateDistancePreference(
    userId: string,
    maxDistance: number,
    unit: DistanceUnit,
  ): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);

    try {
      preferences.updateDistancePreference(maxDistance, unit);
    } catch (error) {
      throw new InvalidInputException(error.message);
    }

    return await this.preferencesRepository.update(preferences);
  }

  async updateInterestPreferences(userId: string, interests: string[]): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.updateInterestPreferences(interests);

    return await this.preferencesRepository.update(preferences);
  }

  async addPreferredInterest(userId: string, interest: string): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.addPreferredInterest(interest);

    return await this.preferencesRepository.update(preferences);
  }

  async removePreferredInterest(userId: string, interest: string): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.removePreferredInterest(interest);

    return await this.preferencesRepository.update(preferences);
  }

  async updateDealBreakers(userId: string, dealBreakers: string[]): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.updateDealBreakers(dealBreakers);

    return await this.preferencesRepository.update(preferences);
  }

  async addDealBreaker(userId: string, dealBreaker: string): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.addDealBreaker(dealBreaker);

    return await this.preferencesRepository.update(preferences);
  }

  async removeDealBreaker(userId: string, dealBreaker: string): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.removeDealBreaker(dealBreaker);

    return await this.preferencesRepository.update(preferences);
  }

  async updateFilterPreferences(
    userId: string,
    showOnlyVerifiedProfiles?: boolean,
    showOnlyWithPhotos?: boolean,
  ): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.updateFilterPreferences(showOnlyVerifiedProfiles, showOnlyWithPhotos);

    return await this.preferencesRepository.update(preferences);
  }

  async updateMessagingPreferences(
    userId: string,
    allowMessagesFromMatches?: boolean,
    allowMessagesFromEveryone?: boolean,
  ): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.updateMessagingPreferences(allowMessagesFromMatches, allowMessagesFromEveryone);

    return await this.preferencesRepository.update(preferences);
  }

  async updatePrivacyPreferences(
    userId: string,
    showOnlineStatus?: boolean,
    showLastSeen?: boolean,
  ): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.updatePrivacyPreferences(showOnlineStatus, showLastSeen);

    return await this.preferencesRepository.update(preferences);
  }

  async updateNotificationPreferences(
    userId: string,
    pushNotifications?: boolean,
    emailNotifications?: boolean,
    matchNotifications?: boolean,
    messageNotifications?: boolean,
    likeNotifications?: boolean,
  ): Promise<Preferences> {
    const preferences = await this.getPreferencesByUserId(userId);
    preferences.updateNotificationPreferences(
      pushNotifications,
      emailNotifications,
      matchNotifications,
      messageNotifications,
      likeNotifications,
    );

    return await this.preferencesRepository.update(preferences);
  }

  async deletePreferences(userId: string): Promise<void> {
    const preferences = await this.getPreferencesByUserId(userId);
    await this.preferencesRepository.delete(preferences.id);
  }

  async getUsersWithNotificationsEnabled(notificationType: string): Promise<string[]> {
    return await this.preferencesRepository.findUsersWithNotificationsEnabled(notificationType);
  }
}
