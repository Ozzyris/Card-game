import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})


export class PublicApiService {
	base_url = environment.api_url + 'public/';
	httpOptions: any;

	constructor( private http: HttpClient ){
		this.httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json'
			})
		};
	}

	get_cards(payload){
		let url = this.base_url + 'get-cards';
		return this.http.post(url, payload, this.httpOptions);
	}

	get_all_players(payload){
		let url = this.base_url + 'get-all-players';
		return this.http.post(url, payload, this.httpOptions);
	}

	get_guilty(payload){
		let url = this.base_url + 'get-guilty';
		return this.http.post(url, payload, this.httpOptions);
	}

	get_activity(payload){
		let url = this.base_url + 'get-activity';
		return this.http.post(url, payload, this.httpOptions);
	}
}
