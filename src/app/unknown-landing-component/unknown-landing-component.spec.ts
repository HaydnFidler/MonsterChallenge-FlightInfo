import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownLandingComponent } from './unknown-landing-component';

describe('UnknownLandingComponent', () => {
  let component: UnknownLandingComponent;
  let fixture: ComponentFixture<UnknownLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnknownLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnknownLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
