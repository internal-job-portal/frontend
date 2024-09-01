import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-edit-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-job-form.component.html',
  styleUrl: './edit-job-form.component.scss',
})
export class EditJobFormComponent implements OnInit {
  jobId: number = 0;
  jobData: any = {};
  designations: string[] = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'Project Manager',
    'Business Analyst',
  ];
  locations: string[] = [
    'Noida, India',
    'Australia and New Zealand',
    'Lowell, Massachusetts',
    'Weston, Florida',
    'Atlanta and Alpharetta, Georgia',
    'Indianapolis, Indiana',
    'Mexico City, Mexico',
    'Puerto Rico',
    'Montreal, Canada',
    'Montevideo, Uruguay',
    'Dublin and Kilkenny, Ireland',
    'Stuttgart, Germany',
    'Varna and Sofia, Bulgaria',
  ];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private errorService = inject(ErrorService);

  ngOnInit() {
    this.jobId = +this.route.snapshot.paramMap.get('id')!;
    this.jobService.getJobDetails(this.jobId).subscribe(
      (job) => {
        this.jobData = job;
        this.jobData.requiredSkills = job.requiredSkills.join(', ');
        this.jobData.languagesRequired = job.languagesRequired.join(', ');
      },
      (error) =>
        this.errorService.setError('Error fetching job: ' + error.message)
    );
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const updatedJob = {
        ...this.jobData,
        requiredSkills: this.jobData.requiredSkills
          .split(',')
          .map((skill: string) => skill.trim()),
        languagesRequired: this.jobData.languagesRequired
          .split(',')
          .map((skill: string) => skill.trim()),
        status: 'Active',
      };
      this.jobService.updateJob(this.jobId, updatedJob).subscribe(
        () => {
          this.errorService.setSuccess('Job updated successfully!');
          this.router.navigate(['/']);
        },
        (error) =>
          this.errorService.setError('Error updating job: ' + error.message)
      );
    } else {
      this.errorService.setError('Please fill all required fields correctly.');
    }
  }
}
