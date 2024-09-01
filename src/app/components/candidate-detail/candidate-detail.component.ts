import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-candidate-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss'],
})
export class CandidateDetailComponent implements OnInit {
  appliedJobs: any[] = [];
  employeeId: number | null = null; // Using number | null

  constructor(private route: ActivatedRoute, private jobService: JobService) {}

  ngOnInit() {
    const employeeIdParam = this.route.snapshot.paramMap.get('employeeId');
    this.employeeId = employeeIdParam ? Number(employeeIdParam) : null;

    if (this.employeeId !== null && !isNaN(this.employeeId)) {
      this.loadAppliedJobs(this.employeeId);
    }
  }

  loadAppliedJobs(employeeId: number) {
    this.jobService.getJobsForCandidate(employeeId).subscribe((jobs) => {
      this.appliedJobs = jobs;
    });
  }
}
