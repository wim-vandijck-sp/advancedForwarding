import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardingPreferencesComponent } from './forwarding-preferences.component';

describe('ForwardingPreferencesComponent', () => {
  let component: ForwardingPreferencesComponent;
  let fixture: ComponentFixture<ForwardingPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardingPreferencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwardingPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
