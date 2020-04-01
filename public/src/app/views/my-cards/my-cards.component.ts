import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

//Services
import { PublicApiService } from '../../services/public/public-api.service';

@Component({
    selector: 'app-my-cards',
    templateUrl: './my-cards.component.html',
    styleUrls: ['./my-cards.component.scss'],
    providers: [PublicApiService]
})

export class MyCardsComponent implements OnInit {
	//Modal & Visuals
	is_player_hidden: boolean = false;
	is_confirmation_modal_displayed: boolean = false;
    is_guilty_modal_displayed: boolean = false;

    //Players
    player_content: any = {};
	all_players: any = [];
	total_player: any = 0;
    online_player: any = 0;

    //Game
    token: string = '';
    temporary_code_partie: string = '';
    code_partie: string = '';
    guilty_content: any;
    
    //Dices
    dices: any = ['&#9856;', '&#9857;', '&#9858;', '&#9859;', '&#9860;', '&#9861;' ];
    dice_1_value: string = '&#9856;';
    dice_2_value: string = '&#9856;';

    //Activities
    temporary_activities: any = [];
    activities: any = [];
    private socket;
    last_activity: any = '';

    constructor( private route: ActivatedRoute, public publicApi_service: PublicApiService ){}

	ngOnInit(){
		this.route.params.subscribe( params => {
			this.token =  params.token;
		})
		this.get_online_players().subscribe();
	}

	get_online_players(){
		let observable = new Observable(observer => {
			this.socket = io.connect( environment.api_url );
			this.socket.on('handshake', (data) => { observer.next(data); this.handshake(data); });
			this.socket.on('player-online', (data) => { observer.next(data); this.player_online(data); });
			this.socket.on('player-offline', (data) => { observer.next(data); this.player_offline(data); });
			this.socket.on('throw-results', (data) => { observer.next(data); this.update_dice(data); });
			this.socket.on('new-activity', (activity) => { observer.next(activity); this.new_activity( activity ); });
			return () => { this.socket.disconnect(); }; 
		})
		return observable;
	}

	// SOCKET
	handshake( payload ){
		payload.status = 'new';
		this.new_activity( payload );

		if( this.code_partie != ''){
			this.online_player --;
			this.broadcast_status_connected()
		}
	}
	
	player_online(id){
		for (var i = this.all_players.length - 1; i >= 0; i--) {
			if( this.all_players[i]._id == id ){
				this.all_players[i].status = 'online';
				this.online_player ++;
			}
		}
	}

	player_offline(id){
		for (var i = this.all_players.length - 1; i >= 0; i--) {
			if( this.all_players[i]._id == id ){
				this.all_players[i].status = 'offline';
				this.online_player --;
			}
		}
	}

	// ACTIVITY
	new_activity( activity ){
		this.last_activity = activity.timestamp;
		this.activities.unshift( activity );
		this.denewsify_activity( activity.timestamp );
	}
	denewsify_activity(timestamp){
		setTimeout(()=>{
			for (var i = this.activities.length - 1; i >= 0; i--) {
				if(this.activities[i].timestamp == timestamp){
					this.activities[i].status = '';
				}
			}
		},30000);
	}

	// Launch game
	get_cards(){
		this.code_partie = this.temporary_code_partie;
		this.publicApi_service.get_cards( {token: this.token, code_partie: this.code_partie} )
			.subscribe( player_cards => {
				this.player_content = player_cards;
				this.get_players();
				this.get_activity();
				this.broadcast_status_connected();
			})
	}
	get_activity(){
		this.publicApi_service.get_activity( {code_partie: this.code_partie} )
			.subscribe( activity => {
				this.temporary_activities = activity;
				for (var i = this.temporary_activities.length - 1; i >= 0; i--) {
					this.activities.push( this.temporary_activities[i] )
				}
			})
	}
	get_players(){
		this.publicApi_service.get_all_players( {code_partie: this.code_partie} )
			.subscribe( all_players => {
				this.all_players = all_players;
				this.total_player = this.all_players.length;

				// count based online player
				for (var i = this.total_player - 1; i >= 0; i--) {
					if( this.all_players[i].status == 'online' ){
						this.online_player ++;
					}
				}
			})
	}
	get_guilty_cards(){
		this.publicApi_service.get_guilty( {code_partie: this.code_partie, player_id: this.player_content._id} )
			.subscribe( guilty_content => {
				this.guilty_content = guilty_content;
				this.is_confirmation_modal_displayed = false;
				this.is_guilty_modal_displayed = true;
			})
	}

	//Socket emit
	broadcast_status_connected(){
		this.socket.emit('player-connected', {'player_id': this.player_content._id, 'code_partie': this.code_partie});
	}
	throw_dices(){
		this.socket.emit('throw-dices', {'player_id': this.player_content._id, 'code_partie': this.code_partie});
	}
	update_dice(payload){
		this.dice_1_value = this.dices[payload.dice_1];
		this.dice_2_value = this.dices[payload.dice_2];
	}
	launch_external_url(){
		window.open("https://docs.google.com/spreadsheets/d/1w4JhmOuNKl4XIkH9wJqgZYCDy1GZp_fj44iGA0rg3dw/edit?usp=sharing", "_blank");
	}
	launch_plateau(){
		window.open("../../../assets/files/plateau_cluedo.pdf", "_blank");
	}
}
