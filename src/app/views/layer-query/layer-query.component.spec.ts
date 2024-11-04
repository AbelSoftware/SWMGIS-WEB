import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerQueryComponent } from './layer-query.component';

describe('LayerQueryComponent', () => {
  let component: LayerQueryComponent;
  let fixture: ComponentFixture<LayerQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerQueryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
