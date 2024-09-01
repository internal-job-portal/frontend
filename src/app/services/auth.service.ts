import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private currentUserSubject: BehaviorSubject<any>;
  private router = inject(Router);
  public currentUser: Observable<any>;
  public isLoggedIn$: Observable<boolean>;
  public isHR$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.isLoggedIn$ = this.currentUser.pipe(
      map((user) => !!user && !!user.token)
    );
    this.isHR$ = this.currentUser.pipe(
      map(
        (user) => !!user && user.authorities && user.authorities.includes('HR')
      )
    );
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      map((response) => {
        if (response && response.token) {
          const user = {
            employeeId: response.employeeId,
            email: response.email,
            authorities: response.authorities,
            token: response.token,
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const currentUser = this.currentUserValue;
    return !!currentUser && !!currentUser.token;
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserValue;
    return (
      currentUser &&
      currentUser.authorities &&
      currentUser.authorities.includes(role)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = error.error || 'An unknown error occurred';

    return throwError(() => errorMessage);
  }
}
