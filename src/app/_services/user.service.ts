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
        return this.http.get<any>(`${environment.apiUrl}/customersList`);
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

    addProject(data:any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/add-project`, data)
            .pipe(map(user => {
                return user;
        }));
    }
    
    getprojects() {
        return this.http.get<any>(`${environment.apiUrl}/projectList`);
    }
     
    addProduct(data:any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/add-product`, data)
            .pipe(map(user => {
                return user;
        }));
    }

    getproducts() {
        return this.http.get<any>(`${environment.apiUrl}/productList`);
    }

    searchProduct(data) {
        return this.http.post<any>(`${environment.apiUrl}/search-product`, {'query': data})
        .pipe(map(user => {
            return user;
        }));
    }

    searchProject(data) {
        return this.http.post<any>(`${environment.apiUrl}/search-project`, {'query': data})
        .pipe(map(user => {
            return user;
        }));
    }

    getCustomerinfo(id) {
        return this.http.get<any>(`${environment.apiUrl}/get-customer-info/`+id);
    }

    editCustomer(data:any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/edit-customer`, data)
            .pipe(map(user => {
                return user;
        }));
    }

    deleteCustomer(id) {
        return this.http.get<any>(`${environment.apiUrl}/deleteCustomer/`+id);
    }

    getProductinfo(id){
        return this.http.get<any>(`${environment.apiUrl}/get-product-info/`+id);
    }

    deleteProduct(id) {
        return this.http.get<any>(`${environment.apiUrl}/deleteProduct/`+id);
    }

    editProduct(data:any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/edit-product`, data)
            .pipe(map(user => {
                return user;
        }));
    }

    getProjectinfo(id){
        return this.http.get<any>(`${environment.apiUrl}/get-project-info/`+id);
    }

    deleteProject(id) {
        return this.http.get<any>(`${environment.apiUrl}/deleteProject/`+id);
    }

    editProject(data:any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/edit-project`, data)
            .pipe(map(user => {
                return user;
        }));
    }

    getProductCategories(){
        return this.http.get<any>(`${environment.apiUrl}/product-categories`);
    }

    addProductCatgory(data:any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/add-product-category`, data)
            .pipe(map(user => {
                return user;
        }));
    }
    
    editProductCatgory(data:any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/edit-product-category`, data)
            .pipe(map(user => {
                return user;
        }));
    }

    getProjectCategories(){
        return this.http.get<any>(`${environment.apiUrl}/project-categories`);
    }

    addProjectCatgory(data:any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/add-project-category`, data)
            .pipe(map(user => {
                return user;
        }));
    }

    editProjectCatgory(data:any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/edit-project-category`, data)
            .pipe(map(user => {
                return user;
        }));
    }

    deleteProjectDoc(id){
        return this.http.get<any>(`${environment.apiUrl}/delete_project_doc/`+id);
    }

    getFilterData(){
        return this.http.get<any>(`${environment.apiUrl}/filter-data`);
    }

    getpdfData(){
        return this.http.get<any>(`${environment.apiUrl}/pdf`);
    }

    getcustomersgrid(){
        return this.http.post<any>(`${environment.apiUrl}/customers`, {})
        .pipe(map(customers => {
            return customers;
        }));
    }
}