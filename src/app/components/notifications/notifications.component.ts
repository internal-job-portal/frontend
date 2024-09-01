import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  isHR$!: Observable<boolean>;

  private notificationService = inject(NotificationService);
  private errorService = inject(ErrorService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.isHR$ = this.authService.isHR$;
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getUnreadNotifications().subscribe(
      (notifications) => (this.notifications = notifications),
      (error) =>
        this.errorService.setError(
          'Error fetching notifications: ' + error.message
        )
    );
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id).subscribe(
      () => this.loadNotifications(),
      (error) =>
        this.errorService.setError(
          'Error marking notification as read: ' + error.message
        )
    );
  }
}
