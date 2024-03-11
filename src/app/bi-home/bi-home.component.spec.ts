import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiHomeComponent } from './bi-home.component';

describe('BiHomeComponent', () => {
  let component: BiHomeComponent;
  let fixture: ComponentFixture<BiHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiHomeComponent]
    });
    fixture = TestBed.createComponent(BiHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
