import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

declare const PluginHelper: {
  getCsrfToken: Function
  getPluginRestUrl: Function
  getCurrentUsername: Function
};

declare const SailPoint: {
  CONTEXT_PATH: string
};

export interface ForwardingUser {
  id: string;
  attributes: {},
  name: string,
  firstName: string,
  lastName: string,
  displayName: string,
  workgroup: boolean,
  pseudo: boolean,
  locked: boolean
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

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      console.log("DEV mode");
      this.iiqUrl = '/identityiq'; // use proxy
      this.pluginUrl = '/identityiq/plugin/rest/advancedForwarding';
      let encoded = btoa(environment.username + ':' + environment.password);
      this.headers = new HttpHeaders({
        "Authorization": "Basic " + encoded,
        "Content-Type": "application/json",
        'Referrer-Policy': 'no-referrer'
      })
    } else {
      console.log("Prod mode?");
      this.pluginUrl = PluginHelper.getPluginRestUrl('advancedForwarding');
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
  getForwardingInfo(type: string): Observable<ForwardingInfo> {
    console.log("Entering getForwardingInfo() for type ", type);
    if (type === 'General') {
      return this.getData<ForwardingInfo>(this.iiqUrl, '/ui/rest/identityPreferences/forwarding');
    } else {
      return new Observable();
    }
  }

  setForwardingInfo(name: string) {
    console.log("Entering setForwardingInfo");
    let body = { "forwardUser": { "name": name }, "forwardStartDate": null, "fordwardEndDate": null };
    let url = this.iiqUrl + '/ui/rest/identityPreferences/forwarding';
    this.http.put(url, body, { headers: this.headers }).subscribe(res => {
      console.log(res);
    });
  }
}
