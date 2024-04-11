import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardingTabComponent } from './forwarding-tab.component';

describe('ForwardingTabComponent', () => {
  let component: ForwardingTabComponent;
  let fixture: ComponentFixture<ForwardingTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardingTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwardingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
