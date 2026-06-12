import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectEditDlgComponent } from './project-edit-dlg';
import { TranslationService } from '../../../cores/services/translation.service';

describe('ProjectEditDlgComponent', () => {
  let component: ProjectEditDlgComponent;
  let fixture: ComponentFixture<ProjectEditDlgComponent>;

  beforeEach(async () => {
    const mockTranslationService = {
      translate: vi.fn((key: string) => key)
    };

    await TestBed.configureTestingModule({
      imports: [ProjectEditDlgComponent],
      providers: [
        { provide: TranslationService, useValue: mockTranslationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectEditDlgComponent);
    component = fixture.componentInstance;
    component.clients = [];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
