import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IRoleRepository } from '../repositories/role.repository.interface';
import {
  EntityNotFoundException,
  EntityAlreadyExistsException,
  AuthenticationException,
} from '@core/exceptions/domain-exceptions';
import { Email } from '@core/value-objects/email.vo';
import { Password } from '@core/value-objects/password.vo';
import { FirstName, LastName } from '@core/value-objects/name.vo';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('RoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async createUser(
    emailStr: string,
    passwordStr: string,
    firstName: string,
    lastName: string,
    acceptTerms: boolean,
    receiveNotifications: boolean,
  ): Promise<User> {
    // Validate email using value object
    const email = new Email(emailStr);

    // Validate password using value object
    const password = new Password(passwordStr);

    // Validate acceptTerms
    if (!acceptTerms) {
      throw new Error('Terms and conditions must be accepted');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email.getValue());
    if (existingUser) {
      throw new EntityAlreadyExistsException('User', 'email');
    }

    // Hash the password
    const passwordHash = await this.hashPassword(password.getValue());

    // Create a new user with value objects for name and new attributes
    const user = new User(
      email,
      passwordHash,
      new FirstName(firstName),
      new LastName(lastName),
      acceptTerms,
      receiveNotifications,
    );

    // Assign default role
    const defaultRole = await this.roleRepository.findDefaultRole();
    if (defaultRole) {
      user.addRole(defaultRole);
    }

    // Save the user
    return this.userRepository.create(user);
  }

  async validateCredentials(emailStr: string, passwordStr: string): Promise<User | null> {
    try {
      // Validate email format
      const email = new Email(emailStr);

      const user = await this.userRepository.findByEmail(email.getValue());
      if (!user || !user.isActive) {
        return null;
      }

      const isPasswordValid = await this.comparePasswords(passwordStr, user.passwordHash);
      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        // Handle user not found error
        return null;
      }

      // If email is invalid, return null instead of throwing
      return null;
    }
  }

  async updateUserDetails(
    userId: string,
    firstName?: string,
    lastName?: string,
    emailStr?: string,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    if (firstName) {
      user.firstName = new FirstName(firstName);
    }

    if (lastName) {
      user.lastName = new LastName(lastName);
    }

    if (emailStr) {
      // Validate email using value object
      const email = new Email(emailStr);

      // Check if email is already in use by another user
      const existingUser = await this.userRepository.findByEmail(email.getValue());
      if (existingUser && existingUser.id !== userId) {
        throw new EntityAlreadyExistsException('User', 'email');
      }

      user.email = email;
    }

    user.updatedAt = new Date();

    return this.userRepository.update(user);
  }

  async verifyCurrentPassword(userId: string, currentPassword: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    return this.comparePasswords(currentPassword, user.passwordHash);
  }

  async changePassword(
    userId: string,
    newPasswordStr: string,
    currentPassword?: string,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    // If current password is provided, verify it
    if (currentPassword) {
      const isCurrentPasswordValid = await this.comparePasswords(
        currentPassword,
        user.passwordHash,
      );

      if (!isCurrentPasswordValid) {
        throw new AuthenticationException('Current password is incorrect');
      }
    }

    // Validate new password using value object
    const newPassword = new Password(newPasswordStr);

    user.passwordHash = await this.hashPassword(newPassword.getValue());
    user.updatedAt = new Date();

    return this.userRepository.update(user);
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new EntityNotFoundException('Role', roleId);
    }

    user.addRole(role);

    return this.userRepository.update(user);
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    user.removeRole(roleId);

    return this.userRepository.update(user);
  }

  async activateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    user.activate();

    return this.userRepository.update(user);
  }

  async deactivateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    user.deactivate();

    return this.userRepository.update(user);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
