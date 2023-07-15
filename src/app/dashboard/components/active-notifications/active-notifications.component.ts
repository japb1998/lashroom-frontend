import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { INewSchedule, NotificationService } from '../../notification.service';

@Component({
  selector: 'app-active-notifications',
  templateUrl: './active-notifications.component.html',
  styleUrls: ['./active-notifications.component.css']
})
export class ActiveNotificationsComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Phone', 'Email', 'Date'];
  notificationList: INewSchedule[] = [];
  notificationFilteredList: INewSchedule[] = [];
  notificationResultLenght = 0;
  _notificationListSub!:Subscription;
  isLoading:boolean;
  faEnvelope = faEnvelope
  constructor(private notificationService: NotificationService) {

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

  ngOnDestroy(): void {

    if (this._notificationListSub)this._notificationListSub.unsubscribe()
    
  }


}
