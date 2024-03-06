import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiSplashscreenComponent } from './bi-splashscreen.component';

describe('BiSplashscreenComponent', () => {
  let component: BiSplashscreenComponent;
  let fixture: ComponentFixture<BiSplashscreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiSplashscreenComponent]
    });
    fixture = TestBed.createComponent(BiSplashscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
