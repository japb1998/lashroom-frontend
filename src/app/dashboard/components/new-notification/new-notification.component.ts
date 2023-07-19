import { Component, OnInit } from '@angular/core'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { SnackBarComponent } from '../../../snack-bar/snack-bar.component'
import { map, of, switchMap } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { INewSchedule, NotificationService } from '../../notification.service'
import { ClientService } from '../../client.service'

@Component({
  selector: 'app-new-notification',
  templateUrl: './new-notification.component.html',
  styleUrls: ['./new-notification.component.css']
})
export class NewNotificationComponent implements OnInit {
  validContact!: boolean
  constructor (
    private notificationService: NotificationService,
    private clientService: ClientService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private activeRouting: ActivatedRoute
  ) {
    this.scheduleFormGroup.valueChanges.subscribe(v => {
      this.validContact = this.validate()
    })
  }

  scheduleFormGroup = new UntypedFormGroup({
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
    numberOfDays: new UntypedFormControl('', {
      validators: [Validators.required, Validators.min(1), Validators.max(15)]
    }),
    phone: new UntypedFormControl(false, {
      validators: [Validators.required]
    }),
    deliverByPhone: new UntypedFormControl(false, {
      validators: [Validators.required]
    }),
    deliverByEmail: new UntypedFormControl(false, {
      validators: [Validators.required]
    })
  })

  ngOnInit (): void {
    this.activeRouting.params
      .pipe(
        switchMap(({ id }) => {
          if (id) {
            return of(id)
          } else {
            return of(undefined)
          }
        })
      )
      .subscribe(async (id) => {
        if (id) {

          const client = await this.clientService.getSingleClient(id)

          this.scheduleFormGroup.patchValue({
            firstName:
              client.clientName?.split(' ')?.length > 1
                ? client.clientName?.split(' ')[0]
                : '',
            lastName:
              client.clientName?.split(' ')?.length > 1
                ? client.clientName.split(' ')[1]
                : '',
            email: client.email ?? '',
            phoneNumber: client.phone ?? ''
          })
        }
      })
  }
  validate () {
    const phone = this.scheduleFormGroup.get('phoneNumber');
    const email = this.scheduleFormGroup.get('email');

    if (email?.value && email.valid && phone?.value && phone.valid) {
      phone.setErrors(null)
      email.setErrors(null)

      return true
    } else if (
      phone?.touched &&
      !phone.value.length &&
      !email?.value.length &&
      email?.touched
    ) {
      phone.setErrors({ specificFieldsInvalid: true })
      email.setErrors({ specificFieldsInvalid: true })
      return false
    } else if (email?.value && email.valid) {
      if (phone?.value) {
        phone.setErrors({ specificFieldsInvalid: true })
      }
      return false
    } else if (phone?.value && phone.valid) {
      if (email?.value) email?.setErrors({ specificFieldsInvalid: true })
    } else if (!phone?.value?.length && !email?.value?.length) {
      email?.setErrors({ specificFieldsInvalid: true })
      phone?.setErrors({ specificFieldsInvalid: true })
      return false
    }
    if (/^[0-9]{10}$/.test(phone?.value) || !phone?.value.length) {
      phone?.setErrors(null)
    }
    if (
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email?.value) ||
      !email?.value.length
    ) {
      email?.setErrors(null)
    }
    return true
  }

  onSubmit () {
    const schedule: INewSchedule = {
      clientName: `${this.scheduleFormGroup.get('firstName')?.value} ${
        this.scheduleFormGroup.get('lastName')?.value
      }`,
      email: this.scheduleFormGroup.get('email')?.value,
      phone: this.scheduleFormGroup.get('phoneNumber')?.value,
      nextNotification: this.scheduleFormGroup.get('numberOfDays')?.value,
      deliveryMethods: []
    }
    if (this.scheduleFormGroup.get('deliverByEmail')?.value) {
      schedule.deliveryMethods.push(1)
    }
    if (this.scheduleFormGroup.get('deliverByPhone')?.value) {
      schedule.deliveryMethods.push(0)
    }
    this.notificationService
      .createNewSchedule(schedule)
      .then(() => {
        this.scheduleFormGroup.reset()
        this.router.navigate(['/'])
        this.openSnackBar()
      })
      .catch(console.error)
  }

  openSnackBar () {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 2000
    })
  }
}
