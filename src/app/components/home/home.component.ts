import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { LucideAngularModule } from 'lucide-angular';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { FormsModule } from '@angular/forms';
import { combineLatest, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    TimeAgoPipe,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  jobs: any[] = [];
  isHR$ = inject(AuthService).isHR$;
  currentStatus: string = 'Active';
  private jobService = inject(JobService);
  private errorService = inject(ErrorService);
  private authService = inject(AuthService);
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.loadJobs();
  }

  ngOnDestroy() {
    this.jobs = [];
    this.subscription.unsubscribe();
  }

  loadJobs() {
    if (this.authService.isLoggedIn()) {
      this.jobService.getJobs(this.currentStatus).subscribe(
        (data) => {
          this.jobs = data;
        },
        (error) => {
          this.errorService.setError('Error fetching jobs: ' + error.message);
        }
      );
    }
  }

  deleteJob(jobId: number) {
    this.jobService.deleteJob(jobId).subscribe(
      () => {
        this.jobs = this.jobs.filter((job) => job.id !== jobId);
        this.errorService.setSuccess('Job deleted successfully');
      },
      (error) => {
        this.errorService.setError('Error deleting job: ' + error.message);
      }
    );
  }

  updateJobStatus(job: any, newStatus: string): void {
    const updatedJob = { ...job, status: newStatus };
    this.jobService.updateJob(job.id, updatedJob).subscribe({
      next: (latestJob) => {
        this.errorService.setSuccess(`Job ${newStatus} successfully`);
        // Update the job in the local array
        this.loadJobs();
      },
      error: (error) => {
        this.errorService.setError('Error closing job: ' + error.message);
      },
    });
  }
}
