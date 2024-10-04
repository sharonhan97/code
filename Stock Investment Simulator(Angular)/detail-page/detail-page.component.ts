import { DetailService } from './../detail.service';
import { Component, Input, OnInit } from '@angular/core';
import { GetdetailService } from '../getdetail.service';
import { ActivatedRoute} from '@angular/router';
import { GetGooglePhotoService } from '../get-google-photo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareAddressInfoService } from '../share-address-info.service';
import { GetSimilarService } from '../get-similar.service';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {
  @Input() itemId!:string;
  @Input() tag!:string;
  title:string="";
  producturl:string=""; 
  detail:any;
  images:string[]=[];
  price:string="";
  location:string="";
  ret:string="";
  spec:any[]=[];
  
  ready:boolean=false;
  show:string="product";

  photolink:string[]=[];

  shipCost:string="";
  shipLocation:string="";
  shipHandleTime:string="";
  expeditedShip:string="";
  oneDayShip:string="";
  returnAccept:string="";

  feedbackScore:string="";
  popularity:string="";
  feedbackRating:string="";
  topRated:string="";
  storeName:string="";
  buyProduct:string="";
  sellerId:string="";


  current:number=0;
  max:number=100;
  feedbackScoreNum:number=0;
  feedbackColor:string="";

  rawsimilaritems:any[]=[];
  similaritems:any[]=[];
  displaysimilar:any[]=[];
  showAll=false;
  sortCate="default";
  sortOrder="Ascending";

  datainfo:any;





  wish:boolean=false;

  constructor(private detailservice:GetdetailService,private route:ActivatedRoute,private googlePhoto:GetGooglePhotoService, private modal:NgbModal,
    private addService:ShareAddressInfoService,private getsimilar:GetSimilarService,private wishService:WishlistService,private detailS:DetailService)
    {

  }

  ngOnInit(){
    this.getDetail();
  }

  getDetail(){
    this.detailservice.getEbayDetail(this.itemId).subscribe(
      data=>{
        if(data){
          this.detail=data;
          this.images=this.detail.PictureURL;
          this.price="$"+(this.detail.ConvertedCurrentPrice.Value).toString();
          this.location=this.detail.Location;
          if(this.detail.ReturnPolicy){
            if (this.detail.ReturnPolicy.ReturnsAccepted){
              this.ret+="Returns Accepted ";
            }
            if(this.detail.ReturnPolicy.ReturnsWithin){
              this.ret+="within "
              this.ret+=this.detail.ReturnPolicy.ReturnsWithin;
            }
          }
          this.spec=this.detail.ItemSpecifics.NameValueList;
          //console.log("send photo request")
          this.getGooglePhoto();
          this.getAddressInfo();
          this.getSimilarItems();
          this.wish=this.wishService.IsInWishList(this.itemId);
          this.ready=true;
          
        }
      }
    )
  }

  getGooglePhoto(){
    this.googlePhoto.getGoogleSearh(this.detail.Title).subscribe(
      data=>{
        if(data &&data.length>=1){
          for(let item of data){
            if(item.link){
              this.photolink.push(item.link);
            }         
          }          
        }
      }
    )

  }


  getAddressInfo(){
    if (this.tag=="result"){
      this.addService.addInfo$.subscribe(
        data=>{this.getinsidefunc(data)}
      )
    }
    else if(this.tag=="wish"){
      this.addService.wishaddInfo$.subscribe(
        data=>{this.getinsidefunc(data)}
      )

    }

  }

getinsidefunc(data:any){       
  if(data){
  this.datainfo=data;
  this.shipCost=data.shippingInfo?.[0].shippingServiceCost?.[0].__value__||"";
  this.shipHandleTime=data.shippingInfo?.[0].handlingTime?.[0]||"";
  this.shipLocation=data.shippingInfo?.[0].shipToLocations?.[0]||"";
  this.oneDayShip=data.shippingInfo?.[0].oneDayShippingAvailable?.[0]||"";
  this.expeditedShip=data.shippingInfo?.[0]?.expeditedShipping?.[0]||"";
  this.returnAccept=data.returnsAccepted?.[0]||"";
  this.title=data.title?.[0] || "N/A";
  this.producturl=data.galleryURL[0];
  

  if(this.shipCost=="0.0"){
    this.shipCost="Free Shipping"
  }
  else{
    this.shipCost="$"+this.shipCost;
  }
  if(this.shipHandleTime=="0" ||this.shipHandleTime=="1"){
    this.shipHandleTime+=" Day";
  }
  else{
    this.shipHandleTime+=" Days";
  }


  this.feedbackScore=data.sellerInfo?.[0].feedbackScore?.[0]||"";
  this.feedbackRating=data.sellerInfo?.[0].feedbackScore?.[0]||"";
  this.popularity=data.sellerInfo?.[0].positiveFeedbackPercent?.[0]||"";
  this.topRated=data.sellerInfo?.[0].topRatedSeller?.[0]||"";
  this.storeName=data.storeInfo?.[0].storeName?.[0]||"";
  this.buyProduct=data.storeInfo?.[0].storeURL?.[0]||"";
  this.sellerId=data.sellerInfo?.[0]?.sellerUserName?.[0]||"";
  if(this.popularity){
    this.current=Number(this.popularity);
  }
  //console.log(this.feedbackScore)
  if(this.feedbackScore){
    this.feedbackScoreNum=Number(this.feedbackScore);
    this.updateFeedbackColor(this.feedbackScoreNum);
  }
  //console.log(this.feedbackColor);
}}

  getSimilarItems(){
    this.getsimilar.getSimilar(this.itemId).subscribe(
      data=>{
        if(data){
        this.rawsimilaritems=data;
        this.cleanSimilarItems(this.rawsimilaritems);
        console.log(this.similaritems);
        this.updateSimilarItems();
        console.log(this.displaysimilar);
        }
      }
    )

  }

  cleanSimilarItems(items:any){
    for(let item of items){
      const cleandata:{[key:string]:any}={};
      cleandata['image']=item.imageURL;
      cleandata['title']=item.title;
      cleandata['titleLink']=item.viewItemURL?item.viewItemURL:"";
      cleandata['price']=item.buyItNowPrice.__value__?Number(item.buyItNowPrice.__value__):0;
      cleandata['shipcost']=item.shippingCost.__value__?Number(item.shippingCost.__value__):0;
      const days=item.timeLeft;
      const match = days.match(/P(\d+)D/);
      cleandata['daysleft']=match? Number(match[1]):0;
      this.similaritems.push(cleandata);
    }

  }

  updateSimilarItems(){
    this.displaysimilar=[...this.similaritems];
    if(this.sortCate !=="default"){
      this.displaysimilar.sort((a,b)=>{
        let comp=0;
        if(a[this.sortCate]<b[this.sortCate]){
          comp=-1;
        }
        else if(a[this.sortCate]>b[this.sortCate]){
          comp=1;
        }
        if(this.sortOrder==="Ascending"){
          comp=comp*-1;
        }
        return comp;
      })
    }

    if(!this.showAll){
      this.displaysimilar=this.displaysimilar.slice(0,5);
    }
  }

  letShowAll(){
    this.showAll=!this.showAll;
    this.updateSimilarItems();
  }

  openModal(content:any) {
    this.modal.open(content, { centered: true });
  }

  goBack(){
    this.ready=false;
    if(this.tag=="result"){
      this.detailS.clearResultDetail();
    }
    else if(this.tag=="wish"){
      this.detailS.clearWishDetail();
    }

    
  }


  shareToFacebook(){
    const content=`Buy ${this.title} at ${this.price} from ${this.producturl} below.`;
    const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.producturl)}&quote=${encodeURIComponent(content)}`;
    window.open(facebookShareURL, 'Share on Facebook', 'width=600,height=400');
  }

  addWishList(){
    if(!this.wish){
      this.wishService.addWishList(this.datainfo).subscribe(
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

  updateFeedbackColor(num:number) {
      if (num >= 1000000) {
          this.feedbackColor = 'SilverShooting';
      } else if (num >= 500000) {
          this.feedbackColor = 'GreenShooting';
      } else if (num >= 100000) {
          this.feedbackColor = 'RedShooting';
      } else if (num >= 50000) {
          this.feedbackColor = 'PurpleShooting';
      } else if (num >= 25000) {
          this.feedbackColor = 'TurquoiseShooting';
      } else if (num >= 10000) {
          this.feedbackColor = 'YellowShooting';
      } else if (num >= 5000) {
          this.feedbackColor = 'Green';
      } else if (num >= 1000) {
          this.feedbackColor = 'Red';
      } else if (num >= 500) {
          this.feedbackColor = 'Purple';
      } else if (num >= 100) {
          this.feedbackColor = 'Turquoise';
      } else if (num >= 50) {
          this.feedbackColor = 'Blue';
      } else if (num >= 10) {
          this.feedbackColor = 'Yellow';
      } else {
          this.feedbackColor = ''; 
      }
  }
  
  
  
  
  
  


  

}
