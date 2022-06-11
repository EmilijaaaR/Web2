import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDeliverersComponent } from './pending-deliverers.component';

describe('PendingDeliverersComponent', () => {
  let component: PendingDeliverersComponent;
  let fixture: ComponentFixture<PendingDeliverersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingDeliverersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingDeliverersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
