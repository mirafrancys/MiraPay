import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/auth/login';
import { RegisterComponent } from './pages/auth/register';
import { ClientsComponent } from './pages/clients/clients';
import { ClientDetailComponent } from './pages/clients/client-detail/client-detail';
import { ProjectsComponent } from './pages/projects/projects';
import { TimeEntriesComponent } from './pages/time-entries/time-entries';
import { InvoicesComponent } from './pages/invoices/invoices';
import { SoumissionsComponent } from './pages/soumissions/soumissions';
import { ContratsComponent } from './pages/contrats/contrats';
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
      { path: 'clients/:id', component: ClientDetailComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'time-entries', component: TimeEntriesComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'soumissions', component: SoumissionsComponent },
      { path: 'contrats', component: ContratsComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
