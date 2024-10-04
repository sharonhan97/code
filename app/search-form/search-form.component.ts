import { Component, OnInit } from '@angular/core';
import { ZipcodeService } from '../zipcode.service';
import { Observable, of } from 'rxjs';
import { startWith, map, debounceTime, switchMap, distinctUntilChanged} from 'rxjs/operators';
import { FormControl, Validators,FormBuilder,FormGroup,FormArray} from '@angular/forms';
import { GetcurrService } from '../getcurr.service';
import { EbayApiService } from '../ebay-api.service';
import { Router } from '@angular/router';
import { DetailService } from '../detail.service';

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  location: string='current';
  filteredOptions!: Observable<string[]>;
  myForm!: FormGroup;
  currentzipcode: string='';

  

  constructor(private zipcodeService:ZipcodeService,private fb:FormBuilder,private getcurr:GetcurrService,
    private getEbay:EbayApiService,private router:Router,private detail:DetailService){
    this.myForm = this.fb.group({
      keyword: ['',Validators.required],
      category:['All'],
      conditionNew: [false],
      conditionUsed: [false],
      conditionUnspecified: [false],
      shippingFree:[false],
      shippingLocal:[false],
      distance:[10],
      zipcode:['']
    })
  }

  

  isWhitespaceOnly(): boolean {
    return (this.myForm.get('keyword')!.value || '').trim().length === 0;
  }

  isZipcodeValid(): boolean {
    if(this.location==='current'){
      return true;
    }
    const regex = /^\d{5}$/;
    const getZipcode=this.myForm.get('zipcode')!.value;
    return regex.test(getZipcode);
  }

  ngOnInit() {
    this.setLocation(this.location);
    this.filteredOptions = this.myForm.get('zipcode')!.valueChanges.pipe(
      debounceTime(100), 
      distinctUntilChanged(),
      switchMap(value => value ? this.zipcodeService.getZipcode(value) : of([]))

    );
    this.getcurr.getcurrentZipcode().subscribe(
      data=>{this.currentzipcode=data})
  }

  setLocation(value: string) {
    this.location = value;
    if (value === 'current') {
      this.myForm.get('zipcode')!.disable();
      this.myForm.get('zipcode')?.setValue('');
    } else {
      this.myForm.get('zipcode')!.enable();
      this.currentzipcode='';
    }
  }

  onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      if (this.location==='current'){
        formData.zipcode=this.currentzipcode;
      }
      this.getEbay.getEbaySearh(formData).subscribe(
        data=>{console.log(data);}
      );
      this.detail.showResult();
    }
  }

  Clear(){
    this.detail.clearResult();
  }

  

}
