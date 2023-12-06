import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from 'aws-amplify';
import {
  BehaviorSubject,
  Observable,
  catchError,
  lastValueFrom,
  of,
  map,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { IClient } from './client.service';

export enum ENotificationStatus {
  SENT = 'SENT',
  NOT_SENT = 'NOT_SENT'
}
export interface INewSchedule {
  id?: string;
  deliveryMethods: number[];
  clientId: string;
  date?: string;
}

export interface ISchedule {
  id: string;
  client: IClient;
  deliveryMethods: number[];
  clientId: string;
  date?: string;
  status: ENotificationStatus
}

export interface IPaginatedNotifications {
  limit: number;
  page: number;
  total: number;
  data: ISchedule[];
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  tokenId?: string;

  #paginatedNotifications: BehaviorSubject<IPaginatedNotifications> = new BehaviorSubject(
    {} as IPaginatedNotifications
  );
  
  readonly $paginatedNotifications: Observable<IPaginatedNotifications> =
    this.#paginatedNotifications.asObservable();

  constructor(private http: HttpClient) {}

  set paginatedNotifications(notifications: IPaginatedNotifications) {
    this.#paginatedNotifications.next(notifications);
  }

  get paginatedNotifications(): IPaginatedNotifications {
    return this.#paginatedNotifications.getValue();
  }

  async getTokenId() {
    return await Auth.currentSession()
      .then((u) => {
        this.tokenId = u.getIdToken().getJwtToken();
        return this.tokenId;
      })
      .catch(() => {
        this.tokenId = undefined;
        return this.tokenId;
      });
  }

  async createNewSchedule(newSchedule: INewSchedule): Promise<void> {
    const token = this.tokenId ?? (await this.getTokenId());

    if (!token) {
      window.location.href = '/login';
    }

    try {
      await lastValueFrom(
        this.http.post(`${environment.apiUrl}/schedule`, newSchedule, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    } catch {
      throw new Error('Failed To Create Schedule');
    }
  }

  async getNotifications(page = 0, limit = 10) {
    const token = this.tokenId ?? (await this.getTokenId());

    if (!token) {
      window.location.href = '/login';
    }

    return this.http
      .get<IPaginatedNotifications>(`${environment.apiUrl}/schedule`, {
        params: {
          page,
          limit,
        },
      })
      .pipe(
        catchError((e) => {
          if (e?.status && e.status == 401) {
            window.location.href = 'login';
          }
          console.error(e);
          return of({} as IPaginatedNotifications);
        }),
        map((paginatedN: IPaginatedNotifications) => {
          let schedules = paginatedN.data;
          schedules = schedules?.sort((a, b) =>
            a.date && b.date
              ? new Date(a.date).getDate() < new Date(b.date).getDate()
                ? -1
                : 1
              : 0
          );
          return paginatedN;
        }),
        map((paginatedN: IPaginatedNotifications) => {
          paginatedN.data = paginatedN.data.map((s) => {
            const date = s.date ? new Date(s.date).toLocaleDateString() : '';
            return {
              ...s,
              date: date.split('GMT')[0],
            };
          });
          this.paginatedNotifications = paginatedN
        })
      );
  }

  async getNotificationById(id: string) {
    const token = this.tokenId ?? (await this.getTokenId());

    if (!token) {
      window.location.href = '/login';
    }
    new Promise((resolve) => {
      this.http
        .get<ISchedule>(`${environment.apiUrl}/schedule/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((e) => {
            if (e?.status && e.status == 401) {
              window.location.href = '/login';
            }
            console.error(e);
            return of(undefined);
          })
        )
        .subscribe((notification?: ISchedule) => {
          resolve(notification);
        });
    });
  }

  async removeNotification(id: string) {
    const token = this.tokenId ?? (await this.getTokenId());

    if (!token) {
      window.location.href = '/login';
    }

    new Promise((resolve) => {
      this.http
        .delete<void>(`${environment.apiUrl}/schedule/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((e) => {
            if (e?.status && e.status == 401) {
              window.location.reload();
            }
            console.error(e);
            return of(undefined);
          })
        )
        .subscribe((_void) => {
          if (_void !== undefined) {
            this.getNotifications(this.paginatedNotifications.page, this.paginatedNotifications.limit).then(s => s.subscribe());
          }
          resolve(1);
        });
    });
  }
}
