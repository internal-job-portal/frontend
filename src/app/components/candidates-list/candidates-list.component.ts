import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CandidateService } from '../../services/candidate.service';
import { ErrorService } from '../../services/error.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-candidates-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './candidates-list.component.html',
  styleUrl: './candidates-list.component.scss',
})
export class CandidatesListComponent implements OnInit {
  candidates: any[] = [];
  isHR$!: Observable<boolean>;

  private route = inject(ActivatedRoute);
  private candidateService = inject(CandidateService);
  private errorService = inject(ErrorService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.isHR$ = this.authService.isHR$;
    this.loadCandidates();
  }

  loadCandidates() {
    this.candidateService.getAllCandidates().subscribe(
      (candidates) => (this.candidates = candidates),
      (error) =>
        this.errorService.setError(
          'Error fetching candidates: ' + error.message
        )
    );
  }
}
