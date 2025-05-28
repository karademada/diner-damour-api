import { Module } from '@nestjs/common';

// Controllers
import { ProfileController } from './profile.controller';

// Repositories
import { ProfileRepository } from '@infrastructure/repositories/profile.repository';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';

// Services
import { ProfileService } from '@core/services/profile.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [
    // Services
    {
      provide: ProfileService,
      useClass: ProfileService,
    },

    // Repository tokens
    {
      provide: 'IProfileRepository',
      useClass: ProfileRepository,
    },
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
