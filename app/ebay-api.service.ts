import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject} from 'rxjs';
import { environment } from '../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class EbayApiService {

  private API=`${environment.apiUrl}/ebay`;
  private ebayDataSubject = new BehaviorSubject<any>(null);
  public ebayData$ = this.ebayDataSubject.asObservable();

  constructor(private http: HttpClient) {
    if (!environment.production) {
      console.log('Development Mode');
    }
    else{
      console.log('Production Mode')
    };
  }



  getEbaySearh(para:any): Observable<any>{
    console.log('send ebay api request to backend');
    //console.log(para)
    this.http.get(this.API, { params: para }).subscribe(
      (response:any) => {
        console.log(response);
        if (response.findItemsAdvancedResponse[0].searchResult[0]["@count"]=="0"){
          this.ebayDataSubject.next("no data"); 
          console.log("no data")        
        }
        else{
          const items=response.findItemsAdvancedResponse[0].searchResult[0].item;  
          this.ebayDataSubject.next(items);      
          console.log(items);
        }
      },
    );
    return this.ebayData$;
    
  }

}

