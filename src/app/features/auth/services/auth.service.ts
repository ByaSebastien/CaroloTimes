import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RegisterFormModel } from '../models/register.form.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginFormModel } from '../models/login.form.model';
import { TokenModel } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _currentUser$: BehaviorSubject<TokenModel|undefined>;

  constructor(
    private readonly _http: HttpClient
  ) {
    let json = localStorage.getItem('currentUser');
    this._currentUser$ = new BehaviorSubject<TokenModel|undefined>(!json ? undefined : JSON.parse(json));
  }

  get currentUser(){
    return this._currentUser$.value;
  }

  get currentUser$(){
    return this._currentUser$.asObservable();
  }

  register(r: RegisterFormModel): Observable<any>{
    console.log(environment.ApiUrl);
    
    return this._http.post<any>(environment.ApiUrl + '/register',r);
  }

  login(l: LoginFormModel): Observable<TokenModel>{
    return this._http.post<TokenModel>(environment.ApiUrl + '/login',l).pipe(
      tap( 
        (datas: TokenModel) => {
          this._currentUser$.next(datas);
          localStorage.setItem("currentUser",JSON.stringify(this.currentUser));
      })
    );
  }

  logout(){
    this._currentUser$.next(undefined);
    localStorage.removeItem('currentUser');
  }
}
