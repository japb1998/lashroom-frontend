import { Component, OnInit } from '@angular/core'
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { SnackBarComponent } from '../../../snack-bar/snack-bar.component'
import { BehaviorSubject, filter, map, Observable, of, Subject, switchMap, take, takeUntil } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { INewSchedule, NotificationService } from '../../notification.service'
import { ClientService, IClient } from '../../client.service'
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-new-notification',
  templateUrl: './new-notification.component.html',
  styleUrls: ['./new-notification.component.css']
})
export class NewNotificationComponent implements OnInit {
  validContact!: boolean
  clients$!: Observable<IClient[]>;
  destroy$: Subject<boolean> = new Subject();
  notificationDate: Date = new Date();

  constructor (
    private notificationService: NotificationService,
    private clientService: ClientService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private activeRouting: ActivatedRoute
  ) {
    this.scheduleFormGroup.valueChanges.subscribe(v => {
      let date: Date = this.scheduleFormGroup.get('time')?.value;
    })
  
  }

  scheduleFormGroup = new UntypedFormGroup({
    client: new FormControl('', {validators: [Validators.required]} ),
    date: new FormControl(new Date(), {
      validators: [Validators.required]
    }),
    time: new FormControl(null, {
      validators: [Validators.required]
    }), 
    deliverByPhone: new FormControl(false, {
      validators: [Validators.required]
    }),
    deliverByEmail: new FormControl(false, {
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
            firstName: client.firstName,
            lastName:
              client.lastName,
            email: client.email ?? '',
            phoneNumber: client.phone ?? ''
          })
        }
      })

      this.clients$ = this.clientService.$clientList.pipe(takeUntil(this.destroy$), map((list) => list.filter(c => c.optIn)))
  }

  onSubmit () {
    let date: Date = this.scheduleFormGroup.get('date')?.value;
    const [hrs, minutes] = this.scheduleFormGroup.get('time')?.value.split(':')
    let iso: string;
    // check
    if (!isNaN(Number(hrs)) && !isNaN(Number(minutes))) {
      date.setHours(Number(hrs), Number(minutes))
      iso = date.toISOString();
      
    } else {
      this.scheduleFormGroup.get('time')?.setErrors({
        hour: 'not a number',
        minutes: 'not a number'
      })
      return;
    }

    const schedule: INewSchedule = {
      deliveryMethods: [],
      date: iso,
      clientId: this.scheduleFormGroup.get('client')?.value
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

  onDestroy() {
    this.destroy$.next(true);
  }
}
