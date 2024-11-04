import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLayerComponent } from './edit-layer.component';

describe('EditLayerComponent', () => {
  let component: EditLayerComponent;
  let fixture: ComponentFixture<EditLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
