const game_model = require('../models/game').game
	  moment = require('moment');

var global_io; 

function launch_socket_io( io ){
	global_io = io;
	io.on('connection', function(socket) {
		console.log('Anonyme connected...');
		let handshake_payload = {
				timestamp: moment(),
				content: 'Connecté au serveur'
			};
		socket.emit('handshake', handshake_payload);

		socket.on('player-connected', (payload) => {
			//Add var into socket
			socket.player_id = payload.player_id;
			socket.code_partie = payload.code_partie;

			let activity = {
				author: socket.player_id,
				timestamp: moment(),
			};
			game_model.update_status( socket.code_partie, socket.player_id, 'online'  )
				.then(useless => {
					return game_model.get_a_player( socket.code_partie, socket.player_id );
				})
				.then(player => {
					activity.content = '<span>' + player.name + '</span> vient de rejoindre le jeu';
					return game_model.add_activity( socket.code_partie, activity );
				})
				.then(useless => {
					activity.status = 'new';
					broadcast_activity( activity );
					io.emit( 'player-online', socket.player_id );
				})
		});
		socket.on('disconnect', function () {
			let activity = {
				author:  socket.player_id,
				timestamp: moment(),
			}
			game_model.update_status( socket.code_partie, socket.player_id, 'offline' )
				.then(useless => {
					return game_model.get_a_player( socket.code_partie, socket.player_id );
				})
				.then(player => {
					activity.content = '<span>' + player.name + '</span> vient de quitter le jeu';
					return game_model.add_activity( socket.code_partie, activity );
				})
				.then(useless => {
					activity.status = 'new';
					broadcast_activity( activity );
					io.emit( 'player-offline', socket.player_id );
				})
		});
		socket.on('throw-dices', (payload) => {
			let dice_1 = Math.floor(Math.random()*6),
				dice_2 = Math.floor(Math.random()*6);

				let activity = {
					author: socket.player_id,
            		timestamp: moment(),
				}
				game_model.get_a_player( socket.code_partie, socket.player_id )
					.then(player => {
						activity.content = '<span>' + player.name + '</span> vient de lancer les dés ( ' + (dice_1 + 1) + ' | ' + (dice_2 + 1) +' )';
						return game_model.add_activity( payload.code_partie, activity );
					})
					.then(useless => {
						activity.status = 'new';
						broadcast_activity( activity );
						socket.emit('throw-results', {'dice_1': dice_1, 'dice_2': dice_2});
					})
				
		});
	});
}

function broadcast_activity( activity ){
	global_io.emit( 'new-activity', activity );
}

module.exports={
    launch_socket_io: launch_socket_io,
    broadcast_activity: broadcast_activity
};