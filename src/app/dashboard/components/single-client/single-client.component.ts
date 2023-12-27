import { Component } from '@angular/core';
import {
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, catchError, filter, of, switchMap, tap } from 'rxjs';
import { ClientService, IClient } from '../../client.service';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-single-client',
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.css'],
})
export class SingleClientComponent {
  _editableSub!: Subscription;
  #clientId: string = '';
  faTrashCan = faTrashCan;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private activeRouting: ActivatedRoute
  ) {
    this.clientFormGroup.disable();
  }

  ngOnInit() {
    this._editableSub = this.isEditable.valueChanges.subscribe((v) => {
      this.toggleEdit(!!v);
    });

    this.activeRouting.params
      .pipe(
        switchMap(({ id }: { id?: string }) => {
          if (!id) {
            return of(undefined);
          }
          return this.clientService.getSingleClient(id);
        }),
        catchError((e) => {
          console.error(e);
          this._snackBar.open('failed to retreive customer', 'x');
          return of(undefined);
        }),
        filter((payload) => !!payload?.id),
        tap((payload?: { id?: string }) => {
          const id = payload?.id;
          if (!id) return;

          this.clientService.getSingleClient(id).then((client) => {
            if (client) {
              this.#clientId = client.id;
              this.clientFormGroup.patchValue({
                firstName: client.firstName,
                lastName: client.lastName,
                email: client.email ?? '',
                phoneNumber: client.phone ?? '',
                description: client.description,
                optIn: client.optIn,
                lastSeen: client.lastSeen
              });
            }
          });
        })
      )
      .subscribe();
  }
  clientFormGroup = new UntypedFormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      validators: [Validators.email],
    }),
    phoneNumber: new FormControl('', {
      validators: [Validators.pattern(/^\+[0-9]{1,2}[0-9]{10}$/)],
    }),
    optIn: new FormControl(false, { validators: [Validators.required]}),
    description: new FormControl(''),
    lastSeen: new FormControl(new Date(), { validators: [Validators.required]})
  });

  isEditable = new FormControl(false);

  async onSubmit() {
    const newClient: IClient = {
      id: this.#clientId,
      firstName: this.clientFormGroup.get('firstName')?.value,
      lastName: this.clientFormGroup.get('lastName')?.value,
      phone: this.clientFormGroup.get('phoneNumber')?.value,
      email: this.clientFormGroup.get('email')?.value,
      description: this.clientFormGroup.get('description')?.value,
      optIn: this.clientFormGroup.get('optIn')?.value,
      lastSeen: this.clientFormGroup.get('lastSeen')?.value.toISOString()
    };

    this.clientService
      .updateClient(newClient)
      .then(() => {
        this.clientFormGroup.disable();
        this.isEditable.setValue(false, {
          emitEvent: true,
        });
        this.openSnackBar('Client Updated', 'x');
      })
      .catch((e) => {
        console.error(e);
        this.openSnackBar(
          !this.#clientId
            ? 'Failed to create client'
            : 'Failed to update client',
          'x'
        );
      });
  }

  deleteClient() {
    this.clientService
      .deleteClient(this.#clientId)
      .then(() => {
        this._snackBar.open('Successfully Deleted Client', 'x');
        this.router.navigate(['/']);
      })
      .catch((e) => {
        console.error(e.message);
        this._snackBar.open('Failed to Delete Client', 'x');
      });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  toggleEdit(isEditable: boolean) {
    if (isEditable) {
      this.clientFormGroup.enable();
    } else {
      this.clientFormGroup.disable();
    }
  }

  ngOnDestroy() {
    if (this._editableSub) {
      this._editableSub.unsubscribe();
    }
  }
}
