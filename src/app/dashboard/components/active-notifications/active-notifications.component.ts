import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, map, Observable, of, pipe, Subject, Subscription, take, takeUntil, tap } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { faEnvelope, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { ENotificationStatus, INewSchedule, ISchedule, NotificationService } from '../../notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-active-notifications',
  templateUrl: './active-notifications.component.html',
  styleUrls: ['./active-notifications.component.css']
})
export class ActiveNotificationsComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Phone', 'Email', 'Date', 'Actions', 'Status'];
  isLoading!:boolean;
  destroy$: Subject<boolean>  = new Subject();
  faEnvelope = faEnvelope;
  faTrashCan = faTrashCan;
  notificationList$: Observable<ISchedule[]> = of([])
  notificationListLenght$!:  Observable<number>;

  constructor(
    private notificationService: NotificationService, 
    private _snackBar: MatSnackBar,
    ) {
      this.notificationList$ = this.notificationService.$paginatedNotifications.pipe(map(n => n.data))
      this.notificationListLenght$ = this.notificationService.$paginatedNotifications.pipe(map(n => n.total))
    }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
  
    this.paginator.page.pipe(takeUntil(this.destroy$)).subscribe((page) => {
      // fetch the current page / size notifications
      this.isLoading = true;
      this.notificationService.getNotifications(page.pageIndex, page.pageSize).then(sub => sub.pipe(tap(() => this.isLoading = false), take(1)).subscribe());
    })

  }
  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    (await this.notificationService.getNotifications()).pipe(tap(() => {
      console.log(this.isLoading)
      this.isLoading = false}), takeUntil(this.destroy$)).subscribe();
  }

  deleteNotification(id: string) {
    this.notificationService.removeNotification(id).catch(e => {
      console.error(e.message);

      this._snackBar.open('Failed to delete notification', 'x')
    }).then(
      () => {
        this._snackBar.open('Successfully deleted notification', 'x')
      }
    )
  }
  protected statusColor(status: ENotificationStatus) {
      switch(status) {
          case ENotificationStatus.NOT_SENT: {
            return false
          }
          case ENotificationStatus.SENT: {
              return true
          }
      }
  }
  ngOnDestroy(): void {
 
    this.destroy$.next(true);
    
  }


}
