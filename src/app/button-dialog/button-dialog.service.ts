import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {ButtonDialogComponent, DialogButton} from './button-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ButtonDialogService {

  constructor(private dialog: MatDialog) { }

  showButtonsDialog<T>(params: {
                         buttons: DialogButton[],
                         title?: string,
                         message?: string,
                         defaultReturnValue: T },
                       dialogConfig?: MatDialogConfig): Observable<T | null> {
    const defaultparams = {
      defaultReturnValue: null,
      title: '',
      message: '',
    };
    const data = {...defaultparams, ...params};
    const config = {
      ...dialogConfig,
      ...{data}
    };
    return this.dialog.open(ButtonDialogComponent, config).afterClosed();
  }

  showConfirmDialog(title: string, message: string,
                    buttons: DialogButton[] =
                      [
                        {label: 'abbrechen', value: false, buttonStyle: 'flat'},
                        {label: 'ja', value: true, buttonStyle: 'flat', color: 'primary'},
                      ],
                    dialogConfig?: MatDialogConfig): Observable<boolean> {
    const params = {
      buttons,
      defaultReturnValue: false,
      title,
      message
    };
    return this.showButtonsDialog<boolean>(params, dialogConfig);
  }

}
