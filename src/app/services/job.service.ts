import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getJobs(status: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}?status=${status}`)
      .pipe(catchError(this.handleError));
  }

  getJobDetails(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getJobsForCandidate(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidate/${employeeId}`);
  }

  createJob(job: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, job)
      .pipe(catchError(this.handleError));
  }

  updateJob(id: number, job: any): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, job)
      .pipe(catchError(this.handleError));
  }

  deleteJob(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'object') {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
