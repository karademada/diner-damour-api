import { Injectable } from '@nestjs/common';
import { Profile, Gender } from '@core/entities/profile.entity';
import { IProfileRepository } from '@core/repositories/profile.repository.interface';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { BaseRepository } from './base.repository';

@Injectable()
export class ProfileRepository extends BaseRepository<Profile> implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(profile: Profile): Promise<Profile> {
    const data = await this.prisma.profile.create({
      data: {
        id: profile.id,
        userId: profile.userId,
        bio: profile.bio,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        location: profile.location,
        occupation: profile.occupation,
        education: profile.education,
        relationshipStatus: profile.relationshipStatus,
        interests: profile.interests,
        photos: profile.photos,
        isVisible: profile.isVisible,
        isComplete: profile.isComplete,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<Profile | null> {
    const data = await this.prisma.profile.findUnique({
      where: { id },
    });

    return data ? this.toDomain(data) : null;
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const data = await this.prisma.profile.findUnique({
      where: { userId },
    });

    return data ? this.toDomain(data) : null;
  }

  async update(profile: Profile): Promise<Profile> {
    const data = await this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        bio: profile.bio,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        location: profile.location,
        occupation: profile.occupation,
        education: profile.education,
        relationshipStatus: profile.relationshipStatus,
        interests: profile.interests,
        photos: profile.photos,
        isVisible: profile.isVisible,
        isComplete: profile.isComplete,
        updatedAt: profile.updatedAt,
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.profile.delete({
      where: { id },
    });
  }

  async findVisibleProfiles(excludeUserId?: string): Promise<Profile[]> {
    const data = await this.prisma.profile.findMany({
      where: {
        isVisible: true,
        ...(excludeUserId && { userId: { not: excludeUserId } }),
      },
      orderBy: { updatedAt: 'desc' },
    });

    return data.map(item => this.toDomain(item));
  }

  async findProfilesByLocation(location: string, excludeUserId?: string): Promise<Profile[]> {
    const data = await this.prisma.profile.findMany({
      where: {
        location: { contains: location, mode: 'insensitive' },
        isVisible: true,
        ...(excludeUserId && { userId: { not: excludeUserId } }),
      },
      orderBy: { updatedAt: 'desc' },
    });

    return data.map(item => this.toDomain(item));
  }

  async findProfilesByInterests(interests: string[], excludeUserId?: string): Promise<Profile[]> {
    const data = await this.prisma.profile.findMany({
      where: {
        interests: { hasSome: interests },
        isVisible: true,
        ...(excludeUserId && { userId: { not: excludeUserId } }),
      },
      orderBy: { updatedAt: 'desc' },
    });

    return data.map(item => this.toDomain(item));
  }

  async findCompleteProfiles(excludeUserId?: string): Promise<Profile[]> {
    const data = await this.prisma.profile.findMany({
      where: {
        isComplete: true,
        isVisible: true,
        ...(excludeUserId && { userId: { not: excludeUserId } }),
      },
      orderBy: { updatedAt: 'desc' },
    });

    return data.map(item => this.toDomain(item));
  }

  async searchProfiles(criteria: {
    minAge?: number;
    maxAge?: number;
    location?: string;
    interests?: string[];
    gender?: string;
    excludeUserId?: string;
  }): Promise<Profile[]> {
    const where: any = {
      isVisible: true,
      ...(criteria.excludeUserId && { userId: { not: criteria.excludeUserId } }),
    };

    if (criteria.minAge || criteria.maxAge) {
      const now = new Date();
      if (criteria.maxAge) {
        const minBirthDate = new Date(
          now.getFullYear() - criteria.maxAge - 1,
          now.getMonth(),
          now.getDate(),
        );
        where.dateOfBirth = { ...where.dateOfBirth, gte: minBirthDate };
      }
      if (criteria.minAge) {
        const maxBirthDate = new Date(
          now.getFullYear() - criteria.minAge,
          now.getMonth(),
          now.getDate(),
        );
        where.dateOfBirth = { ...where.dateOfBirth, lte: maxBirthDate };
      }
    }

    if (criteria.location) {
      where.location = { contains: criteria.location, mode: 'insensitive' };
    }

    if (criteria.interests && criteria.interests.length > 0) {
      where.interests = { hasSome: criteria.interests };
    }

    if (criteria.gender) {
      where.gender = criteria.gender;
    }

    const data = await this.prisma.profile.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return data.map(item => this.toDomain(item));
  }

  private toDomain(data: any): Profile {
    const profile = new Profile(data.userId, data.id);
    profile.bio = data.bio;
    profile.dateOfBirth = data.dateOfBirth;
    profile.gender = data.gender as Gender;
    profile.height = data.height;
    profile.weight = data.weight;
    profile.location = data.location;
    profile.occupation = data.occupation;
    profile.education = data.education;
    profile.relationshipStatus = data.relationshipStatus;
    profile.interests = data.interests || [];
    profile.photos = data.photos || [];
    profile.isVisible = data.isVisible;
    profile.isComplete = data.isComplete;
    profile.createdAt = data.createdAt;
    profile.updatedAt = data.updatedAt;

    return profile;
  }
}
