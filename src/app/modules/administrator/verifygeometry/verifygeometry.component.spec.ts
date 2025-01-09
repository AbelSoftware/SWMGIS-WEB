import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifygeometryComponent } from './verifygeometry.component';

describe('VerifygeometryComponent', () => {
  let component: VerifygeometryComponent;
  let fixture: ComponentFixture<VerifygeometryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifygeometryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifygeometryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
