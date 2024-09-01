import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { JobService } from '../../services/job.service';
import { CandidateService } from '../../services/candidate.service';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss',
})
export class JobDetailsComponent implements OnInit {
  job: any;
  candidates: any[] = [];
  error: string | null = null;
  isHR$!: Observable<boolean>;
  descriptionSentences: string[] = [];
  requiredSkills: string[] = [];
  languagesRequired: string[] = [];

  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private candidateService = inject(CandidateService);
  private authService = inject(AuthService);
  private errorService = inject(ErrorService);

  ngOnInit() {
    this.isHR$ = this.authService.isHR$;

    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.loadJobDetails(+jobId);
      this.loadCandidates(+jobId);
    }
  }

  loadJobDetails(jobId: number) {
    this.jobService.getJobDetails(jobId).subscribe({
      next: (job) => {
        this.job = job;
        if (this.job && this.job.description) {
          this.descriptionSentences = this.job.description
            .split('.')
            .filter((sentence: string) => sentence.trim() !== '')
            .map((sentence: string) => sentence.trim());
        }
        this.requiredSkills = Array.isArray(this.job.requiredSkills)
          ? this.job.requiredSkills
          : this.job.requiredSkills
              ?.split(',')
              .map((skill: string) => skill.trim()) || [];
        this.languagesRequired = Array.isArray(this.job.languagesRequired)
          ? this.job.languagesRequired
          : this.job.languagesRequired
              ?.split(',')
              .map((language: string) => language.trim()) || [];
      },
      error: (error) => {
        this.error = 'Failed to load job details. Please try again later.';
        this.errorService.setError(
          'Error fetching job details: ' + error.message
        );
      },
    });
  }

  loadCandidates(jobId: number) {
    this.isHR$.subscribe((isHR) => {
      if (isHR) {
        this.candidateService.getCandidatesByJobId(jobId).subscribe({
          next: (candidates) => {
            this.candidates = candidates;
          },
          error: (error) => {
            this.errorService.setError(
              'Error fetching candidates: ' + error.message
            );
          },
        });
      }
    });
  }

  updateCandidateStatus(candidate: any, newStatus: string) {
    const updatedCandidate = { ...candidate, status: newStatus };
    this.candidateService.updateCandidate(updatedCandidate).subscribe({
      next: (latestCandidate) => {
        this.errorService.setSuccess('Candidate status updated successfully');
        // Optionally, refresh the candidates list
        this.loadCandidates(this.job.id);
      },
      error: (error) => {
        this.errorService.setError(
          'Error updating candidate status: ' + error.message
        );
      },
    });
  }
}
