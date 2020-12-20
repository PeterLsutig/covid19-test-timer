import { Component, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

/**
 * Icon snackbar component
 */
@Component({
  selector: 'app-icon-snackbar',
  templateUrl: './icon-snackbar.component.html',
  styleUrls: ['./icon-snackbar.component.scss']
})
export class IconSnackbarComponent {

  constructor(
    public snackBarRef: MatSnackBarRef<IconSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
