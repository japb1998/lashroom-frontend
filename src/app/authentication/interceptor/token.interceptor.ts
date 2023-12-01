
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { concatMap, from, map, of, switchMap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler){
    // Get the auth token from the service.
    const authToken = this.getTokenId();

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    return from(this.getTokenId()).pipe(switchMap((t) => {
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${t}`)
          });
      
          // send cloned request with header to the next handler.
          return next.handle(authReq);
    }))
  }
  async getTokenId (): Promise<string> {
    return await Auth.currentSession()
      .then(u => {
        return u.getIdToken().getJwtToken()
      })
  }
}