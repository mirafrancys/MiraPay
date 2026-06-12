import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProject } from '@mirapay/shared-models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.scss'],
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: IProject;
}
