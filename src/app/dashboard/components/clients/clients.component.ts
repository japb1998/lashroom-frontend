import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DashboardService, IClient } from '../../dashboard.service';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription, filter, merge, of, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { faUsersLine } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Phone', 'Email', 'Schedule'];
   clientList: IClient[] = [];
  private _clientListSub!: Subscription;
  private _searchTermSub!: Subscription;
  filteredList : IClient[] = [];
  paginatedList: IClient[] = [];
  resultsLength = this.clientList.length;
  isLoading:boolean;
  faUsers = faUsersLine;
  searchTerm : FormControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
  
    this.paginator.page.subscribe((page) => {
      this.paginatedList = this.filteredList.slice((page.pageIndex * 10 ), (page.pageIndex + 1 )*10)
    })
    
  }

  constructor(private dashboardService: DashboardService) {
    this.isLoading = true;
    console.log(this.isLoading, new Date());
    this.dashboardService.getIClients().finally(() =>{ this.isLoading = false;
      console.log(this.isLoading, new Date());
    });
   }

  ngOnInit(): void {

    this._clientListSub = this.dashboardService.$clientList.subscribe((c) => {
      
      this.clientList = c.sort((a, b)=> a.clientName.trim() < b.clientName.trim() ? -1 : 1)
      this.filteredList = this.clientList;
      this.resultsLength = this.clientList.length
      this.paginatedList = this.clientList.slice(((this.paginator?.pageIndex ?? 0) * 10 ), ((this.paginator?.pageIndex ?? 0) + 1 )*10);
    });

    this._searchTermSub = this.searchTerm.valueChanges.subscribe(term => {
      this.paginator.firstPage();
      this.filteredList = this.clientList.filter(c => term ? c.clientName.toUpperCase().trim().startsWith(term.toUpperCase()) : this.clientList).sort((a, b)=> a.clientName.trim() < b.clientName.trim() ? -1 : 1)
      this.resultsLength = this.filteredList.length
      this.paginatedList = this.filteredList.slice(((this.paginator?.pageIndex ?? 0) * 10 ), ((this.paginator?.pageIndex ?? 0) + 1 )*10)
    })
  }

  ngOnDestroy() {
    if (this._clientListSub) {
      this._clientListSub.unsubscribe();
    }

    if (this._searchTermSub) {
      this._searchTermSub.unsubscribe();
    }
  }

}
