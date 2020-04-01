const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser');
	  game_model = require('../models/game').game;

// MIDDLEWARE
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// HELPERS
const token_manager = require('../helpers/token_manager'),
	  littlebirds = require('../helpers/littlebirds');

	router.get('/ping', function (req, res) {
		res.status(200).json({message: 'pong'});
	});

	router.post('/create-game', function (req, res) {
		const places=[{"name":"Salle a manger","illustration":"/places/salle_a_manger.jpg"},{"name":"Petit salon","illustration":"/places/petit_salon.jpg"},{"name":"Cuisine","illustration":"/places/cuisine.jpg"},{"name":"Kiosque","illustration":"/places/kiosque.jpg"},{"name":"Jardin","illustration":"/places/jardin.jpg"},{"name":"Salle de Billard","illustration":"/places/salle_de_billard.jpg"},{"name":"Grand Salon","illustration":"/places/grand_salon.jpg"},{"name":"Bibliothèque","illustration":"/places/bibliotheque.jpg"},{"name":"Veranda","illustration":"/places/veranda.jpg"},{"name":"Fontaine","illustration":"/places/fontaine.jpg"},{"name":"Bureau","illustration":"/places/bureau.jpg"},{"name":"Grange","illustration":"/places/grange.jpg"}];
		const weapons=[{"name":"Clef Anglaise","illustration":"/weapons/clef_anglaise.jpg"},{"name":"Chandelier","illustration":"/weapons/chandelier.jpg"},{"name":"Corde","illustration":"/weapons/corde.jpg"},{"name":"Matraque","illustration":"/weapons/matraque.jpg"},{"name":"Poignard","illustration":"/weapons/poignard.jpg"},{"name":"Revolver","illustration":"/weapons/revolver.jpg"},{"name":"Fer a cheval","illustration":"/weapons/fer_a_cheval.jpg"},{"name":"Poison","illustration":"/weapons/poison.jpg"}];
		const suspects=[{"name":"Docteur Olive","illustration":"/suspects/docteur_olive.jpg"},{"name":"Melle Rose","illustration":"/suspects/melle_rose.jpg"},{"name":"Mme Pervenche","illustration":"/suspects/mme_pervenche.jpg"},{"name":"M. Prunelle","illustration":"/suspects/m_prunelle.jpg"},{"name":"Col. Moutarde","illustration":"/suspects/col_moutarde.jpg"},{"name":"Mme Leblanc","illustration":"/suspects/mme_leblanc.jpg"},{"name":"Mme Chose","illustration":"/suspects/mme_chose.jpg"},{"name":"Professeur Violet","illustration":"/suspects/professeur_violet.jpg"},{"name":"Melle Peche","illustration":"/suspects/melle_peche.jpg"},{"name":"Sgt. Legris","illustration":"/suspects/sgt_legris.jpg"}];


		let raw_players = JSON.parse(req.body.players),
			game = {
				code_partie: token_manager.create_code(),
				players: [],
				guilty: {
					token: token_manager.create_token(),
					cards: []
				}
			},
			response = [];


		response.push('code partie: ' + game.code_partie);
		response.push('guilty: ' + 'http://localhost:4200/guilty-cards/' + game.guilty.token);
		game.players = raw_players;

		for (var i = raw_players.length - 1; i >= 0; i--) {
			game.players[i].cards = [];
			game.players[i].token = token_manager.create_token();
			response.push(game.players[i].name + ' ' + 'http://localhost:4200/my-cards/' + game.players[i].token);
		}

		//Pick 1 random card by stack
		//Place
		let random_place_nb = Math.floor(Math.random() * places.length) + 1;
		game.guilty.cards.push( places[random_place_nb-1] );

		//Weapons
		let random_weapon_nb = Math.floor(Math.random() * weapons.length) + 1;
		game.guilty.cards.push( weapons[random_weapon_nb-1] );

		//Suspects
		let random_suspect_nb = Math.floor(Math.random() * suspects.length) + 1;
		game.guilty.cards.push( suspects[random_suspect_nb-1] );

		//Create 3 new stack without this card
		//Place
		let remaining_places = places;
		remaining_places.splice((random_place_nb-1), 1);

		// //Weapons
		let remaining_weapons = weapons;
		remaining_weapons.splice((random_weapon_nb-1), 1);

		// //Suspects
		let remaining_suspects = suspects;
		remaining_suspects.splice((random_suspect_nb-1), 1);

		//merges arrays of cards
		let remaining_cards =  remaining_places.concat(remaining_weapons,remaining_suspects);
		
		//Suffle array
		remaining_cards.sort(() => Math.random() - 0.5);

		//Divide this stack by the number of ppl
		let current_player = Math.floor(Math.random() * raw_players.length) + 1;
		for(var i = 0; i <= (remaining_cards.length-1); i++){
			if(current_player == raw_players.length){current_player = 0}
			game.players[current_player].cards.push(remaining_cards[i]);
			current_player ++;
		}

		game_model(game).save();

		res.status(200).json(response);
	});

	router.post('/get-cards', function (req, res) {
		let token = req.body.token;
		let code_partie = req.body.code_partie;

		game_model.get_cards( token, code_partie )
		.then(players_details => {
			res.status(200).json(players_details);
		})
	});

	router.post('/get-guilty', function (req, res) {
		let code_partie = req.body.code_partie,
			player_id = req.body.player_id,
			activity = {
				author:  player_id,
				timestamp: moment()
			}

		game_model.get_a_player( code_partie, player_id )
			.then(player => {
				activity.content = '<span>' + player.name + '</span> vient de réveler les cartes coupables';
	
				return game_model.add_activity( code_partie, activity );
			})
			.then(is_activity => {
				return game_model.get_guilty( code_partie );
			})
			.then(guilty_details => {
				activity.status = 'new';
				littlebirds.broadcast_activity( activity );
				res.status(200).json(guilty_details);
			})
	});

	router.post('/get-all-players', function (req, res) {
		let code_partie = req.body.code_partie;

		game_model.get_all_players( code_partie )
		.then(all_players => {
			let cleaned_players = [];
			for (var i = all_players.length - 1; i >= 0; i--) {
				let player = {
					'name': all_players[i].name,
					'status': all_players[i].status,
					'_id': all_players[i]._id,
				};
				cleaned_players.push(player);
			}
			res.status(200).json(cleaned_players);
		})
	});

	router.post('/get-activity', function (req, res) {
		let code_partie = req.body.code_partie;

		game_model.get_activity( code_partie )
			.then(activity => {
				res.status(200).json(activity);
			})
	});

module.exports = {
	"public" : router
};