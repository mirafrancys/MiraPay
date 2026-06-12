import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProject } from '@mirapay/shared-models';
import { TranslationService } from '../../../cores/services/translation.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.scss'],
})
export class ProjectCardComponent {
  public ts = inject(TranslationService);
  @Input({ required: true }) project!: IProject;
}
