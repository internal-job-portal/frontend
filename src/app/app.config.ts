import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import {
  Banknote,
  Clock,
  Globe,
  LucideAngularModule,
  BriefcaseBusiness,
  Bell,
  UserRound,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(FormsModule),
    importProvidersFrom(
      LucideAngularModule.pick({
        Banknote,
        Globe,
        Clock,
        BriefcaseBusiness,
        Bell,
        UserRound,
      })
    ),
  ],
};
