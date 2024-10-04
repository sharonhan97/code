import { Component, Input, OnInit, } from '@angular/core';
import { GetdetailService } from '../getdetail.service';
import { Router } from '@angular/router';
import { ShareAddressInfoService } from '../share-address-info.service';
import { WishlistService } from '../wishlist.service';
import { DetailService } from '../detail.service';

@Component({
  selector: '[result-single]',
  templateUrl: './result-single.component.html',
  styleUrls: ['./result-single.component.scss']
})
export class ResultSingleComponent implements OnInit{
  @Input() data:any;
  @Input() ind:number=-1;

  img:string="";
  title:string="";
  price:string="";
  shipping:string="";
  zipcode:string="";
  itemId:string="";
  wish:boolean=false;


  constructor(private detailservice:GetdetailService,private router:Router,private shareAdd:ShareAddressInfoService,private wishService:WishlistService,private detailService:DetailService){}

  ngOnInit():void{
    this.img = this.data.galleryURL?.[0] || "N/A";
    this.title = this.data.title?.[0] || "N/A";
    this.price = this.data.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || "N/A";
    this.shipping = this.data.shippingInfo?.[0]?.shippingServiceCost?.[0]?.__value__ || "N/A";
    this.zipcode = this.data.postalCode?.[0] || "N/A";
    this.itemId=this.data.itemId?.[0] || "N/A";

    if(this.shipping=="0.0"){
      this.shipping="Free Shipping";
    }
    else{
      this.shipping="$"+this.shipping;
    }

    this.price="$"+this.price;

    this.wish=this.wishService.IsInWishList(this.itemId);

  }

  cutTitle(title:string){
    if(title.length>45){
      let subtitle=title.substring(0,45);
      if (subtitle[44]!=" "){
        let lastind=subtitle.lastIndexOf(" ");
        subtitle=subtitle.substring(0,lastind)+"...";
      }
      return subtitle;
    }
    else{
      return title;
    }

  }

  getDetailPage() {
    this.shareAdd.updateData(this.data);
    this.detailService.addItem(this.itemId);
    this.detailService.showResultDetail();
  }

  addWishList(){
    if(!this.wish){
      console.log("add wish")
      this.wishService.addWishList(this.data).subscribe(
        data=>{console.log(data);}
      );
    }
    else{
      this.wishService.deleteWishList(this.itemId).subscribe(
        data=>{console.log(data);}

      );
    }
    this.wish=!this.wish;
  }



}
