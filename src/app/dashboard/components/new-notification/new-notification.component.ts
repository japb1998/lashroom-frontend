import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-notification',
  templateUrl: './new-notification.component.html',
  styleUrls: ['./new-notification.component.css']
})
export class NewNotificationComponent implements OnInit {

  constructor() { }
  
  scheduleFormGroup = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    lastName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    phoneNumber: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
    }),
    numberOfDays: new FormControl('', {
      validators: [Validators.required, Validators.min(1), Validators.max(15)]
    })
  })

  ngOnInit(): void {
    this.scheduleFormGroup.valueChanges.subscribe(console.log)
  }

}
