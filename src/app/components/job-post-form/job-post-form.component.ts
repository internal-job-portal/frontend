import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-job-post-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-post-form.component.html',
  styleUrl: './job-post-form.component.scss',
})
export class JobPostFormComponent {
  jobData = {
    title: '',
    designation: '',
    description: '',
    location: '',
    requiredSkills: '',
    languagesRequired: '',
    status: 'Active',
    minExperience: 0,
    salaryMin: 0,
    salaryMax: 0,
  };
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

  private jobService = inject(JobService);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  onSubmit(form: NgForm) {
    if (form.valid) {
      const jobToSubmit = {
        ...this.jobData,
        requiredSkills: this.jobData.requiredSkills
          .split(',')
          .map((skill) => skill.trim()),
        languagesRequired: this.jobData.languagesRequired
          .split(',')
          .map((skill) => skill.trim()),
      };
      this.jobService.createJob(jobToSubmit).subscribe(
        () => {
          this.errorService.setSuccess('Job posted successfully!');
          this.router.navigate(['/']);
        },
        (error) => {
          this.errorService.setError('Error posting job: ' + error.message);
        }
      );
    } else {
      this.errorService.setError('Please fill all required fields correctly.');
    }
  }
}
