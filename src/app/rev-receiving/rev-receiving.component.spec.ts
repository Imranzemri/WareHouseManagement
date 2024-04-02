import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevReceivingComponent } from './rev-receiving.component';

describe('RevReceivingComponent', () => {
  let component: RevReceivingComponent;
  let fixture: ComponentFixture<RevReceivingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevReceivingComponent]
    });
    fixture = TestBed.createComponent(RevReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
