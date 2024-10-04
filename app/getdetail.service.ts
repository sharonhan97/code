import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GetdetailService {
  private API=`${environment.apiUrl}/detail`;

  constructor(private http:HttpClient) { }

  getEbayDetail(para:string):Observable<any>{
    console.log("send detail request to backend");
    const url=`${this.API}?itemId=${para}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response.Item;
      })
    );

  }
}
