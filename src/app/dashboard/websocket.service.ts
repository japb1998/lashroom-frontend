import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from 'aws-amplify';
import { concatMap, from, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
  interval!: NodeJS.Timeout;
  ws?: WebSocket;
  retries = {
    n: 0,// number of retries,
    lastRetry: new Date(),
  };

  constructor(private notificationService: NotificationService, private _snackbar: MatSnackBar) {}
  listenToSocket() {
    Auth.currentSession().then((c) => {
      this.ws = new WebSocket(
        `${environment.wsUrl}?Auth=${c.getIdToken().getJwtToken()}`
      );
      this.ws.onopen = () => {
        console.log('ws connection successfully open.')
        this.retries.lastRetry = new Date();
        this.retries.n = 0;

        // start ping messages.
        this.interval = setInterval(() => {
          this.ws?.send(
            JSON.stringify({
              action: 'health',
            })
          );
        }, 60000);


        // error
        if (this.ws) {
        this.ws.onerror = (e) => {
            console.debug(e);
            if (new Date().getTime() - this.retries.lastRetry.getTime() < 60 * 1000 * 5 && this.retries.n > 2) {
                console.log(console.debug('connection permanently closed'));
                this.ws = undefined;
                return;
            };
            this.retries.lastRetry = new Date();
            this.retries.n++;
            this.listenToSocket();
          }
        this.ws.onmessage =  (msg) => {
            const data: {
              action: string;
            } & { [key: string]: string } = JSON.parse(msg.data);
    
            switch(data.action) {
                case 'updateNotification':
                console.log('refreshing notification due to update');
                // trigger the observable once.
                this.notificationService.getNotifications(0, 0 , true).then(sub => sub.pipe(take(1), tap(() => {
                    this._snackbar.open('Notifications have been updated.', 'close', {
                        horizontalPosition: 'right',
                        verticalPosition: "top",
                        duration: 5 * 1000 // 5 seconds
                    })
                })).subscribe());
                break;
                case 'newNotification':
                    this._snackbar.open('New notification was added.', 'refresh', {
                        horizontalPosition: 'right',
                        verticalPosition: "top",
                        duration: 5 * 1000 // 5 seconds,
                    }).afterDismissed()
                    .pipe(concatMap(() => from(this.notificationService.getNotifications(0, 0 , true))),concatMap(s => s), take(1), tap(() => {
                        console.log('successfully got new notifications')
                    }))
                    .subscribe()
                break
                case 'health-response':
                    console.debug('ws connection is healthy')
                    break;
                default:
                    console.log(`unknown action data=${data}`)
            }
          };
        }

      };

      this.ws.onclose = (e) => {
        this.ws = undefined;
        clearInterval(this.interval);
        console.log(`ws connection closed. event=${JSON.stringify(e)}`);

        if ((new Date().getTime() - this.retries.lastRetry.getTime() < 60 * 1000 * 5) && this.retries.n > 2) {
            console.log('connection permanently closed');
            this.ws = undefined;
            return;
        };
        this.retries.lastRetry = new Date();
        this.retries.n++;
        this.listenToSocket();
      };

    });
  }
  ngOnDestroy() {
    console.debug('closing socket...');
    this.ws?.close();
  }
}
