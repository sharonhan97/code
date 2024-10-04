import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetSimilarService {
  private API=`${environment.apiUrl}/similar`;

  constructor(private http:HttpClient) { }

  getSimilar(para:string):Observable<any>{
    console.log("send similar request to backend");
    const url=`${this.API}?itemId=${para}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response.getSimilarItemsResponse.itemRecommendations.item;
      })
    );

  }
}

