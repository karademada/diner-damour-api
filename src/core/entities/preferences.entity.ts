import { v4 as uuidv4 } from 'uuid';
import { Gender } from './profile.entity';

export enum DistanceUnit {
  KILOMETERS = 'KILOMETERS',
  MILES = 'MILES',
}

export enum AgeRange {
  EIGHTEEN_TO_TWENTY_FIVE = '18-25',
  TWENTY_SIX_TO_THIRTY = '26-30',
  THIRTY_ONE_TO_THIRTY_FIVE = '31-35',
  THIRTY_SIX_TO_FORTY = '36-40',
  FORTY_ONE_TO_FORTY_FIVE = '41-45',
  FORTY_SIX_TO_FIFTY = '46-50',
  FIFTY_PLUS = '50+',
}

export class Preferences {
  id: string;
  userId: string;
  preferredGenders: Gender[];
  minAge: number;
  maxAge: number;
  maxDistance: number;
  distanceUnit: DistanceUnit;
  preferredInterests: string[];
  dealBreakers: string[];
  showOnlyVerifiedProfiles: boolean;
  showOnlyWithPhotos: boolean;
  allowMessagesFromMatches: boolean;
  allowMessagesFromEveryone: boolean;
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  matchNotifications: boolean;
  messageNotifications: boolean;
  likeNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(userId: string, id?: string) {
    this.id = id || uuidv4();
    this.userId = userId;
    this.preferredGenders = [];
    this.minAge = 18;
    this.maxAge = 99;
    this.maxDistance = 50;
    this.distanceUnit = DistanceUnit.KILOMETERS;
    this.preferredInterests = [];
    this.dealBreakers = [];
    this.showOnlyVerifiedProfiles = false;
    this.showOnlyWithPhotos = true;
    this.allowMessagesFromMatches = true;
    this.allowMessagesFromEveryone = false;
    this.showOnlineStatus = true;
    this.showLastSeen = true;
    this.pushNotifications = true;
    this.emailNotifications = true;
    this.matchNotifications = true;
    this.messageNotifications = true;
    this.likeNotifications = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateGenderPreferences(genders: Gender[]): void {
    this.preferredGenders = [...new Set(genders)]; // Remove duplicates
    this.updatedAt = new Date();
  }

  updateAgeRange(minAge: number, maxAge: number): void {
    if (minAge < 18) throw new Error('Minimum age cannot be less than 18');
    if (maxAge > 99) throw new Error('Maximum age cannot be greater than 99');
    if (minAge > maxAge) throw new Error('Minimum age cannot be greater than maximum age');

    this.minAge = minAge;
    this.maxAge = maxAge;
    this.updatedAt = new Date();
  }

  updateDistancePreference(maxDistance: number, unit: DistanceUnit): void {
    if (maxDistance <= 0) throw new Error('Distance must be greater than 0');
    if (maxDistance > 1000) throw new Error('Distance cannot be greater than 1000');

    this.maxDistance = maxDistance;
    this.distanceUnit = unit;
    this.updatedAt = new Date();
  }

  updateInterestPreferences(interests: string[]): void {
    this.preferredInterests = [...new Set(interests)]; // Remove duplicates
    this.updatedAt = new Date();
  }

  addPreferredInterest(interest: string): void {
    if (!this.preferredInterests.includes(interest)) {
      this.preferredInterests.push(interest);
      this.updatedAt = new Date();
    }
  }

  removePreferredInterest(interest: string): void {
    this.preferredInterests = this.preferredInterests.filter(i => i !== interest);
    this.updatedAt = new Date();
  }

  updateDealBreakers(dealBreakers: string[]): void {
    this.dealBreakers = [...new Set(dealBreakers)]; // Remove duplicates
    this.updatedAt = new Date();
  }

  addDealBreaker(dealBreaker: string): void {
    if (!this.dealBreakers.includes(dealBreaker)) {
      this.dealBreakers.push(dealBreaker);
      this.updatedAt = new Date();
    }
  }

  removeDealBreaker(dealBreaker: string): void {
    this.dealBreakers = this.dealBreakers.filter(db => db !== dealBreaker);
    this.updatedAt = new Date();
  }

  updateFilterPreferences(showOnlyVerifiedProfiles?: boolean, showOnlyWithPhotos?: boolean): void {
    if (showOnlyVerifiedProfiles !== undefined) {
      this.showOnlyVerifiedProfiles = showOnlyVerifiedProfiles;
    }
    if (showOnlyWithPhotos !== undefined) {
      this.showOnlyWithPhotos = showOnlyWithPhotos;
    }
    this.updatedAt = new Date();
  }

  updateMessagingPreferences(
    allowMessagesFromMatches?: boolean,
    allowMessagesFromEveryone?: boolean,
  ): void {
    if (allowMessagesFromMatches !== undefined) {
      this.allowMessagesFromMatches = allowMessagesFromMatches;
    }
    if (allowMessagesFromEveryone !== undefined) {
      this.allowMessagesFromEveryone = allowMessagesFromEveryone;
    }
    this.updatedAt = new Date();
  }

  updatePrivacyPreferences(showOnlineStatus?: boolean, showLastSeen?: boolean): void {
    if (showOnlineStatus !== undefined) {
      this.showOnlineStatus = showOnlineStatus;
    }
    if (showLastSeen !== undefined) {
      this.showLastSeen = showLastSeen;
    }
    this.updatedAt = new Date();
  }

  updateNotificationPreferences(
    pushNotifications?: boolean,
    emailNotifications?: boolean,
    matchNotifications?: boolean,
    messageNotifications?: boolean,
    likeNotifications?: boolean,
  ): void {
    if (pushNotifications !== undefined) {
      this.pushNotifications = pushNotifications;
    }
    if (emailNotifications !== undefined) {
      this.emailNotifications = emailNotifications;
    }
    if (matchNotifications !== undefined) {
      this.matchNotifications = matchNotifications;
    }
    if (messageNotifications !== undefined) {
      this.messageNotifications = messageNotifications;
    }
    if (likeNotifications !== undefined) {
      this.likeNotifications = likeNotifications;
    }
    this.updatedAt = new Date();
  }

  isAgeInRange(age: number): boolean {
    return age >= this.minAge && age <= this.maxAge;
  }

  isGenderPreferred(gender: Gender): boolean {
    return this.preferredGenders.length === 0 || this.preferredGenders.includes(gender);
  }

  hasInterestMatch(interests: string[]): boolean {
    if (this.preferredInterests.length === 0) return true;

    return this.preferredInterests.some(interest => interests.includes(interest));
  }

  hasDealBreaker(interests: string[]): boolean {
    return this.dealBreakers.some(dealBreaker => interests.includes(dealBreaker));
  }
}
