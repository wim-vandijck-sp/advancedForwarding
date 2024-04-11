import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ForwardingConfigServiceService, ForwardingInfo, ForwardingUser } from '../services/forwarding-config-service.service';

@Component({
  selector: 'app-forwarding-tab',
  templateUrl: './forwarding-tab.component.html',
  styleUrls: ['./forwarding-tab.component.css']
})
export class ForwardingTabComponent implements OnInit {
  @Input() heading!: string;
  forwardingForm!: FormGroup;
  forwardingInfo!: ForwardingInfo;
  forwardingIdentity: ForwardingUser | undefined;

  constructor(private forwardingConfigService: ForwardingConfigServiceService) {
    // Forwarding Form
    this.forwardingForm = new FormGroup({
      name: new FormControl(''),
      forwardingIdentity: new FormControl(''),
      forwardingStartDate: new FormControl(''),
      forwardingEndDate: new FormControl(''),
    });
  }
  ngOnInit() {
    console.log("onInit ", this.heading);
    this.fetchForwardingInfo();
  }

  private fetchForwardingInfo() {
    console.log("Entering fetchForwaringInfo");
    this.forwardingConfigService.getForwardingInfo(this.heading).subscribe((res: ForwardingInfo) => {
      this.forwardingInfo = res;
      console.log("Forwarding Info:");
      console.log(this.forwardingInfo);
      if (this.heading === 'General') {
        if (this.forwardingInfo.forwardUser) {
          this.forwardingIdentity = this.forwardingInfo.forwardUser;
          console.log("Current user: ");
          console.log(this.forwardingIdentity?.displayName);
        } else {
          console.log("No forwarding info");
        }
      } else {
        console.log(`Only General info for the moment, not for ${this.heading}`);
      }
    });
    console.log("Leaving fetchForwardingInfo");
  }

  onSubmit() {
    console.log("Entering onSubmit");
    console.log(this.forwardingForm);
    this.forwardingInfo = this.forwardingForm.value;
    let name = this.forwardingForm.controls['name'].value;
    console.log(`Name: ${name}`);
    this.forwardingConfigService.setForwardingInfo(name);
    this.forwardingForm.reset();
    this.fetchForwardingInfo();
    console.log("Leaving onSubmit");
  }
}
