import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyForDelivererComponent } from './apply-for-deliverer.component';

describe('ApplyForDelivererComponent', () => {
  let component: ApplyForDelivererComponent;
  let fixture: ComponentFixture<ApplyForDelivererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyForDelivererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyForDelivererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
