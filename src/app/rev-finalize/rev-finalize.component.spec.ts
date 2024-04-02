import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevFinalizeComponent } from './rev-finalize.component';

describe('RevFinalizeComponent', () => {
  let component: RevFinalizeComponent;
  let fixture: ComponentFixture<RevFinalizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevFinalizeComponent]
    });
    fixture = TestBed.createComponent(RevFinalizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
