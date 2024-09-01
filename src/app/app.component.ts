import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ErrorService } from './services/error.service';
import { NotificationService } from './services/notification.service';
import { Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  errorService = inject(ErrorService);
  notificationService = inject(NotificationService);

  errorMessage: string | null = null;
  successMessage: string | null = null;
  hasUnreadNotifications: boolean = false;
  private errorSubscription: Subscription | null = null;
  private successSubscription: Subscription | null = null;
  private notificationSubscription: Subscription | null = null;
  private authSubscription: Subscription | null = null;

  ngOnInit() {
    this.errorSubscription = this.errorService.errorMessage$.subscribe(
      (message) => {
        this.errorMessage = message;
        if (message) {
          setTimeout(() => (this.errorMessage = null), 5000);
        }
      }
    );

    this.successSubscription = this.errorService.successMessage$.subscribe(
      (message) => {
        this.successMessage = message;
        if (message) {
          setTimeout(() => (this.successMessage = null), 5000);
        }
      }
    );

    this.notificationSubscription =
      this.notificationService.hasUnreadNotifications$.subscribe(
        (hasUnread) => {
          this.hasUnreadNotifications = hasUnread;
        }
      );

    // Check for unread notifications whenever the authentication status changes
    this.authSubscription = this.authService.isLoggedIn$
      .pipe(
        filter((isLoggedIn) => isLoggedIn),
        switchMap(() => {
          // Check for unread notifications immediately after login
          this.notificationService.checkUnreadNotifications();
          // Return an observable that completes immediately
          return [];
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    if (this.successSubscription) {
      this.successSubscription.unsubscribe();
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
  }
}
