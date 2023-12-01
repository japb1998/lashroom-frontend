import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Auth } from 'aws-amplify'
import {
  BehaviorSubject,
  Observable,
  catchError,
  lastValueFrom,
  of
} from 'rxjs'
import { environment } from 'src/environments/environment'
import { IClient } from './client.service'
export interface INewSchedule {
  id?: string
  deliveryMethods: number[]
  clientId: string
  date?: string
}

export interface ISchedule {
  id: string,
  client: IClient,
  deliveryMethods: number[],
  clientId: string,
  date?: string,
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  tokenId?: string

  #notificationList: BehaviorSubject<INewSchedule[]> = new BehaviorSubject(
    [] as INewSchedule[]
  )

  readonly $notificationList: Observable<INewSchedule[]> =
    this.#notificationList.asObservable()

  constructor (private http: HttpClient) {}

  set notificationList (notifications: INewSchedule[]) {
    this.#notificationList.next(notifications)
  }

  get notificationList (): INewSchedule[] {
    return this.#notificationList.getValue()
  }

  async getTokenId () {
    return await Auth.currentSession()
      .then(u => {
        this.tokenId = u.getIdToken().getJwtToken()
        return this.tokenId
      })
      .catch(() => {
        this.tokenId = undefined
        return this.tokenId
      })
  }

  async createNewSchedule (newSchedule: INewSchedule): Promise<void> {
    const token = this.tokenId ?? (await this.getTokenId())

    if (!token) {
      window.location.href = '/login'
    }

    try {
      await lastValueFrom(
        this.http.post(`${environment.apiUrl}/schedule`, newSchedule, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      )
    } catch {
      throw new Error('Failed To Create Schedule')
    }
  }

  async getNotifications () {
    const token = this.tokenId ?? (await this.getTokenId())

    if (!token) {
      window.location.href = '/login'
    }
    new Promise(resolve => {
      this.http
        .get<INewSchedule[]>(`${environment.apiUrl}/schedule`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .pipe(
          catchError(e => {
            if (e?.status && e.status == 401) {
              window.location.reload()
            }
            console.error(e)
            return of([])
          })
        )
        .subscribe((schedules: INewSchedule[]) => {
          console.log(schedules);
          schedules = schedules?.sort((a, b) =>
            a.date && b.date
              ? new Date(a.date).getDate() < new Date(b.date).getDate()
                ? -1
                : 1
              : 0
          )
          this.notificationList = schedules.map(s => {
            const date = s.date ? new Date(s.date).toLocaleDateString() : ''
            return {
              ...s,
              date: date.split('GMT')[0]
            }
          })

          resolve(this.notificationList)
        })
    })
  }

  async getNotificationById (id: string) {
    const token = this.tokenId ?? (await this.getTokenId())

    if (!token) {
      window.location.href = '/login'
    }
    new Promise(resolve => {
      this.http
        .get<ISchedule>(`${environment.apiUrl}/schedule/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .pipe(
          catchError(e => {
            if (e?.status && e.status == 401) {
              window.location.reload()
            }
            console.error(e)
            return of(undefined)
          })
        )
        .subscribe((notification?: ISchedule) => {
          resolve(notification)
        })
    })
  }

  async removeNotification(id: string) {
    const token = this.tokenId ?? (await this.getTokenId())

    if (!token) {
      window.location.href = '/login'
    }

    new Promise(resolve => {
      this.http
        .delete<void>(`${environment.apiUrl}/schedule/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .pipe(
          catchError(e => {
            if (e?.status && e.status == 401) {
              window.location.reload()
            }
            console.error(e)
            return of(undefined)
          })
        )
        .subscribe((_void) => {

          if (_void !== undefined) {
            this.notificationList = this.notificationList.filter(n => n.id !== id)
          }
            resolve(1)
        })
    })
  }
}
