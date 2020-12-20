import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import {SettingsDialogService} from './settings-dialog/settings-dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public settingsDialogService: SettingsDialogService) {}
}
