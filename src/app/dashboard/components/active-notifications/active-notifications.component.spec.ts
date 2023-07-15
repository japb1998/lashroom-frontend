import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveNotificationsComponent } from './active-notifications.component';

describe('ActiveNotificationsComponent', () => {
  let component: ActiveNotificationsComponent;
  let fixture: ComponentFixture<ActiveNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
