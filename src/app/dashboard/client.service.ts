import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import {
  BehaviorSubject,
  Observable,
  catchError,
  lastValueFrom,
  of,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IClient {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  id: string;
  description?: string;
  createdAt?: string;
  lastUpdatedAt?: string;
  lastSeen?:string;
  optIn: boolean;
}

export interface IPaginated<T> {
  data: T[];
  limit: number;
  page: number;
  total: number;
}

export interface INewClient extends Partial<IClient> {}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  tokenId?: string;
  #paginatedClients: BehaviorSubject<IPaginated<IClient>> = new BehaviorSubject(
    {} as IPaginated<IClient>
  );

  readonly $paginatedClients: Observable<IPaginated<IClient>> =
    this.#paginatedClients.asObservable();

  constructor(private http: HttpClient) {}

  set paginatedClients(clients: IPaginated<IClient>) {
    this.#paginatedClients.next(clients);
  }

  get paginatedClients(): IPaginated<IClient> {
    return this.#paginatedClients.getValue();
  }

   getIClients(page = 0, limit = 10, ops: Partial<IClient> = {}) {

    return this.http
      .get<IPaginated<IClient>>(`${environment.apiUrl}/clients`, {
        params: { limit, page, ...ops},
      })
      .pipe(
        catchError((e) => {
          console.error(e);
          return of({
            total: 0,
            data: [],
            page,
            limit,
          });
        }),
        tap((paginated) => {
          paginated.data = paginated.data.map(d => ({...d, lastSeen: d.lastSeen ? new Date(d.lastSeen).toLocaleString(): undefined }))
          this.paginatedClients = paginated;
        })
      );
  }

  async createClient(client: INewClient) {
    const token = this.tokenId ?? (await this.getTokenId());

    if (!token) {
      throw new Error('User is not authenticated');
    }

    try {
      await lastValueFrom(
        this.http.post(`${environment.apiUrl}/clients`, client, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    } catch {
      throw new Error('Failed To Create Client');
    }
  }

  async getSingleClient(id: string) {
    const token = this.tokenId ?? (await this.getTokenId());

    if (!token) {
      throw new Error('User is not authenticated');
    }

    try {
      return await lastValueFrom(
        this.http.get<IClient>(`${environment.apiUrl}/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    } catch {
      throw new Error('Failed To Get Client');
    }
  }
  async deleteClient(id: string) {
    const token = this.tokenId ?? (await this.getTokenId());

    if (!token) {
      throw new Error('User is not authenticated');
    }

    try {
      await lastValueFrom(
        this.http.delete<void>(`${environment.apiUrl}/clients/${id}`)
      );
      await lastValueFrom( await this.getIClients())
    } catch {
      throw new Error('Failed To Delete Client');
    }
  }
  async updateClient(client: IClient) {
    const token = this.tokenId ?? (await this.getTokenId());

    if (!token) {
      throw new Error('User is not authenticated');
    }

    try {
      await lastValueFrom(
        this.http.patch(`${environment.apiUrl}/clients/${client.id}`, client, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    } catch {
      throw new Error('Failed To Update Client');
    }
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
}
