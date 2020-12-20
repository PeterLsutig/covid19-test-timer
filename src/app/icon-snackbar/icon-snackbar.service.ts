import { Injectable } from '@angular/core';
import { IconSnackbarComponent } from './icon-snackbar.component';
import { IconSnackbarType } from './icon-snackbar.types';
import {MatSnackBar} from '@angular/material/snack-bar';

/**
 * Ease of use service
 */
@Injectable({
  providedIn: 'root'
})
export class IconSnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  /**
   * Opens Snackbar for 2 seconds
   * @param message - the message to display
   * @param icon - the icon to display
   * @param duration - duration in ms
   * @param type - icon snackbar type
   */
  openSnackbar(message: string, icon: string, duration: number, type?: IconSnackbarType): void {
    this.snackBar.openFromComponent(IconSnackbarComponent, {
      duration,
      data: {
        message,
        icon,
        type
      }
    });
  }

  /**
   * Opens Snackbar for 2 seconds with success icon
   * @param message - the message to display
   */
  successSnackbar(message: string): void {
    this.openSnackbar(message, 'done', 2000, IconSnackbarType.SUCCESS);
  }

  /**
   * Opens Snackbar for 5 seconds with failed icon
   * @param message - the message to display
   */
  failedSnackbar(message: string): void {
    this.openSnackbar(message, 'close', 5000, IconSnackbarType.FAILED);
  }
}
