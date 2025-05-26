import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerSend, EmailParams, Recipient, Sender } from 'mailersend';
import { APIResponse } from 'mailersend/lib/services/request.service';

@Injectable()
export class EmailProvider implements OnModuleInit {
  private transporterInitialized = false;
  private mailersend: MailerSend;
  private recipients: Recipient[];
  private sender: Sender;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeTransporter();
  }

  private async initializeTransporter() {
    if (this.transporterInitialized) {
      return;
    }
    try {
      // Initialize MailerSend transporter
      const MAILERSEND_API_KEY = this.configService.get('MAILERSEND_API_KEY');

      this.mailersend = new MailerSend({ apiKey: MAILERSEND_API_KEY });

      this.transporterInitialized = true;
    } catch (error) {
      console.error('Failed to initialize email transport:', error);
      throw error;
    }
  }

  /**
   * Send a verification code email to a user
   * @param email The recipient's email address
   * @param code The verification code to send
   * @returns Promise with the result of the operation
   */
  async sendVerificationCode(email: string, code: string): Promise<APIResponse> {
    const appName = this.configService.get('APP_NAME', 'Our Application');
    const SENDER_EMAIL = this.configService.get('SMTP_FROM', 'infos@diner-damour.com');

    this.recipients = [new Recipient(email, appName || 'Destinataire')];
    this.sender = new Sender(SENDER_EMAIL, 'MailerSend Test Bot');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Verification Code</h2>
        <p>Use the following code to verify your action:</p>
        <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px;
             text-align: center; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 30px 0;" />
        <p style="color: #777; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `;
    const text = `
      Your verification code is: ${code}. It will expire in 5 minutes.
      If you didn't request this code, please ignore this email.
      This is an automated message, please do not reply.
    `;
    const emailParams = new EmailParams()
      .setFrom(this.sender)
      .setTo(this.recipients)
      .setSubject(`Your ${appName} Verification Code`)
      .setHtml(html)
      .setText(text || '');

    const result = await this.mailersend.email.send(emailParams);

    return result;
  }

  /**
   * Send a password reset email to a user
   * @param email The recipient's email address
   * @param resetToken The password reset token
   * @returns Promise with the result of the operation
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<APIResponse> {
    const appName = this.configService.get('APP_NAME', 'Our Application');
    const SENDER_EMAIL = this.configService.get('SMTP_FROM', 'infos@diner-damour.com');

    this.recipients = [new Recipient(email, appName || 'Destinataire')];
    this.sender = new Sender(SENDER_EMAIL, 'MailerSend Test Bot');

    const frontendUrl = this.configService.get('FRONTEND_URL', 'https://example.com');
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
                style="background-color: #4CAF50; color: white; padding: 12px 25px; 
                text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email or contact support.</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #777; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `;

    const text = `Click on the following link to reset your password: ${resetLink}. This link will expire in 1 hour.`;

    const emailParams = new EmailParams()
      .setFrom(this.sender)
      .setTo(this.recipients)
      .setSubject(`Your ${appName} Verification Code`)
      .setHtml(html)
      .setText(text || '');

    const result = await this.mailersend.email.send(emailParams);

    return result;
  }

  /**
   * Send a welcome email to a new user
   * @param email The recipient's email address
   * @param firstName The user's first name
   * @returns Promise with the result of the operation
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<APIResponse> {
    const appName = this.configService.get('APP_NAME', 'Our Application');
    const loginLink = this.configService.get('FRONTEND_URL', 'https://example.com');
    const SENDER_EMAIL = this.configService.get('SMTP_FROM', 'infos@diner-damour.com');

    this.recipients = [new Recipient(email, appName || 'Destinataire')];
    this.sender = new Sender(SENDER_EMAIL, 'MailerSend Test Bot');

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to ${appName}!</h2>
          <p>Hi ${firstName},</p>
          <p>We're excited to have you on board. Here are a few things you can do to get started:</p>
          <ul>
            <li>Complete your profile</li>
            <li>Explore the dashboard</li>
            <li>Connect with other users</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginLink}" 
                style="background-color: #4CAF50; color: white; padding: 12px 25px; 
                text-decoration: none; border-radius: 4px; font-weight: bold;">
              Get Started
            </a>
          </div>
          <p>If you have any questions, feel free to contact our support team.</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #777; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `;
    const text = `Welcome to ${appName}, ${firstName}! We're excited to have you on board. Click here to get started: ${loginLink}`;

    const emailParams = new EmailParams()
      .setFrom(this.sender)
      .setTo(this.recipients)
      .setSubject(`Welcome to ${appName}!`)
      .setHtml(html)
      .setText(text || '');

    const result = await this.mailersend.email.send(emailParams);

    return result;
  }
}
