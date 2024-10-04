import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResultSingleComponent } from './result-single/result-single.component';
import { ResultMainComponent } from './result-main/result-main.component';
import { DetailPageComponent } from './detail-page/detail-page.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { WishSingleComponent } from './wish-single/wish-single.component';
import { CommonModule } from '@angular/common';
import { WishMainComponent } from './wish-main/wish-main.component';



@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    ResultSingleComponent,
    ResultMainComponent,
    DetailPageComponent,
    WishSingleComponent,
    WishMainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    RoundProgressModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
