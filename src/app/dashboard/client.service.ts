import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Auth } from 'aws-amplify'
import {
  BehaviorSubject,
  Observable,
  catchError,
  lastValueFrom,
  of
} from 'rxjs'
import { environment } from 'src/environments/environment'

export interface IClient {
  clientName: string
  phone: string
  email: string
  id: string
  description?: string
}

export interface INewClient extends Partial<IClient> {}

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  tokenId?: string
  #clientList: BehaviorSubject<IClient[]> = new BehaviorSubject([] as IClient[]) // x -> y // d.sub -> y

  readonly $clientList: Observable<IClient[]> = this.#clientList.asObservable()


  constructor (private http: HttpClient) {}

  set clientList (clients: IClient[]) {
    this.#clientList.next(clients)
  }

  get clientList (): IClient[] {
    return this.#clientList.getValue()
  }



 

  async getIClients () {
    const token = this.tokenId ?? (await this.getTokenId())

    if (!token) {
      throw new Error('User is not authenticated')
    }
    new Promise(resolve => {
      this.http
        .get<{
          count: number
          records: IClient[]
        }>(`${environment.apiUrl}/clients`, {
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
            return of({
              count: 0,
              records: []
            })
          })
        )
        .subscribe(({ records: clients }) => {
          this.clientList = clients
          resolve(this.clientList)
        })
    })
  }

  

  async createClient(client: INewClient) {
    const token = this.tokenId ?? (await this.getTokenId())

    if (!token) {
      throw new Error('User is not authenticated')
    }

    try {
      await lastValueFrom(
        this.http.post(`${environment.apiUrl}/clients`, client, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      );
    } catch {
      throw new Error('Failed To Create Client')
    }
  }

  // add once implemented
  // async getSingleClient(client: INewClient) {
  //   const token = this.tokenId ?? (await this.getTokenId())

  //   if (!token) {
  //     throw new Error('User is not authenticated')
  //   }

  //   try {
  //     await lastValueFrom(
  //       this.http.get(`${environment.apiUrl}/clients/${}`, client, {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       })
  //     );
  //   } catch {
  //     throw new Error('Failed To Create Client')
  //   }
  // }

  async updateClient(client: IClient) {
    const token = this.tokenId ?? (await this.getTokenId())

    if (!token) {
      throw new Error('User is not authenticated');

    }

    try {
      await lastValueFrom(
        this.http.patch(`${environment.apiUrl}/clients/${client.id}`, client, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      );
    } catch {
      throw new Error('Failed To Update Client')
    }
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
}
