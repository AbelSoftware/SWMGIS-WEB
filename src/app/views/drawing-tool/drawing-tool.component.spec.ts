import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingToolComponent } from './drawing-tool.component';

describe('DrawingToolComponent', () => {
  let component: DrawingToolComponent;
  let fixture: ComponentFixture<DrawingToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawingToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
