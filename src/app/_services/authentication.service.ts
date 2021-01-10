import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string, device_name: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password, device_name })
            .pipe(map(users => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                console.log(users);
                localStorage.setItem('currentUser', JSON.stringify(users.user));
                this.currentUserSubject.next(users.user);
                return users;
            }));
    }
    
    logout() {
        
            // remove user from local storage to log user out
                return this.http.get<User[]>(`${environment.apiUrl}/users/logout`).pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
            }));
    }

    change_password(data:any) {
        return this.http.post<any>(`${environment.apiUrl}/change-password`, {data})
            .pipe(map(response => {
                return response;
            }));
    }

    forgetPassword(data:any) {
        return this.http.post<any>(`${environment.apiUrl}/forget-password`, {data})
            .pipe(map(response => {
                return response;
            }));
    }

    resetPassword(data:any, token:any) {
        return this.http.post<any>(`${environment.apiUrl}/reset-password`, {data, token})
            .pipe(map(response => {
                return response;
            }));
    }
}