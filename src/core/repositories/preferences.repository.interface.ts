import { Preferences } from '@core/entities/preferences.entity';

export interface IPreferencesRepository {
  create(preferences: Preferences): Promise<Preferences>;
  findById(id: string): Promise<Preferences | null>;
  findByUserId(userId: string): Promise<Preferences | null>;
  update(preferences: Preferences): Promise<Preferences>;
  delete(id: string): Promise<void>;
  findUsersWithNotificationsEnabled(notificationType: string): Promise<string[]>;
}
