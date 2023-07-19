import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'lashroomFrontend';

  ngOnInit(): void {
    if (environment?.log === 'debug') {
      Auth.currentSession().then((c) => {

        console.log(c.getIdToken().getJwtToken())
      })
    }
  }
  

}
