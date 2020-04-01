import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

//EXTERNAL PACKAGE
import { MomentModule } from 'angular2-moment';

//Views
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MyCardsComponent } from './views/my-cards/my-cards.component';
import { HomeComponent } from './views/home/home.component';
import { GuiltyCardsComponent } from './views/guilty-cards/guilty-cards.component';

//Pipes
import { SanitizerPipe } from './pipes/sanitizer/sanitizer.pipe';
import { StatusFilterPipe } from './pipes/statusfilter/status-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MyCardsComponent,
    HomeComponent,
    SanitizerPipe,
    GuiltyCardsComponent,
    StatusFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MomentModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
