import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCardsComponent } from './views/my-cards/my-cards.component';
import { HomeComponent } from './views/home/home.component';
import { GuiltyCardsComponent } from './views/guilty-cards/guilty-cards.component';


const routes: Routes = [
	{ path: '',   redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent, data: { title: 'My Cards' } },
	{ path: 'my-cards/:token', component: MyCardsComponent, data: { title: 'My Cards' } },
	{ path: 'guilty-cards/:token', component: GuiltyCardsComponent, data: { title: 'Guilty Cards' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
