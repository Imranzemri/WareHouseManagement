import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintbuttonComponent } from './printbutton.component';

describe('PrintbuttonComponent', () => {
  let component: PrintbuttonComponent;
  let fixture: ComponentFixture<PrintbuttonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintbuttonComponent]
    });
    fixture = TestBed.createComponent(PrintbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
