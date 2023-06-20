import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  googleSignIn() {
    Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google })
  }
}
