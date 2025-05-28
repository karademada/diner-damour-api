import { Profile } from '@core/entities/profile.entity';

export interface IProfileRepository {
  create(profile: Profile): Promise<Profile>;
  findById(id: string): Promise<Profile | null>;
  findByUserId(userId: string): Promise<Profile | null>;
  update(profile: Profile): Promise<Profile>;
  delete(id: string): Promise<void>;
  findVisibleProfiles(excludeUserId?: string): Promise<Profile[]>;
  findProfilesByLocation(location: string, excludeUserId?: string): Promise<Profile[]>;
  findProfilesByInterests(interests: string[], excludeUserId?: string): Promise<Profile[]>;
  findCompleteProfiles(excludeUserId?: string): Promise<Profile[]>;
  searchProfiles(criteria: {
    minAge?: number;
    maxAge?: number;
    location?: string;
    interests?: string[];
    gender?: string;
    excludeUserId?: string;
  }): Promise<Profile[]>;
}
