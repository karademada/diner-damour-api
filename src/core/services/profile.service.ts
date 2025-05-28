import { Injectable, Inject } from '@nestjs/common';
import { Profile, Gender, RelationshipStatus } from '@core/entities/profile.entity';
import { IProfileRepository } from '@core/repositories/profile.repository.interface';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  InvalidInputException,
} from '@core/exceptions/domain-exceptions';

@Injectable()
export class ProfileService {
  constructor(@Inject('IProfileRepository') private readonly profileRepository: IProfileRepository) {}

  async createProfile(userId: string): Promise<Profile> {
    const existingProfile = await this.profileRepository.findByUserId(userId);
    if (existingProfile) {
      throw new EntityAlreadyExistsException('Profile', 'user');
    }

    const profile = new Profile(userId);

    return await this.profileRepository.create(profile);
  }

  async getProfileById(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findById(id);
    if (!profile) {
      throw new EntityNotFoundException('Profile', id);
    }

    return profile;
  }

  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new EntityNotFoundException('Profile');
    }

    return profile;
  }

  async updateBio(userId: string, bio: string): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    profile.updateBio(bio);

    return await this.profileRepository.update(profile);
  }

  async updateBasicInfo(
    userId: string,
    dateOfBirth?: Date,
    gender?: Gender,
    height?: number,
    weight?: number,
    location?: string,
  ): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);

    if (dateOfBirth) {
      const age = this.calculateAge(dateOfBirth);
      if (age < 18) {
        throw new InvalidInputException('User must be at least 18 years old');
      }
    }

    profile.updateBasicInfo(dateOfBirth, gender, height, weight, location);

    return await this.profileRepository.update(profile);
  }

  async updateProfessionalInfo(
    userId: string,
    occupation?: string,
    education?: string,
  ): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    profile.updateProfessionalInfo(occupation, education);

    return await this.profileRepository.update(profile);
  }

  async updateRelationshipStatus(userId: string, status: RelationshipStatus): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    profile.updateRelationshipStatus(status);

    return await this.profileRepository.update(profile);
  }

  async addInterest(userId: string, interest: string): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    profile.addInterest(interest);

    return await this.profileRepository.update(profile);
  }

  async removeInterest(userId: string, interest: string): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    profile.removeInterest(interest);

    return await this.profileRepository.update(profile);
  }

  async updateInterests(userId: string, interests: string[]): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    profile.updateInterests(interests);

    return await this.profileRepository.update(profile);
  }

  async addPhoto(userId: string, photoUrl: string): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);

    if (profile.photos.length >= 6) {
      throw new InvalidInputException('Maximum of 6 photos allowed');
    }

    profile.addPhoto(photoUrl);

    return await this.profileRepository.update(profile);
  }

  async removePhoto(userId: string, photoUrl: string): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    profile.removePhoto(photoUrl);

    return await this.profileRepository.update(profile);
  }

  async reorderPhotos(userId: string, photoUrls: string[]): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    profile.reorderPhotos(photoUrls);

    return await this.profileRepository.update(profile);
  }

  async setVisibility(userId: string, isVisible: boolean): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    profile.setVisibility(isVisible);

    return await this.profileRepository.update(profile);
  }

  async deleteProfile(userId: string): Promise<void> {
    const profile = await this.getProfileByUserId(userId);
    await this.profileRepository.delete(profile.id);
  }

  async getVisibleProfiles(excludeUserId?: string): Promise<Profile[]> {
    return await this.profileRepository.findVisibleProfiles(excludeUserId);
  }

  async getProfilesByLocation(location: string, excludeUserId?: string): Promise<Profile[]> {
    return await this.profileRepository.findProfilesByLocation(location, excludeUserId);
  }

  async getProfilesByInterests(interests: string[], excludeUserId?: string): Promise<Profile[]> {
    return await this.profileRepository.findProfilesByInterests(interests, excludeUserId);
  }

  async getCompleteProfiles(excludeUserId?: string): Promise<Profile[]> {
    return await this.profileRepository.findCompleteProfiles(excludeUserId);
  }

  async searchProfiles(criteria: {
    minAge?: number;
    maxAge?: number;
    location?: string;
    interests?: string[];
    gender?: string;
    excludeUserId?: string;
  }): Promise<Profile[]> {
    return await this.profileRepository.searchProfiles(criteria);
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
