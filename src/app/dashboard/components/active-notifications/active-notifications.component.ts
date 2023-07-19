import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { faEnvelope, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { INewSchedule, NotificationService } from '../../notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-active-notifications',
  templateUrl: './active-notifications.component.html',
  styleUrls: ['./active-notifications.component.css']
})
export class ActiveNotificationsComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Phone', 'Email', 'Date', 'Actions'];
  notificationList: INewSchedule[] = [];
  notificationFilteredList: INewSchedule[] = [];
  notificationResultLenght = 0;
  _notificationListSub!:Subscription;
  isLoading:boolean;
  faEnvelope = faEnvelope
  faTrashCan = faTrashCan
  constructor(
    private notificationService: NotificationService, 
    private _snackBar: MatSnackBar,
    ) {

    this.isLoading = true;

    this.notificationService.getNotifications().finally(() => {
      this.isLoading = false
    })
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
  
    this.paginator.page.subscribe((page) => {
      this.notificationFilteredList = this.notificationList.slice((page.pageIndex * 10 ), (page.pageIndex + 1 )*10)
    })

  }
  ngOnInit(): void {
    this._notificationListSub = this.notificationService.$notificationList.subscribe((n) => {
      
      this.notificationList = n    
      this.notificationResultLenght = this.notificationList.length
      this.notificationFilteredList = this.notificationList.slice((this.paginator?.pageIndex * 10 ), (this.paginator?.pageIndex + 1 )*10)
    })
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
  ngOnDestroy(): void {
 
    if (this._notificationListSub)this._notificationListSub.unsubscribe()
    
  }


}
