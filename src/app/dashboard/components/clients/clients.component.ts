import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardService, IClient } from '../../dashboard.service';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Phone', 'Email', 'Schedule'];
   clientList: IClient[] = [];
  _clientListSub!: Subscription;
  filteredList: IClient[] = [];
  resultsLength = this.clientList.length;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
  
    this.paginator.page.subscribe((page) => {
      this.filteredList = this.clientList.slice((page.pageIndex * 10 ), (page.pageIndex + 1 )*10)
    })

  }

  constructor(private dashboardService: DashboardService) {
    this.dashboardService.getIClients();
   }

  ngOnInit(): void {
    this._clientListSub = this.dashboardService.$clientList.subscribe((c) => {
      
      this.clientList = c    
      this.resultsLength = this.clientList.length
      this.filteredList = this.clientList.slice(((this.paginator?.pageIndex ?? 0) * 10 ), ((this.paginator?.pageIndex ?? 0) + 1 )*10)
    })
  }

  ngOnDestroy() {
    if (this._clientListSub) {
      this._clientListSub.unsubscribe();
    }
  }

}
