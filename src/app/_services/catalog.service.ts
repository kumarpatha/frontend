import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Observable, of, BehaviorSubject} from 'rxjs';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
    pdfData; 
    constructor(private http: HttpClient) { }

    getpdfData(PDFProduct, PDFProductProject): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/pdf`, {PDFProduct, PDFProductProject})
            .pipe(map(data => {
                this.pdfData = data.html;
                console.log(this.pdfData);
                return data;
        }));
    }
   
}