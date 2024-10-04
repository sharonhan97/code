import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShareAddressInfoService {
  private dataSource = new BehaviorSubject<any>(null);
  public addInfo$ = this.dataSource.asObservable();

  private wishdataSource = new BehaviorSubject<any>(null);
  public wishaddInfo$ = this.wishdataSource.asObservable();



  constructor() { }

  updateData(data: any) {
    //console.log("shareAddressInfo service recv data")
    this.dataSource.next(data);
    console.log(this.addInfo$);
  }

  updatewishDatadata(data: any){
    this.wishdataSource.next(data);
    console.log(this.wishaddInfo$);    
  }
}
