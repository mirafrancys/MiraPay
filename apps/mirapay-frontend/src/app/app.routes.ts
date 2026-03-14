import { Route } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/auth/login';
import { RegisterComponent } from './pages/auth/register';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
