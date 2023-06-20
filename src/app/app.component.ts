import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'lashroomFrontend';

  ngOnInit(): void {
    Auth.currentSession().then((u) => {
      console.log(u.getIdToken().getJwtToken())
    })
  }
  

}
