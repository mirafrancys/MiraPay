import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KanbanColumnComponent } from './kanban-column';
import { IProject } from '@mirapay/shared-models';

describe('KanbanColumnComponent', () => {
  let component: KanbanColumnComponent;
  let fixture: ComponentFixture<KanbanColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanColumnComponent);
    component = fixture.componentInstance;
    
    // Définir les Inputs obligatoires
    component.title = 'En Cours';
    component.statusKey = 'enCours';
    component.projects = [];
    component.totalBudget = 0;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the correct title and count', () => {
    component.projects = [
      { id: '1', nom: 'P1' } as IProject,
      { id: '2', nom: 'P2' } as IProject
    ];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('.title')?.textContent).toContain('En Cours');
    expect(compiled.querySelector('.count-badge')?.textContent).toContain('2');
  });

  it('should toggle isDragOver on dragover and dragleave', () => {
    fixture.detectChanges();
    const event = new Event('dragover') as any;
    event.preventDefault = vi.fn();

    component.onDragOver(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.isDragOver).toBe(true);

    component.onDragLeave(event);
    expect(component.isDragOver).toBe(false);
  });

  it('should emit projectDropped with correct data on drop', () => {
    const emitSpy = vi.spyOn(component.projectDropped, 'emit');
    
    // Créer un DataTransfer simulé
    const mockDataTransfer = {
      getData: vi.fn().mockReturnValue('p123')
    };

    const dropEvent = new Event('drop') as any;
    dropEvent.preventDefault = vi.fn();
    dropEvent.dataTransfer = mockDataTransfer;

    component.onDrop(dropEvent);

    expect(dropEvent.preventDefault).toHaveBeenCalled();
    expect(mockDataTransfer.getData).toHaveBeenCalledWith('text/plain');
    expect(emitSpy).toHaveBeenCalledWith({
      projectId: 'p123',
      targetStatus: 'enCours'
    });
    expect(component.isDragOver).toBe(false);
  });
});
