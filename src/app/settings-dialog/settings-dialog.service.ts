import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SettingsDialogComponent} from './settings-dialog.component';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsDialogService {

  constructor(private dialog: MatDialog) { }

  showSettingsDialog(dialogConfig?: MatDialogConfig): Observable<any>{
    const defaultDialogConfig = {
      width: '75%',
      maxWidth: '100vw !important',
    };
    const config = {...defaultDialogConfig, ...dialogConfig};
    return this.dialog.open(SettingsDialogComponent, config).afterClosed();
  }

}
