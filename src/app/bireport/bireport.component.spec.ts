import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BireportComponent } from './bireport.component';

describe('BireportComponent', () => {
  let component: BireportComponent;
  let fixture: ComponentFixture<BireportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BireportComponent]
    });
    fixture = TestBed.createComponent(BireportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
