import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { SidebarComponent } from './components/sidebar/sidebar';
import { FooterComponent } from './components/footer/footer';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    HeaderComponent, 
    SidebarComponent, 
    FooterComponent
  ],
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-header></app-header>
      
      <div class="main-layout">
        <app-sidebar class="sidebar-wrapper"></app-sidebar>
        
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f8fafc;
    }
    .main-layout {
      display: flex;
      flex: 1;
    }
    .content-area {
      flex: 1;
      overflow-y: auto;
    }
    .sidebar-wrapper {
      flex-shrink: 0;
    }
    @media (max-width: 768px) {
      .sidebar-wrapper {
        display: none;
      }
    }
  `]
})
export class App {}
