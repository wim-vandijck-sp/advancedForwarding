import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

declare const require: (arg0: string) => any;
const xml2js = require("xml2js");

declare const PluginHelper: {
  getCsrfToken: Function
  getPluginRestUrl: Function
  getCurrentUsername: Function
};

declare const SailPoint: {
  CONTEXT_PATH: string
};

interface Preference {
  key: string;
  value: string;
}

export interface DebugInfo {
  status: string;
  requestID: string;
  warnings: string;
  errors: string;
  retryWait: number;
  metaData: any;
  attributes: any;
  objects: {
    class: string;
    id: string;
    readonly: boolean;
    xml: string;
  }[];
  count: number;
  complete: true;
  success: boolean;
  retry: boolean;
  failure: boolean;
}

export interface ForwardingUser {
  id: string;
  attributes?: {};
  name: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  workgroup?: boolean;
  pseudo?: boolean;
  locked?: boolean;
}

export interface ForwardingInfo {
  forwardUser?: ForwardingUser;
  startDate?: Date;
  endDate?: Date;
}
@Injectable({
  providedIn: 'root'
})
export class ForwardingConfigServiceService {
  headers!: HttpHeaders;
  iiqUrl: string;
  pluginUrl: any;
  token: any;
  username: string;

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      console.log("DEV mode");
      this.iiqUrl = '/identityiq'; // use proxy
      this.pluginUrl = '/identityiq/plugin/rest/advancedForwarding';
      this.username = environment.username;
      let encoded = btoa(environment.username + ':' + environment.password);
      this.headers = new HttpHeaders({
        "Authorization": "Basic " + encoded,
        "Content-Type": "application/json",
        'Referrer-Policy': 'no-referrer'
      })
    } else {
      console.log("Prod mode?");
      this.pluginUrl = PluginHelper.getPluginRestUrl('advancedForwarding');
      this.username = PluginHelper.getCurrentUsername();
      this.iiqUrl = SailPoint.CONTEXT_PATH;
      this.token = PluginHelper.getCsrfToken();
      this.headers = new HttpHeaders({
        "X-XSRF-TOKEN": this.token,
        "Content-Type": "application/json"
      })
    }
  }
  /**
   * Generic method to get data from endpoint
   * @param endpointURL
   * @returns {*}
   */
  getData<T>(baseURL: string, endpointURL: string): Observable<T> {
    return this.http.get<T>(baseURL + endpointURL, { headers: this.headers });
  }

  /**
  * Get initial data for forwarding fields
  * @returns {ForwardingInfo} Set of Forwarding Info data.
  */
  async getForwardingInfo(type: string): Promise<ForwardingInfo> {
    console.log("Entering getForwardingInfo() for type ", type);
    // let forwardingInfo: ForwardingInfo = {};
    if (type === 'General') {
      return new Promise<ForwardingInfo>((resolve) => {
        this.getData<ForwardingInfo>(this.iiqUrl, '/ui/rest/identityPreferences/forwarding').subscribe((res: ForwardingInfo) => {
          console.log("Forwarding Info:");
          // forwardingInfo = res;
          // console.log(forwardingInfo);
          resolve(res);
        });
      });
    } else {
      let attrName = type.toLowerCase() + 'Forward';
      let result = this.getData<DebugInfo>(this.iiqUrl, '/rest/debug/Identity/' + this.username + '?useName=true');
      let xml: any;
      let forwardingInfo: ForwardingInfo = {};
      // let forwardingUser: ForwardingUser = { };
      return new Promise<ForwardingInfo>((resolve) => {
        result.subscribe(async (debug: DebugInfo) => {
          console.log(`Result for ${type} on ${this.username}`);
          // console.log(debug);
          xml = debug.objects[0].xml;
          // console.log(xml);
          let prefs = await this.parseXmlToJson(xml);
          console.log('prefs');
          console.log(prefs);
          console.log('Checking for ', attrName);
          prefs.forEach(element => {
            if (element.key === attrName) {
              console.log("Found a match for ", type);
              console.log(`Key : ${element.key}`);
              console.log(`Value : ${element.value}`);
              let forwardingUser: ForwardingUser = { id: element.value, name: element.value };
              console.log(`ForwardingUser : ${forwardingUser.name}`);
              forwardingInfo = { forwardUser: forwardingUser }
            } else {
              console.log(`No match for ${attrName}`);
            }
          });
          resolve(forwardingInfo);
        });
      });
    }
  }

  /**
   * Set the forworders info.
   * In the case of General, we'll use the existing preferences rest ui
   * Otherwise, we'll call a workflow to call setPreference() on the identity.
   * @param type The Type of forwarding info
   * @param name The forwarders name.
   */
  setForwardingInfo(type: string, name: string) {
    console.log(`Entering setForwardingInfo for type ${type} to ${name}`);
    let body = {};
    if (type === 'General') {
      body = { "forwardUser": { "name": name }, "forwardStartDate": null, "fordwardEndDate": null };
      let url = this.iiqUrl + '/ui/rest/identityPreferences/forwarding';
      this.http.put(url, body, { headers: this.headers }).subscribe(res => {
        console.log(res);
      });
    } else {
      console.log("Launching workflow");
      let url = this.iiqUrl + '/rest/workflows/Manage%20Forwarders/launch';
      let certificationForward = '';
      let approvalsForward      = '';
      let policyForward        = '';
      switch (type) {
        case "Certifications": {
          certificationForward = name;
          break;
        }
        case "Approvals": {
          approvalsForward = name;
          break;
        }
        case "Policy": {
          policyForward = name;
          break;
        }
        default:
      }
      body = { "workflowArgs": { "launcher": this.username, "certificationsForward": certificationForward, "approvalsForward": approvalsForward, "policyForward": policyForward } };
      this.http.post(url, body, { headers: this.headers }).subscribe(res => {
        console.log(res);
      });
    }
  }

  async parseXmlToJson(xml: string): Promise<Preference[]> {
    console.log("Entering parseXmlToJson");
    let preferences!: Preference[];
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xml, function (err: any, result: any) {
      preferences = [];
      console.log(result.Identity.Preferences);
      result.Identity.Preferences.Map.entry.forEach((value: any) => {
        console.log(`${value.$.key} : ${value.$.value}`)
        let preference = { key: value.$.key, value: value.$.value };
        console.log(preference);
        preferences.push(preference);
        console.log(preferences);

      });
      // console.log(preferences);
      console.log('Done');
    });
    console.log("Leaving parseXmlToJson: ");
    return preferences;
  }
}
