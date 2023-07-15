import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Auth } from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private router: Router){}
   canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree>{
    return Auth.currentAuthenticatedUser().then(user => {
      return true
    }).catch(() => {
        
        return this.router.parseUrl("/login")
    });
  }
  
}
