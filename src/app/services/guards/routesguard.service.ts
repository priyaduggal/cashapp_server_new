import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoutesguardService implements CanActivate {

  constructor( private userService: UserService, private router: Router) { }
     canActivate(route: ActivatedRouteSnapshot): boolean {

    if(1){
      return true;
    }
    else{
      this.router.navigate(['/']);
      return false;
    }
  }
}
