import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRecvComponent } from './test-recv.component';

describe('TestRecvComponent', () => {
  let component: TestRecvComponent;
  let fixture: ComponentFixture<TestRecvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestRecvComponent]
    });
    fixture = TestBed.createComponent(TestRecvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
