import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerMasterComponent } from './layer-master.component';

describe('LayerMasterComponent', () => {
  let component: LayerMasterComponent;
  let fixture: ComponentFixture<LayerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
