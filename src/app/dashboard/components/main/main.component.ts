import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { ClientService, IClient } from '../../client.service';
import { NotificationService } from '../../notification.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class DashBoardMainComponent {
  constructor(private clientService: ClientService, private notificationService: NotificationService) {
    // load clients
    this.clientService.getIClients();
    this.notificationService.getNotifications()
  }

}
