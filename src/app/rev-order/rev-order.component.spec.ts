import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevOrderComponent } from './rev-order.component';

describe('RevOrderComponent', () => {
  let component: RevOrderComponent;
  let fixture: ComponentFixture<RevOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevOrderComponent]
    });
    fixture = TestBed.createComponent(RevOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
