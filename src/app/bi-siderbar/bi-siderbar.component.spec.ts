import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiSiderbarComponent } from './bi-siderbar.component';

describe('BiSiderbarComponent', () => {
  let component: BiSiderbarComponent;
  let fixture: ComponentFixture<BiSiderbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BiSiderbarComponent]
    });
    fixture = TestBed.createComponent(BiSiderbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
