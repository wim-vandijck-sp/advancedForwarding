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

  private async fetchForwardingInfo() {
    console.log("Entering fetchForwaringInfo for ", this.heading);
    this.forwardingInfo = await this.forwardingConfigService.getForwardingInfo(this.heading);
    this.forwardingIdentity = this.forwardingInfo.forwardUser;
    console.log('Info:',this.forwardingInfo );
    console.log(`Identity: ${this.forwardingInfo!.forwardUser!.name}`);
    console.log(`Promised info: ${this.forwardingInfo.forwardUser?.displayName}`);
    console.log(`Leaving fetchForwardingInfo for ${this.heading}: ${this.forwardingInfo.forwardUser?.displayName}`);
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
