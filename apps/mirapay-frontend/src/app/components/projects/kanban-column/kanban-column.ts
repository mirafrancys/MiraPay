import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProject } from '@mirapay/shared-models';
import { ProjectCardComponent } from '../project-card/project-card';

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  templateUrl: './kanban-column.html',
  styleUrls: ['./kanban-column.scss'],
})
export class KanbanColumnComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) statusKey!: string;
  @Input({ required: true }) projects: IProject[] = [];
  @Input() totalBudget: number = 0;

  @Output() projectDropped = new EventEmitter<{
    projectId: string;
    targetStatus: string;
    previousIndex?: number;
    currentIndex?: number;
  }>();

  // Variables pour gérer l'interface visuelle du drag & drop natif
  isDragOver = false;

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Nécessaire pour autoriser le drop
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    // Récupération de l'ID stocké lors du dragStart (qui devra être fait côté ProjectCard ou Parent)
    const projectId = event.dataTransfer?.getData('text/plain');
    
    if (projectId) {
      this.projectDropped.emit({
        projectId,
        targetStatus: this.statusKey
      });
    }
  }
}
