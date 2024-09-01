import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessageSubject.asObservable();

  private successMessageSubject = new BehaviorSubject<string | null>(null);
  successMessage$ = this.successMessageSubject.asObservable();

  setError(message: string) {
    this.errorMessageSubject.next(message);
  }

  setSuccess(message: string) {
    this.successMessageSubject.next(message);
  }

  clearError() {
    this.errorMessageSubject.next(null);
  }

  clearSuccess() {
    this.successMessageSubject.next(null);
  }
}
