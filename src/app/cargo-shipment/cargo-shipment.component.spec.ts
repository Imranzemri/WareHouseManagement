import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoShipmentComponent } from './cargo-shipment.component';

describe('CargoShipmentComponent', () => {
  let component: CargoShipmentComponent;
  let fixture: ComponentFixture<CargoShipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargoShipmentComponent]
    });
    fixture = TestBed.createComponent(CargoShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
