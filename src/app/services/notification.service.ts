import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/hr`;
  private hasUnreadNotificationsSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getUnreadNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications/unread`).pipe(
      tap((notifications) => {
        this.hasUnreadNotificationsSubject.next(notifications.length > 0);
      }),
      catchError((error) => {
        console.error('Error fetching unread notifications:', error);
        return of([]);
      })
    );
  }

  markAsRead(id: number): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/notifications/${id}/read`, {})
      .pipe(
        tap(() => {
          this.checkUnreadNotifications();
        }),
        catchError((error) => {
          console.error('Error marking notification as read:', error);
          return of(undefined);
        })
      );
  }

  checkUnreadNotifications(): void {
    this.getUnreadNotifications().subscribe();
  }

  get hasUnreadNotifications$(): Observable<boolean> {
    return this.hasUnreadNotificationsSubject.asObservable();
  }
}
