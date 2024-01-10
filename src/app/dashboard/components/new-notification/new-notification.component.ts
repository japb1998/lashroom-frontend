import { Component, OnInit } from '@angular/core'
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { SnackBarComponent } from '../../../snack-bar/snack-bar.component'
import { BehaviorSubject, concatMap, filter, from, map, Observable, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs'
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
  selectedUser!: IClient;
  dateSelection = new FormControl("date")
  constructor (
    private notificationService: NotificationService,
    private clientService: ClientService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private activeRouting: ActivatedRoute
  ) {
    this.clients$ = this.clientService.$paginatedClients.pipe(takeUntil(this.destroy$), map((list) => list.data.filter(c => c.optIn)))
  }

  scheduleFormGroup = new UntypedFormGroup({
    client: new FormControl('', {validators: [Validators.required]} ),
    date: new FormControl(new Date(), {
      validators: [Validators.required]
    }),
    weeks:  new FormControl(1, {
      validators: [Validators.required, Validators.min(1)]
    }),
    time: new FormControl(this.getDefaultTime(), {
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
    //  check for notification for a specific id
    this.activeRouting.params
      .pipe(
        map(({ id }) => {
          if (id) {
            return id
          } else {
            return undefined
          }
        }),
        filter((id) => !!id),
        takeUntil(this.destroy$)
      )
      .subscribe(async (id) => {
          try {

            await this.clientService.getSingleClient(id); //client exist

            this.scheduleFormGroup.patchValue({
              client: id
            })
          } catch(e ) {
            console.error(`could not get client ID=${id}`)
          }
      })

      this.scheduleFormGroup.get('client')?.valueChanges.pipe(filter((v)=> !!v), concatMap(id => from(this.clientService.getSingleClient(id))), tap((usr) => this.selectedUser = usr), tap(() => {
        if (!this.selectedUser.phone) {
          this.scheduleFormGroup.get('deliverByPhone')?.disable()
        }
        if (!this.selectedUser.email) {
          this.scheduleFormGroup.get('deliverByEmail')?.disable()
        }
      })).subscribe();
  }

  onSubmit () {
    
    let date: Date;
    
    switch(this.dateSelection.value) {
      case 'date':
        date = this.scheduleFormGroup.get('date')?.value;
        break;
      case 'weeks':
        const weeks = Number(this.scheduleFormGroup.get('weeks')?.value)

        if (!isNaN(weeks) && weeks > 0) {
          date = new Date(new Date().getTime() + weeks * 7 * 24 * 60 * 60 * 1000)
        } else {
          console.error(`invalid weeks number ${this.scheduleFormGroup.get('date')?.value}`)
          return;
        }
        break;
      default:
        console.error(`invalid date type ${this.scheduleFormGroup.get('date')?.value}`)
        return;
        
    } 
    
    const [hrs, minutes] = this.scheduleFormGroup.get('time')?.value.split(':')
    let iso: string;
    // check
    if (!isNaN(Number(hrs)) && !isNaN(Number(minutes))) {
      date.setHours(Number(hrs), Number(minutes))

      if (date.getTime() <= Date.now()) {
        this.scheduleFormGroup.get('time')?.setErrors({
          date: `Schedule date must be in the future.`,
        })
        return
      }
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

  getDefaultTime() {
    // date + 1 minute
    const d =  new Date(new Date().getTime() + 1000 * 60)
    
    if (d.getHours() < 12) {
      return `0${d.getHours()}:${d.getMinutes()}`
    }  
    return  `${d.getHours()}:${d.getMinutes()}`
  }
  onDestroy() {
    this.destroy$.next(true);
  }
}
