import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingComponent } from './receiving.component';

describe('ReceivingComponent', () => {
  let component: ReceivingComponent;
  let fixture: ComponentFixture<ReceivingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivingComponent]
    });
    fixture = TestBed.createComponent(ReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
