import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewbuttonComponent } from './reviewbutton.component';

describe('ReviewbuttonComponent', () => {
  let component: ReviewbuttonComponent;
  let fixture: ComponentFixture<ReviewbuttonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewbuttonComponent]
    });
    fixture = TestBed.createComponent(ReviewbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
