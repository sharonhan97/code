import { Component,OnInit } from '@angular/core';
import { DetailService } from './detail.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  switch:string="result";
  showresult:boolean=false;
  clearall:boolean=false;

  constructor(private service:DetailService){
  }

  ngOnInit(){
    this.service.showresult$.subscribe(
      data=>{
        this.showresult=data;        
      }
    )
    this.service.clearAll$.subscribe(
      data=>{
        this.clearall=data;
      }
    )

  }




}
