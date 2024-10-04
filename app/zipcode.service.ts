import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class ZipcodeService {
  private API=`${environment.apiUrl}/zipcode`;


  constructor(private http: HttpClient) { }

  getZipcode(enter: string): Observable<string[]>{
    console.log('Zipcode Request Send');
    const url=`${this.API}?enter=${enter}`;
    return this.http.get<string[]>(url);
  }
}
