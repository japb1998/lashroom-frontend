import { Component, OnInit, inject } from '@angular/core';
import { MatLegacySnackBarRef as MatSnackBarRef } from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent implements OnInit {
  snackBarRef = inject(MatSnackBarRef);
  constructor() { }
  
  ngOnInit(): void {
  }

}
