import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private getAPI=`${environment.apiUrl}/getwish`;
  private addAPI=`${environment.apiUrl}/addwish`;
  private deleteAPI=`${environment.apiUrl}/deletewish`;
  private wishList: Set<string>=new Set();

  constructor(private http:HttpClient) { }

  deleteWishList(para:string):Observable<any>{
    console.log("send deletewish request to backend");
    const url=`${this.deleteAPI}?itemId=${para}`;
    this.wishList.delete(para);
    return this.http.get(url);
  }

  addWishList(data:any):Observable<any>{
    console.log("send addwish request to backend");
    const itemId=data.itemId[0];
    this.wishList.add(itemId);
    return this.http.post(this.addAPI,data);
  }

  getWishList():Observable<any>{
    console.log("send getwish request to backend");
    const url=`${this.getAPI}`;
    return this.http.get(url);
  }

  IsInWishList(itemId:string):boolean{
    if (this.wishList.has(itemId)){
      return true;
    }
    else{
      return false;
    }
  }



}
