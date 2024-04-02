import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundpatternComponent } from './backgroundpattern.component';

describe('BackgroundpatternComponent', () => {
  let component: BackgroundpatternComponent;
  let fixture: ComponentFixture<BackgroundpatternComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackgroundpatternComponent]
    });
    fixture = TestBed.createComponent(BackgroundpatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
