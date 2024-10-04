import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  private itemIdSource = new BehaviorSubject<string>("");
  itemId$ = this.itemIdSource.asObservable();

  private wishitemIdSource = new BehaviorSubject<string>("");
  wishitemId$ = this.wishitemIdSource.asObservable();  

  private showresultSource = new BehaviorSubject<boolean>(false);
  showresult$ = this.showresultSource.asObservable(); 
  
  private showresultdetailSource = new BehaviorSubject<boolean>(false);
  showresultdetail$ = this.showresultdetailSource.asObservable(); 
  
  private showwishdetailSource= new BehaviorSubject<boolean>(false);
  showwishdetail$ = this.showwishdetailSource.asObservable(); 

  private clearAllSource=new BehaviorSubject<boolean>(false);
  clearAll$ = this.clearAllSource.asObservable();





  constructor() { }

  addItem(id:string){
    this.itemIdSource.next(id);
    console.log("add detail item");
  }

  addwishItem(id:string){
    this.wishitemIdSource.next(id);
    console.log("add wish detail item");
  }

  showResult(){
    this.showresultSource.next(true);
    console.log("show result")
  }

  clearResult(){
    this.showresultSource.next(false);
    console.log("clear result")

  }

  showResultDetail(){
    this.showresultdetailSource.next(true);
    console.log("show result detail")    
  }

  clearResultDetail(){
    this.showresultdetailSource.next(false);
    console.log("clear result detail")    
  }

  showWishDetail(){
    this.showwishdetailSource.next(true);
    console.log("show result detail")    
  }

  clearWishDetail(){
    this.showwishdetailSource.next(false);
    console.log("clear result detail")    
  }





}
