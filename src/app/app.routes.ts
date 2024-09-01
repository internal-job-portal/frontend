import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobApplicationFormComponent } from './components/job-application-form/job-application-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { JobPostFormComponent } from './components/job-post-form/job-post-form.component';
import { EditJobFormComponent } from './components/edit-job-form/edit-job-form.component';
import { CandidatesListComponent } from './components/candidates-list/candidates-list.component';
import { AuthGuard } from './guards/auth.guard';
import { CandidateDetailComponent } from './components/candidate-detail/candidate-detail.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

export const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'job/:id', component: JobDetailsComponent, canActivate: [AuthGuard] },
  {
    path: 'apply/:id',
    component: JobApplicationFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'post-job',
    component: JobPostFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-job/:id',
    component: EditJobFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'candidates',
    component: CandidatesListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'candidate/:employeeId',
    component: CandidateDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
];
