import { Route } from '@angular/router';
import { authGuard } from './cores/guards/auth.guard';

export const appRoutes: Route[] = [
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/auth/register').then(m => m.RegisterComponent) 
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) 
      },
      { 
        path: 'clients', 
        loadComponent: () => import('./pages/clients/clients').then(m => m.ClientsComponent) 
      },
      { 
        path: 'clients/:id', 
        loadComponent: () => import('./pages/clients/client-detail/client-detail').then(m => m.ClientDetailComponent) 
      },
      { 
        path: 'projects', 
        loadComponent: () => import('./pages/projects/projects').then(m => m.ProjectsComponent) 
      },
      { 
        path: 'projects/:id', 
        loadComponent: () => import('./pages/projects/project-detail/project-detail').then(m => m.ProjectDetailComponent) 
      },
      { 
        path: 'time-entries', 
        loadComponent: () => import('./pages/time-entries/time-entries').then(m => m.TimeEntriesComponent) 
      },
      { 
        path: 'invoices', 
        loadComponent: () => import('./pages/invoices/invoices').then(m => m.InvoicesComponent) 
      },
      { 
        path: 'soumissions', 
        loadComponent: () => import('./pages/soumissions/soumissions').then(m => m.SoumissionsComponent) 
      },
      { 
        path: 'contrats', 
        loadComponent: () => import('./pages/contrats/contrats').then(m => m.ContratsComponent) 
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
