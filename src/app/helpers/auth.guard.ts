import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { Convert, Token } from "../models/token";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let currentSession = this.authenticationService.currentSessionValue;
        let token = this.getTokenWithExpiry()
        if (token!= null) {
            currentSession = token
        }

        if (currentSession.accessToken && currentSession.refreshToken) {
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    getTokenWithExpiry() :Token {
        const tokenStr = localStorage.getItem("currentSession")
    
        if (!tokenStr) {
            return null
        }

        const item = JSON.parse(tokenStr)
        const now = new Date()

        console.log(+now.getTime())
        console.log(Date.parse(item.expiry))
        if (now.getTime() > Date.parse(item.expiry)) {
            localStorage.removeItem("currentSession")
            return null
        }

        let token: Token = {accessToken:item.value.accessToken, refreshToken:item.value.refreshToken};
        return token
    }
}