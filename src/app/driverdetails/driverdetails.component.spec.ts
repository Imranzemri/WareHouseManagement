import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverdetailsComponent } from './driverdetails.component';

describe('DriverdetailsComponent', () => {
  let component: DriverdetailsComponent;
  let fixture: ComponentFixture<DriverdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverdetailsComponent]
    });
    fixture = TestBed.createComponent(DriverdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
