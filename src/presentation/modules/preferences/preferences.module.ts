import { Module } from '@nestjs/common';

// Controllers
import { PreferencesController } from './preferences.controller';

// Repositories
import { PreferencesRepository } from '@infrastructure/repositories/preferences.repository';
import { PrismaModule } from '@infrastructure/database/prisma/prisma.module';

// Services
import { PreferencesService } from '@core/services/preferences.service';

@Module({
  imports: [PrismaModule],
  controllers: [PreferencesController],
  providers: [
    // Services
    {
      provide: PreferencesService,
      useClass: PreferencesService,
    },

    // Repository tokens
    {
      provide: 'IPreferencesRepository',
      useClass: PreferencesRepository,
    },
  ],
  exports: [PreferencesService],
})
export class PreferencesModule {}
