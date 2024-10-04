import { DetailService } from './../detail.service';
import { Component } from '@angular/core';
import { EbayApiService } from './../ebay-api.service';
import { WishlistService } from './../wishlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wish-main',
  templateUrl: './wish-main.component.html',
  styleUrls: ['./wish-main.component.scss']
})
export class WishMainComponent {
  wishdata:any[]=[]
  ready:boolean=false;
  detailId:string="";
  progress:boolean=false;
  showdetail:boolean=false;


  constructor(private ebaydata:EbayApiService,private wishService:WishlistService,private detail:DetailService,
    private router:Router){
  }

  ngOnInit(){
    this.wishService.getWishList().subscribe(
      data=>{
        if(data&&data.length>0){
          console.log(data);
          this.wishdata=data;        
        }
        this.ready=true;
        }
    )
    this.detail.showwishdetail$.subscribe(
      data=>{
        this.showdetail=data;
        this.detail.wishitemId$.subscribe(
          data=>{
            this.detailId=data;
            console.log("wishitem",data);
          }
        );
      }
    )
    
  }

  goDetail(){
    this.showdetail=true;
  }

}
