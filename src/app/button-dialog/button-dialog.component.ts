import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogButton {
  label: string;
  value: any;
  buttonStyle?: 'basic' | 'flat' | 'stroked' | 'raised';
  icon?: string;
  color?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-button-dialog',
  templateUrl: './button-dialog.component.html',
  styleUrls: ['./button-dialog.component.scss']
})
export class ButtonDialogComponent implements OnInit {

  get disableClose(): boolean {
    return this.dialog.disableClose;
  }

  get buttons(): DialogButton[] {
    return this.data.buttons;
  }

  get title(): string | undefined {
    return this.data.title;
  }

  get message(): string | undefined {
    return this.data.message;
  }

  get defaultReturnValue(): any {
    return this.data.defaultReturnValue;
  }

  constructor(private dialog: MatDialogRef<ButtonDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                buttons: DialogButton[],
                title?: string,
                message?: string,
                defaultReturnValue?: any
              }) { }

  ngOnInit(): void {
    console.log(this.buttons);
    console.log(this.defaultReturnValue);
  }

  public close(result: any = this.defaultReturnValue): void {
    this.dialog.close(result);
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    if (!this.disableClose) {
      this.close();
    }
  }

}
