import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingDetailsComponent } from './receiving-details.component';

describe('ReceivingDetailsComponent', () => {
  let component: ReceivingDetailsComponent;
  let fixture: ComponentFixture<ReceivingDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivingDetailsComponent]
    });
    fixture = TestBed.createComponent(ReceivingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
