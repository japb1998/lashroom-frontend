import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { WebSocketService } from './dashboard/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'lashroomFrontend';

  constructor(private wsService: WebSocketService) {}
  ngOnInit(): void {
    this.wsService.listenToSocket();
  }
}
