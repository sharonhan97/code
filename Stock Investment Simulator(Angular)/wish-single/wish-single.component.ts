import { Component, Input, OnInit, } from '@angular/core';
import { GetdetailService } from '../getdetail.service';
import { Router } from '@angular/router';
import { ShareAddressInfoService } from '../share-address-info.service';
import { WishlistService } from '../wishlist.service';
import { DetailService } from '../detail.service';

@Component({
  selector: '[wish-single]',
  templateUrl: './wish-single.component.html',
  styleUrls: ['./wish-single.component.scss']
})
export class WishSingleComponent implements OnInit {
  @Input() data:any;
  @Input() ind:number=-1;

  img:string="";
  title:string="";
  price:string="";
  shipping:string="";
  itemId:string="";
  wish:boolean=true;

  constructor(private detailservice:GetdetailService,private router:Router,private shareAdd:ShareAddressInfoService,
    private shareService:WishlistService,private detail:DetailService){}

  ngOnInit():void{
    this.img = this.data.galleryURL?.[0] || "N/A";
    this.title = this.data.title?.[0] || "N/A";
    this.price = this.data.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || "N/A";
    this.shipping = this.data.shippingInfo?.[0]?.shippingServiceCost?.[0]?.__value__ || "N/A";
    this.itemId=this.data.itemId?.[0] || "N/A";
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
    this.shareAdd.updatewishDatadata(this.data);
    this.detail.addwishItem(this.itemId);
    this.detail.showWishDetail();
  }

  deleteWishList(){
    this.shareService.deleteWishList(this.itemId).subscribe(
      data=>{console.log(data);}
    );
    this.wish=false;
  }


}
