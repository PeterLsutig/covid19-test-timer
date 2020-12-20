import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {WindowService} from '../window.service';
import {IconSnackbarService} from '../icon-snackbar/icon-snackbar.service';
import {LocalStorageService} from 'ngx-webstorage';


export const SETTINGS_KEY = 'covid-timer-settings';
export const COUNTER_KEY = 'covid-timer-counter';

export const FALLBACK_VALUES = {
  phase1min: 2,
  phase1sec: 0,
  phase2min: 12,
  phase2sec: 0,
  deleteConfirmation: true,
  resetConfirmation: true,
  counter: 0,
};

export interface Settings {
  phase1min?: number;
  phase1sec?: number;
  phase2min?: number;
  phase2sec?: number;
  deleteConfirmation?: boolean;
  resetConfirmation?: boolean;
}

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {

  public settingsFormGroup: FormGroup;
  public counterFormControl: FormControl;

  constructor(private dialog: MatDialogRef<SettingsDialogComponent>, private formBuilder: FormBuilder,
              public windowService: WindowService, private snackbar: IconSnackbarService, private localSt: LocalStorageService) { }

  ngOnInit(): void {

    const savedSettings = this.localSt.retrieve(SETTINGS_KEY);
    const settingVals = savedSettings
      ? savedSettings
      : FALLBACK_VALUES;

    this.settingsFormGroup = this.formBuilder.group({

      phase1min: new FormControl(settingVals.phase1min, [Validators.required, Validators.min(0)]),
      phase1sec: new FormControl(settingVals.phase1sec, [Validators.required, Validators.min(0), Validators.max(59)]),

      phase2min: new FormControl(settingVals.phase2min, [Validators.required, Validators.min(0)]),
      phase2sec: new FormControl(settingVals.phase2sec, [Validators.required, Validators.min(0), Validators.max(59)]),

      deleteConfirmation: new FormControl(settingVals.deleteConfirmation),
      resetConfirmation: new FormControl(settingVals.resetConfirmation),
    });


    const savedCounter = this.localSt.retrieve(COUNTER_KEY);
    const counterVal = savedCounter
      ? savedCounter
      : 0;

    this.counterFormControl = new FormControl(counterVal, [Validators.required, Validators.min(0)]);
  }

  saveChanges(): void {
    if (!!this.settingsFormGroup.valid && !!this.counterFormControl) {
      const values = this.settingsFormGroup.value;
      this.localSt.store(SETTINGS_KEY, values);

      const counter = this.counterFormControl.value;
      this.localSt.store(COUNTER_KEY, counter);

      this.snackbar.successSnackbar('Änderungen gespeichert');
      this.close();
    }
    else {
      this.snackbar.failedSnackbar('Fehler');
    }
  }

  @HostListener('keydown.esc')
  public close(): void {
    this.dialog.close();
  }

}
