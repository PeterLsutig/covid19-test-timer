import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from '../shared-module';
import { MainComponent } from './main/main.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {IconSnackbarComponent} from './icon-snackbar/icon-snackbar.component';
import {ButtonDialogComponent} from './button-dialog/button-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SettingsDialogComponent,
    IconSnackbarComponent,
    ButtonDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    NgxWebstorageModule.forRoot(),
  ],
  entryComponents: [
    SettingsDialogComponent,
    IconSnackbarComponent,
    ButtonDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
