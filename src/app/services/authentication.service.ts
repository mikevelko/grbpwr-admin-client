import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

// models 
import { Convert, Token } from "../models/token";


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentSessionSubject: BehaviorSubject<Token>;
    public currentSession: Observable<Token>;

    constructor(private http: HttpClient) {
        let token =this.getTokenWithExpiry()
        if (token != null) {
            this.currentSessionSubject = new BehaviorSubject<Token>(Convert.toToken(Convert.tokenToJson(token)));
        }
        let empty: Token = {accessToken:"", refreshToken:""};
        this.currentSessionSubject = new BehaviorSubject<Token>(empty);
        this.currentSession = this.currentSessionSubject.asObservable();

    }

    public  getTokenHeader() :string {
        let t = this.getTokenWithExpiry()
        let tokenHeader = "Bearer " + t.accessToken 
        return tokenHeader
     }


    public get currentSessionValue(): Token {
        return this.currentSessionSubject.value;
    }

    login(password: string) {
        return this.http.post<Token>(`${environment.API_SERVER_URL}auth`, { password })
            .pipe(map(token => {
                // store token details and jwt token in local storage to keep token logged in between page refreshes
                this.setTokenWithTTL(token,60)
                // localStorage.setItem('currentSession', Convert.tokenToJson(token));
                this.currentSessionSubject.next(token);
                return token;
            }));
    }

    loginWPassword( password: string ) {
        return this.http.post<any>(`${environment.API_SERVER_URL}auth`, { password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentSession', Convert.tokenToJson(user));
                this.currentSessionSubject.next(user);
                return user;
            }));
    }

    loginWRefresh( refreshToken: string ) {
        return this.http.post<any>(`${environment.API_SERVER_URL}auth`, { refreshToken })
            .pipe(map(user => {
                localStorage.setItem('currentSession', JSON.stringify(user));
                this.currentSessionSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentSession');
        this.currentSessionSubject.next(null);
    }

    setTokenWithTTL(token: Token, min:number) {
        const item = {
            value:  token,
            expiry: this.addMinutes(min)
        }
        localStorage.setItem("currentSession",JSON.stringify(item))
    }

    getTokenWithExpiry() :Token {
        const tokenStr = localStorage.getItem("currentSession")
    
        if (!tokenStr) {
            return null
        }

        const item = JSON.parse(tokenStr)
        const now = new Date()

        if (now.getTime() > item.expiry) {
            localStorage.removeItem("currentSession")
            return null
        }

        let token: Token = {accessToken:item.value.accessToken, refreshToken:item.value.refreshToken};
        return token
    }

    addMinutes(minutes: number) {
        const now = new Date()
        return new Date(now.getTime() + minutes*60000);
    }
}