import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/models/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

const USER_KEY = 'user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
   }

   public get currentUser(): User{
    console.log(this.userSubject.value);
    return this.userSubject.value;
   }

   login(userLogin: IUserLogin):Observable<User>{
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user: User) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success('Login successful', 'Success');
        },
        error: (responseError) => {
          this.toastrService.error(responseError.error?.Alert || responseError.error?.message, 'Error');
        }
      })
    );
  }

  private setUserToLocalStorage(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) as User : new User();
  }

  private removeUserFromLocalStorage(): void {
    localStorage.removeItem(USER_KEY);
  }

  register(user: IUserRegister): Observable<User> {
    return this.http.post<User>(USER_REGISTER_URL, user).pipe(
      tap({
        next: (user: User) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success('Registration successful', 'Success');
        },
        error: (responseError) => {
          this.toastrService.error(responseError.error?.Alert || responseError.error?.message, 'Register failed');
        }
      })
    );
  }

  logout(): void {
    this.userSubject.next(new User());
    this.removeUserFromLocalStorage();
    window.location.reload();
    this.toastrService.success('Logout successful', 'Success');
  }
}
