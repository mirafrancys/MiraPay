import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/auth/login';
import { RegisterComponent } from './pages/auth/register';
import { ClientsComponent } from './pages/clients/clients';
import { ProjectsComponent } from './pages/projects/projects';
import { TimeEntriesComponent } from './pages/time-entries/time-entries';
import { InvoicesComponent } from './pages/invoices/invoices';
import { authGuard } from './cores/guards/auth.guard';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'time-entries', component: TimeEntriesComponent },
      { path: 'invoices', component: InvoicesComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
