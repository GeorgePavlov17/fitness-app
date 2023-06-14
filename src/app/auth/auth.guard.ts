import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, Route, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private store: Store<fromRoot.State>) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return this.store.select(fromRoot.getIsAuth);
    }

    canLoad(route: Route) {
        return this.store.select(fromRoot.getIsAuth).pipe(take(1));
    }
}