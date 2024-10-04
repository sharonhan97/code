import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GetcurrService {


  constructor(private http:HttpClient) { }

  getcurrentZipcode(): Observable<any>{
    const url="https://ipinfo.io/json?token=18acdfdd7434e7";
    return this.http.get(url).pipe(
      map(response=> {
        console.log('API response received:', response);
        return (response as any)["postal"]
      }),
      catchError(error=>{
        console.error('Get curr zipcode error:', error);
        return error;
      })
    )


  }
}
