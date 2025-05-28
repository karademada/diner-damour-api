import { v4 as uuidv4 } from 'uuid';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum RelationshipStatus {
  SINGLE = 'SINGLE',
  IN_RELATIONSHIP = 'IN_RELATIONSHIP',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  COMPLICATED = 'COMPLICATED',
}

export class Profile {
  id: string;
  userId: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  height?: number; // in centimeters
  weight?: number; // in kilograms
  location?: string;
  occupation?: string;
  education?: string;
  relationshipStatus?: RelationshipStatus;
  interests: string[];
  photos: string[]; // Array of photo URLs/IDs
  isVisible: boolean;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(userId: string, id?: string) {
    this.id = id || uuidv4();
    this.userId = userId;
    this.interests = [];
    this.photos = [];
    this.isVisible = true;
    this.isComplete = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateBio(bio: string): void {
    this.bio = bio;
    this.updatedAt = new Date();
    this.checkCompleteness();
  }

  updateBasicInfo(
    dateOfBirth?: Date,
    gender?: Gender,
    height?: number,
    weight?: number,
    location?: string,
  ): void {
    if (dateOfBirth !== undefined) this.dateOfBirth = dateOfBirth;
    if (gender !== undefined) this.gender = gender;
    if (height !== undefined) this.height = height;
    if (weight !== undefined) this.weight = weight;
    if (location !== undefined) this.location = location;
    this.updatedAt = new Date();
    this.checkCompleteness();
  }

  updateProfessionalInfo(occupation?: string, education?: string): void {
    if (occupation !== undefined) this.occupation = occupation;
    if (education !== undefined) this.education = education;
    this.updatedAt = new Date();
    this.checkCompleteness();
  }

  updateRelationshipStatus(status: RelationshipStatus): void {
    this.relationshipStatus = status;
    this.updatedAt = new Date();
    this.checkCompleteness();
  }

  addInterest(interest: string): void {
    if (!this.interests.includes(interest)) {
      this.interests.push(interest);
      this.updatedAt = new Date();
      this.checkCompleteness();
    }
  }

  removeInterest(interest: string): void {
    this.interests = this.interests.filter(i => i !== interest);
    this.updatedAt = new Date();
    this.checkCompleteness();
  }

  updateInterests(interests: string[]): void {
    this.interests = [...new Set(interests)]; // Remove duplicates
    this.updatedAt = new Date();
    this.checkCompleteness();
  }

  addPhoto(photoUrl: string): void {
    if (!this.photos.includes(photoUrl)) {
      this.photos.push(photoUrl);
      this.updatedAt = new Date();
      this.checkCompleteness();
    }
  }

  removePhoto(photoUrl: string): void {
    this.photos = this.photos.filter(p => p !== photoUrl);
    this.updatedAt = new Date();
    this.checkCompleteness();
  }

  reorderPhotos(photoUrls: string[]): void {
    // Validate that all provided URLs exist in current photos
    const validPhotos = photoUrls.filter(url => this.photos.includes(url));
    this.photos = validPhotos;
    this.updatedAt = new Date();
  }

  setVisibility(isVisible: boolean): void {
    this.isVisible = isVisible;
    this.updatedAt = new Date();
  }

  private checkCompleteness(): void {
    const hasBasicInfo = !!(this.bio && this.dateOfBirth && this.gender && this.location);
    const hasPhotos = this.photos.length > 0;
    const hasInterests = this.interests.length > 0;

    this.isComplete = hasBasicInfo && hasPhotos && hasInterests;
  }

  getAge(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
