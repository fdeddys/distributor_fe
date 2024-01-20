import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate,  CanActivateChild {

  constructor(private localStorage: LocalStorageService, ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      console.log('AuthGuard#canActivate called==>', next.routeConfig.path);
      const menuId = next.routeConfig.path;
      if (menuId === 'main') {
        if (!localStorage.getItem('ngx-webstorage|token')) {
          console.log('redirect !');
        }
      }

    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

}
