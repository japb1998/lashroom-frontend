import { Component } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService, INewClient } from '../../client.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent {
  constructor(private clientService: ClientService, private router: Router,private _snackBar: MatSnackBar) {

  }
  clientFormGroup = new UntypedFormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    email: new FormControl('', {
      validators: [Validators.email]
    }),
    lastSeen: new FormControl(new Date(), {
      validators: [Validators.required]
    }),
    phoneNumber: new FormControl('', {
      validators: [Validators.pattern(/^\+[0-9]{1,2}[0-9]{10}$/)]
    }),
    description: new FormControl('')
  });

  async onSubmit() {

    const newClient: INewClient = {
      firstName: this.clientFormGroup.get('firstName')?.value,
      lastName: this.clientFormGroup.get('lastName')?.value,
      phone: this.clientFormGroup.get('phoneNumber')?.value,
      email: this.clientFormGroup.get('email')?.value,
      description: this.clientFormGroup.get('description')?.value,
      lastSeen: this.clientFormGroup.get('lastSeen')?.value?.toISOString()
    };

    this.clientService.createClient(newClient).then(() => {
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
