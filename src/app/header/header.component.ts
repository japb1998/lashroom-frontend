import { Component, OnInit } from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket, faHome, faPerson } from '@fortawesome/free-solid-svg-icons';
import { Auth } from 'aws-amplify';
import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faClock = faClock
  faPerson = faPerson
  faArrow = faArrowRightFromBracket
  faHome = faHome
  faEnvelope = faEnvelopeOpenText
  constructor() { }

  ngOnInit(): void {
  }

  logout() {
    Auth.signOut();
  }
}
