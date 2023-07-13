import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DashboardService, INewClient } from '../../dashboard.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent {
  constructor(private dashboardService: DashboardService, private router: Router,private _snackBar: MatSnackBar) {

  }
  clientFormGroup = new UntypedFormGroup({
    firstName: new UntypedFormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    lastName: new UntypedFormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    email: new UntypedFormControl('', {
      validators: [Validators.email]
    }),
    phoneNumber: new UntypedFormControl('', {
      validators: [Validators.pattern(/^[0-9]{10}$/)]
    }),
    description: new UntypedFormControl('')
  });

  async onSubmit() {
    const newClient: INewClient = {
      clientName: `${this.clientFormGroup.get('firstName')?.value} ${
        this.clientFormGroup.get('lastName')?.value
      }`,
      phone: this.clientFormGroup.get('phoneNumber')?.value,
      email: this.clientFormGroup.get('email')?.value,
      description: this.clientFormGroup.get('description')?.value
    };

    this.dashboardService.createClient(newClient).then(() => {
      this.clientFormGroup.reset()
      this.router.navigate(['/'])
      this.openSnackBar('Client Created', 'close')
    })
    .catch((e) => {
      console.error(e);
      this.openSnackBar('Failed to create Client', 'close')
    })
  }

  openSnackBar (message: string, action: string) {
    this._snackBar.open(message, action)
  }
}
