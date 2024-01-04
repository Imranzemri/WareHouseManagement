import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevTransferComponent } from './rev-transfer.component';

describe('RevTransferComponent', () => {
  let component: RevTransferComponent;
  let fixture: ComponentFixture<RevTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevTransferComponent]
    });
    fixture = TestBed.createComponent(RevTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
