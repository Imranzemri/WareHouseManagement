import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDetailComponent } from './shipment-detail.component';

describe('ShipmentDetailComponent', () => {
  let component: ShipmentDetailComponent;
  let fixture: ComponentFixture<ShipmentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShipmentDetailComponent]
    });
    fixture = TestBed.createComponent(ShipmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
