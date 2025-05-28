import { Injectable } from '@nestjs/common';
import { Preferences, DistanceUnit } from '@core/entities/preferences.entity';
import { Gender } from '@core/entities/profile.entity';
import { IPreferencesRepository } from '@core/repositories/preferences.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { BaseRepository } from './base.repository';

@Injectable()
export class PreferencesRepository
  extends BaseRepository<Preferences>
  implements IPreferencesRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(preferences: Preferences): Promise<Preferences> {
    const data = await this.prisma.preferences.create({
      data: {
        id: preferences.id,
        userId: preferences.userId,
        preferredGenders: preferences.preferredGenders,
        minAge: preferences.minAge,
        maxAge: preferences.maxAge,
        maxDistance: preferences.maxDistance,
        distanceUnit: preferences.distanceUnit,
        preferredInterests: preferences.preferredInterests,
        dealBreakers: preferences.dealBreakers,
        showOnlyVerifiedProfiles: preferences.showOnlyVerifiedProfiles,
        showOnlyWithPhotos: preferences.showOnlyWithPhotos,
        allowMessagesFromMatches: preferences.allowMessagesFromMatches,
        allowMessagesFromEveryone: preferences.allowMessagesFromEveryone,
        showOnlineStatus: preferences.showOnlineStatus,
        showLastSeen: preferences.showLastSeen,
        pushNotifications: preferences.pushNotifications,
        emailNotifications: preferences.emailNotifications,
        matchNotifications: preferences.matchNotifications,
        messageNotifications: preferences.messageNotifications,
        likeNotifications: preferences.likeNotifications,
        createdAt: preferences.createdAt,
        updatedAt: preferences.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<Preferences | null> {
    const data = await this.prisma.preferences.findUnique({
      where: { id },
    });

    return data ? this.toDomain(data) : null;
  }

  async findByUserId(userId: string): Promise<Preferences | null> {
    const data = await this.prisma.preferences.findUnique({
      where: { userId },
    });

    return data ? this.toDomain(data) : null;
  }

  async update(preferences: Preferences): Promise<Preferences> {
    const data = await this.prisma.preferences.update({
      where: { id: preferences.id },
      data: {
        preferredGenders: preferences.preferredGenders,
        minAge: preferences.minAge,
        maxAge: preferences.maxAge,
        maxDistance: preferences.maxDistance,
        distanceUnit: preferences.distanceUnit,
        preferredInterests: preferences.preferredInterests,
        dealBreakers: preferences.dealBreakers,
        showOnlyVerifiedProfiles: preferences.showOnlyVerifiedProfiles,
        showOnlyWithPhotos: preferences.showOnlyWithPhotos,
        allowMessagesFromMatches: preferences.allowMessagesFromMatches,
        allowMessagesFromEveryone: preferences.allowMessagesFromEveryone,
        showOnlineStatus: preferences.showOnlineStatus,
        showLastSeen: preferences.showLastSeen,
        pushNotifications: preferences.pushNotifications,
        emailNotifications: preferences.emailNotifications,
        matchNotifications: preferences.matchNotifications,
        messageNotifications: preferences.messageNotifications,
        likeNotifications: preferences.likeNotifications,
        updatedAt: preferences.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.preferences.delete({
      where: { id },
    });
  }

  async findUsersWithNotificationsEnabled(notificationType: string): Promise<string[]> {
    // Map notificationType to the corresponding field in the preferences table
    const validTypes = [
      'pushNotifications',
      'emailNotifications',
      'matchNotifications',
      'messageNotifications',
      'likeNotifications',
    ];

    if (!validTypes.includes(notificationType)) {
      throw new Error(`Invalid notification type: ${notificationType}`);
    }

    const users = await this.prisma.preferences.findMany({
      where: {
        [notificationType]: true,
      },
      select: {
        userId: true,
      },
    });

    return users.map((u) => u.userId);
  }

  private toDomain(data: any): Preferences {
    const preferences = new Preferences(data.userId, data.id);
    preferences.preferredGenders =
      data.preferredGenders.map((gender: string) => gender as Gender) || [];
    preferences.minAge = data.minAge;
    preferences.maxAge = data.maxAge;
    preferences.maxDistance = data.maxDistance;
    preferences.distanceUnit = data.distanceUnit as DistanceUnit;
    preferences.preferredInterests = data.preferredInterests || [];
    preferences.dealBreakers = data.dealBreakers || [];
    preferences.showOnlyVerifiedProfiles = data.showOnlyVerifiedProfiles;
    preferences.showOnlyWithPhotos = data.showOnlyWithPhotos;
    preferences.allowMessagesFromMatches = data.allowMessagesFromMatches;
    preferences.allowMessagesFromEveryone = data.allowMessagesFromEveryone;
    preferences.showOnlineStatus = data.showOnlineStatus;
    preferences.showLastSeen = data.showLastSeen;
    preferences.pushNotifications = data.pushNotifications;
    preferences.emailNotifications = data.emailNotifications;
    preferences.matchNotifications = data.matchNotifications;
    preferences.messageNotifications = data.messageNotifications;
    preferences.likeNotifications = data.likeNotifications;
    preferences.createdAt = data.createdAt;
    preferences.updatedAt = data.updatedAt;

    return preferences;
  }
}
