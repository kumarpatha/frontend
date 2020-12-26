import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Observable, of, BehaviorSubject} from 'rxjs';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any>(`${environment.apiUrl}/users`);
    }

    register(data:any) {
        return this.http.post<any>(`${environment.apiUrl}/users/register`, {data})
            .pipe(map(user => {
                return user;
            }));
    }

    addClient(data:any) {
        return this.http.post<any>(`${environment.apiUrl}/add-client`, {data})
            .pipe(map(user => {
                return user;
            }));
    }

    getclients() {
        return this.http.get<any>(`${environment.apiUrl}/clients`);
    }

    addCustomer(data:any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/add-customer`, data)
            .pipe(map(user => {
                return user;
        }));
    }

    search(data) {
        return this.http.post<any>(`${environment.apiUrl}/search-customer`, {'query': data})
        .pipe(map(user => {
            return user;
        }));
    }

    getcustomers() {
        return this.http.get<any>(`${environment.apiUrl}/customers`);
    }

    getclientinfo(id) {
        return this.http.get<any>(`${environment.apiUrl}/getclient/`+id);
    }

    editClient(data:any, edit_id) {
        return this.http.post<any>(`${environment.apiUrl}/edit-client`, {data, edit_id})
            .pipe(map(user => {
                return user;
            }));
    }

    getuserinfo(id) {
        return this.http.get<any>(`${environment.apiUrl}/getuser/`+id);
    }
    
    editUser(data:any, edit_id) {
        return this.http.post<any>(`${environment.apiUrl}/edit-user`, {data, edit_id})
            .pipe(map(user => {
                return user;
            }));
    }

    deleteClient(id) {
        return this.http.get<any>(`${environment.apiUrl}/deleteClient/`+id);
    }

    deleteUser(id) {
        return this.http.get<any>(`${environment.apiUrl}/deleteUser/`+id);
    }

    
    
    
  

}