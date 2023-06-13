import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable } from '@angular/core';

@Injectable()
export class UIService {
    loadingStateChanged: any;

    constructor(private snackbar: MatSnackBar) {

    }

    showSnackbar(message: string, action: string | undefined, duration: any) {
        this.snackbar.open(message, action, {
            duration: duration
        });
    }
}