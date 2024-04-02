import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizebuttonComponent } from './finalizebutton.component';

describe('FinalizebuttonComponent', () => {
  let component: FinalizebuttonComponent;
  let fixture: ComponentFixture<FinalizebuttonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalizebuttonComponent]
    });
    fixture = TestBed.createComponent(FinalizebuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
