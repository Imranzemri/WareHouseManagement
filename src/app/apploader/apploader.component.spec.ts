import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApploaderComponent } from './apploader.component';

describe('ApploaderComponent', () => {
  let component: ApploaderComponent;
  let fixture: ComponentFixture<ApploaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApploaderComponent]
    });
    fixture = TestBed.createComponent(ApploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
