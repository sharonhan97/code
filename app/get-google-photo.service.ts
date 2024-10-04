import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GetGooglePhotoService {
  private API=`${environment.apiUrl}/photo`;


  constructor(private http: HttpClient) { }



  getGoogleSearh(title:any): Observable<any>{
    console.log("send google request to backend");
    const url=`${this.API}?title=${title}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response.items;
      })
    );
    
  }


}
