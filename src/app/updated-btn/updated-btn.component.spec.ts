import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedBtnComponent } from './updated-btn.component';

describe('UpdatedBtnComponent', () => {
  let component: UpdatedBtnComponent;
  let fixture: ComponentFixture<UpdatedBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatedBtnComponent]
    });
    fixture = TestBed.createComponent(UpdatedBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
