import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//Services
import { PublicApiService } from '../../services/public/public-api.service';

@Component({
	selector: 'app-guilty-cards',
	templateUrl: './guilty-cards.component.html',
	styleUrls: ['./guilty-cards.component.scss'],
    providers: [PublicApiService]
})
export class GuiltyCardsComponent implements OnInit {
	guilty_content: any = {};
    temporary_code_partie: string = 'e4c9da05-e83c-4cc8-8bbf-14627e2381cf';
    code_partie: string = '';
    token: string = '';

	constructor( private route: ActivatedRoute, public publicApi_service: PublicApiService ){}
	ngOnInit(){
		this.route.params.subscribe( params => {
			this.token =  params.token;
		})
	}

	get_guilty(){
		this.code_partie = this.temporary_code_partie;
		this.publicApi_service.get_guilty( {token: this.token, code_partie: this.code_partie} )
			.subscribe( guilty_content => {
				this.guilty_content = guilty_content;
			})
	}

}
