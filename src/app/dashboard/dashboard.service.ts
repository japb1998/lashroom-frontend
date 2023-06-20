import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Auth } from 'aws-amplify'
import { lastValueFrom } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  tokenId?: string
  constructor (private http: HttpClient) {}

  async getNotifications () {
    const token = this.tokenId ?? (await this.getTokenId())

    if (!token) {
      throw new Error('User is not authenticated')
    }

    return lastValueFrom(
      this.http.get(`${environment.apiUrl}/schedule`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    )
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
