import { Component } from '@angular/core'
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subscription, catchError, map, of, switchMap } from 'rxjs'
import { ClientService, IClient } from '../../client.service'

@Component({
  selector: 'app-single-client',
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.css']
})
export class SingleClientComponent {
  _editableSub!: Subscription
  #clientId: string = ''

  constructor (
    private clientService: ClientService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private activeRouting: ActivatedRoute
  ) {
    this.clientFormGroup.disable()
  }

  ngOnInit () {
    this._editableSub = this.isEditable.valueChanges.subscribe(v => {
      this.toggleEdit(v)
    })

    this.activeRouting.params
      .pipe(
        switchMap(({ id }: { id?: string }) => {
          return this.clientService.$clientList.pipe(
            map(clientList => {
              const result = clientList.filter(c => c.id === id)

              return result.length ? result[0] : undefined
            })
          )
        }),
        catchError(e => {
          console.error(e)
          this._snackBar.open('failed to retreive customer', 'x')
          return of(undefined)
        })
      )
      .subscribe(client => {
        if (client) {
          this.#clientId = client.id
          this.clientFormGroup.patchValue({
            firstName:
              client.clientName?.split(' ')?.length > 1
                ? client.clientName?.split(' ')[0]
                : '',
            lastName:
              client.clientName?.split(' ')?.length > 1
                ? client.clientName.split(' ')[1]
                : '',
            email: client.email ?? '',
            phoneNumber: client.phone ?? '',
            description: client.description
          })
        }
      })
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
  })

  isEditable = new UntypedFormControl(false)

  async onSubmit () {
    const newClient: IClient = {
      id: this.#clientId,
      clientName: `${this.clientFormGroup.get('firstName')?.value} ${
        this.clientFormGroup.get('lastName')?.value
      }`,
      phone: this.clientFormGroup.get('phoneNumber')?.value,
      email: this.clientFormGroup.get('email')?.value,
      description: this.clientFormGroup.get('description')?.value
    }

    this.clientService
      .updateClient(newClient)
      .then(() => {
        this.clientFormGroup.disable()
        this.isEditable.setValue(false, {
          emitEvent: true
        })
        this.openSnackBar('Client Updated', 'x')
      })
      .catch(e => {
        console.error(e)
        this.openSnackBar('Failed to create Client', 'x')
      })
  }

  openSnackBar (message: string, action: string) {
    this._snackBar.open(message, action)
  }

  toggleEdit (isEditable: boolean) {
    if (isEditable) {
      this.clientFormGroup.enable()
      this.clientFormGroup.get('email')?.disable()
    } else {
      this.clientFormGroup.disable()
    }
  }

  ngOnDestroy () {
    if (this._editableSub) {
      this._editableSub.unsubscribe()
    }
  }
}
