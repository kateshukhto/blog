import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable()
export class AuthService {

  public error$: Subject<string> = new Subject<string>()
  constructor(private http: HttpClient) {}

  get token(): string | null {
    const expDateStr = localStorage.getItem('fb-token-exp');
    const expDate = expDateStr ? new Date(expDateStr) : null;
    if(!expDate) {
      this.logout()
      return null
    }
    if(new Date() > expDate) {
      this.logout()
      return null
    } else {
      return localStorage.getItem('fb-token')
    }
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    const {message} =  error.error.error

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email')
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль')
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Такой email не найден')
        break;
    }

    return throwError(error)
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(response => {
          const fbResponse: FbAuthResponse = <FbAuthResponse>response;
          this.setToken(fbResponse);
        }),
        catchError((err: HttpErrorResponse) => this.handleError(err))
      )
  }

  logout() {
    this.setToken(null)
  }
  isAuthenticated(): boolean {
    return !!this.token
  }

  private setToken(response: FbAuthResponse | null) {
    if(response) {
      const expDate =  new Date(new  Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }
  }
}
