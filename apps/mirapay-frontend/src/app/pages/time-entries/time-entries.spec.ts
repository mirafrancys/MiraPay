import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { TimeEntriesComponent } from './time-entries';
import { TimeEntriesGateway } from '../../cores/gateways/time-entries.gateway';
import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { TasksGateway } from '../../cores/gateways/tasks.gateway';
import { AuthGateway } from '../../cores/gateways/auth.gateway';
import { TranslationService } from '../../cores/services/translation.service';

describe('TimeEntriesComponent', () => {
  let mockTimeGateway: Partial<TimeEntriesGateway>;
  let mockProjectsGateway: Partial<ProjectsGateway>;
  let mockTasksGateway: Partial<TasksGateway>;
  let mockAuthGateway: Partial<AuthGateway>;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockTimeGateway = {
      getAll: vi.fn().mockReturnValue(of([])),
      create: vi.fn().mockReturnValue(of({})),
    };

    mockProjectsGateway = {
      getAll: vi.fn().mockReturnValue(of([])),
    };

    mockTasksGateway = {
      getByProject: vi.fn().mockReturnValue(of([{ id: 't1', titre: 'Task 1' }])),
    };

    mockAuthGateway = {
      currentUser: signal({ id: 'u1' } as unknown as import('@mirapay/shared-models').IUser),
    };

    mockTranslationService = {
      translate: vi.fn((key: string) => key),
      getLanguage: vi.fn().mockReturnValue('fr'),
      setLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TimeEntriesComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: TimeEntriesGateway, useValue: mockTimeGateway },
        { provide: ProjectsGateway, useValue: mockProjectsGateway },
        { provide: TasksGateway, useValue: mockTasksGateway },
        { provide: AuthGateway, useValue: mockAuthGateway },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(TimeEntriesComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load tasks when project changes', async () => {
    const fixture = TestBed.createComponent(TimeEntriesComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    
    const event = { target: { value: 'p1' } } as unknown as Event;
    await comp.onProjectChange(event);
    
    expect(mockTasksGateway.getByProject).toHaveBeenCalledWith('p1');
    expect(comp.tasks().length).toBe(1);
    expect(comp.tasks()[0].id).toBe('t1');
  });

  it('should append userId to payload on submit', async () => {
    const fixture = TestBed.createComponent(TimeEntriesComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    comp.openModal();
    
    comp.timeForm.patchValue({
      projetId: 'p1',
      date: '2024-01-01',
      dureeHeures: 2
    });

    await comp.onSubmit();
    
    expect(mockTimeGateway.create).toHaveBeenCalled();
    const payload = (mockTimeGateway.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    
    expect(payload.userId).toBe('u1');
    expect(payload.date instanceof Date).toBe(true);
  });
});
