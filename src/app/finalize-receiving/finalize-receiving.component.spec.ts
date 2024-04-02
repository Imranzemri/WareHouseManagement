import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizeReceivingComponent } from './finalize-receiving.component';

describe('FinalizeReceivingComponent', () => {
  let component: FinalizeReceivingComponent;
  let fixture: ComponentFixture<FinalizeReceivingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalizeReceivingComponent]
    });
    fixture = TestBed.createComponent(FinalizeReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
