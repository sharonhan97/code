import { Router } from '@angular/router';
import { Component, OnInit, } from '@angular/core';
import { EbayApiService } from '../ebay-api.service';
import { DetailService } from '../detail.service';


@Component({
  selector: 'result-main',
  templateUrl: './result-main.component.html',
  styleUrls: ['./result-main.component.scss']
})
export class ResultMainComponent implements OnInit{
  rawdata:any[]=[];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalItems: number=0; 
  totalPages: number=0;
  pagesArray: number[]=[];
  ready:boolean=false;
  detailId:string="";
  norecords:boolean=false;
  showdetail:boolean=false;
  


  constructor(private ebaydata:EbayApiService,private detail:DetailService){
    console.log('Main Result Component ngOnInit');
    this.ebaydata.ebayData$.subscribe(items => {
      if(items){
        console.log("main show result",items);
        if(items=="no data"){
          this.norecords=true;
        }
        else{
          this.rawdata = items;
          this.totalItems = this.rawdata.length; 
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          this.pagesArray = Array.from({length: this.totalPages}, (_, i) => i + 1);
        }
        this.ready=true;        
      }
    });
  }

  ngOnInit(): void {
    this.detail.showresultdetail$.subscribe(
      data=>{
        this.showdetail=data;
        this.detail.itemId$.subscribe(
          data=>{
            this.detailId=data;
            console.log("select",data);
          }
        );
      }
      
    )

  }

  goDetail(){
    this.showdetail=true;
  }

  goToPage(page:number){
    this.currentPage=page;
  }


}
