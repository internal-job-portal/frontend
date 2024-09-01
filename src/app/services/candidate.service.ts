import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private apiUrl = `${environment.apiUrl}/candidates`;

  constructor(private http: HttpClient) {}

  applyForJob(candidateData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/apply`, candidateData);
  }

  getCandidatesByJobId(jobId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/job/${jobId}`)
      .pipe(catchError(this.handleError));
  }

  getAllCandidates(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  updateCandidate(candidate: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${candidate.id}`, candidate);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
