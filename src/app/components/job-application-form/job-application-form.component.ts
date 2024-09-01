import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';
import { ErrorService } from '../../services/error.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-application-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-application-form.component.html',
  styleUrl: './job-application-form.component.scss',
})
export class JobApplicationFormComponent implements OnInit {
  jobId: number = 0;
  candidateData = {
    firstName: '',
    lastName: '',
    employeeId: 0,
    email: '',
    jobId: 0,
    status: 'Applied',
    appliedAt: '',
  };

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private candidateService = inject(CandidateService);
  private errorService = inject(ErrorService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.jobId = +this.route.snapshot.paramMap.get('id')!;
    this.candidateData.jobId = this.jobId;

    // Populate employee ID and email from the logged-in user
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.candidateData.employeeId = currentUser.employeeId;
      this.candidateData.email = currentUser.email;
    } else {
      // If user is not logged in, redirect to login page
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (
      !this.candidateData.firstName ||
      !this.candidateData.lastName ||
      !this.candidateData.employeeId ||
      !this.candidateData.email
    ) {
      this.errorService.setError('Please fill in all fields.');
      return;
    }

    this.candidateData.appliedAt = new Date().toISOString();

    this.candidateService.applyForJob(this.candidateData).subscribe({
      next: () => {
        this.errorService.setSuccess('Application submitted successfully!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorService.setError(
          'Error submitting application: ' +
            (error.error?.message || error.error || 'An unknown error occurred')
        );
      },
    });
  }
}
