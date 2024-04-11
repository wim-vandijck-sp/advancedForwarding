import { Component } from '@angular/core';

@Component({
  selector: 'app-forwarding-preferences',
  templateUrl: './forwarding-preferences.component.html',
  styleUrls: ['./forwarding-preferences.component.css']
})
export class ForwardingPreferencesComponent {
  tabs = [
    { title: 'General', active: true },
    { title: 'Approvals' },
    { title: 'Certifications'  },
  ]
}
