import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IClient, DashboardService, INewSchedule } from '../../dashboard.service';
import { Observable, Subscription, of } from 'rxjs';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class DashBoardMainComponent implements OnInit, OnDestroy {




  constructor() {
  }

  ngOnInit(): void {
      
     

  }

  ngOnDestroy(): void {

    
  }
}
