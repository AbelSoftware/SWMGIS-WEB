import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureformComponent } from './featureform.component';

describe('FeatureformComponent', () => {
  let component: FeatureformComponent;
  let fixture: ComponentFixture<FeatureformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
