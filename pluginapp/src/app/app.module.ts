import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { ForwardingPreferencesComponent } from './forwarding-preferences/forwarding-preferences.component';
import { ForwardingTabComponent } from './forwarding-tab/forwarding-tab.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ForwardingPreferencesComponent,
    ForwardingTabComponent
  ],
  imports: [
    BrowserModule,
    TabsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule  ],
  providers: [TabsetConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
