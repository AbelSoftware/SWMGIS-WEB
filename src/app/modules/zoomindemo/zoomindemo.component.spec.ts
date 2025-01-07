import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomindemoComponent } from './zoomindemo.component';

describe('ZoomindemoComponent', () => {
  let component: ZoomindemoComponent;
  let fixture: ComponentFixture<ZoomindemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoomindemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoomindemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
