import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { Subscription, filter, merge, of, tap, Observable, map, BehaviorSubject, Subject, takeUntil, take, switchMap, concat, concatMap, debounce, interval } from 'rxjs'
import { FormControl } from '@angular/forms'
import { faUsersLine, faX } from '@fortawesome/free-solid-svg-icons'
import { faClock, faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { ClientService, IClient } from '../../client.service'
import { toDaysCount } from 'src/app/utils'

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Phone', 'Email', 'LastSeen','Schedule']
  faClock = faClock
  faPen = faPenToSquare
  faX = faX
  private _searchTermSub!: Subscription
  isLoading: boolean = false;
  faUsers = faUsersLine
  searchTerm: FormControl = new FormControl('');
  isMobile = false;
  clientList$!: Observable<IClient[]>;
  clientListLength$!: Observable<number>;
  destroy$ = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator!: MatPaginator

  ngAfterViewInit () {
    this.paginator.page.pipe(filter(p => !!p), concatMap(p => {
      this.isLoading = true;
      return this.clientService.getIClients(p.pageIndex, p.pageSize).pipe(take(1),tap(() => this.isLoading = false))
    })).subscribe()
  }

  constructor (private clientService: ClientService) {
    this.clientList$ = this.clientService.$paginatedClients.pipe(map(p => p.data), takeUntil(this.destroy$));
    this.clientListLength$ = this.clientService.$paginatedClients.pipe(map(l => l.total), takeUntil(this.destroy$))
  }

  ngOnInit () {
    this.isLoading = true;
    this.clientService.getIClients().pipe(take(1),tap(() => this.isLoading = false)).subscribe()
    this._searchTermSub = this.searchTerm.valueChanges.pipe(tap(() => this.paginator.firstPage()), switchMap((term) => this.clientService.getIClients(0, 10, {
      firstName: term,
      lastName: term,
    })), debounce(i => interval(500))).subscribe(term => {
    });

    if (window.screen.width <= 450) {
      this.isMobile = true;
    }
  }
  getDisplayedColumns() {
    return this.isMobile ? ['Name', 'Schedule'] :  this.displayedColumns;
  }

  toDaysCount(date: string): string {
    return toDaysCount(date)
  }

  ngOnDestroy () {
    this.destroy$.next(true)
    if (this._searchTermSub) {
      this._searchTermSub.unsubscribe()
    }
  }
}
