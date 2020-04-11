var mongoose = require("./mongoose"),
    moment = require('moment'),
    Promise = require('bluebird');

var game = new mongoose.Schema({
	creation_date: {type: Date, default: moment()},
    code_partie: {type: String},
    players: [
    	{
        	name: {type: String},
            email: {type: String},
            token: {type: String},
            status: {type: String, default: 'offline'},
            cards: [
            	{
            		name: {type: String},
                	illustration: {type: String},
                }
            ]   
        },
    ],
    guilty: {
        token: {type: String},
        cards: [
            {
                name: {type: String},
                illustration: {type: String},
            }
        ]
    },
    activity: [
        {
            author_id: {type: String},
            content: {type: String},
            timestamp: {type: Date, default: moment()},
            status: {type: String, default: ''}
        }
    ]
}, {collection: 'game'});

game.statics.get_cards = function(token, code_partie){
    return new Promise((resolve, reject) => {
        game.findOne({code_partie: code_partie}, {}).exec()
            .then(game => {
                if( game ){
                    for (var i = game.players.length - 1; i >= 0; i--) {
                        if( game.players[i].token == token){
                            resolve( game.players[i] );
                        }
                    }
                }else{
                    resolve( undefined );
                }                
            })
    })
};

game.statics.get_guilty = function(code_partie){
    return new Promise((resolve, reject) => {
        game.findOne({code_partie: code_partie}, {}).exec()
            .then(game => {
                if( game ){
                    resolve( game.guilty );
                }else{
                    resolve( undefined );
                }                
            })
    })
};

game.statics.get_a_player = function(code_partie, player_id){
    return new Promise((resolve, reject) => {
        game.findOne({code_partie: code_partie}, {}).exec()
            .then(game => {
                if( game ){
                    for (var i = game.players.length - 1; i >= 0; i--) {
                        if( game.players[i]._id == player_id){
                            resolve( game.players[i] );
                        }
                    }
                }else{
                    resolve( undefined );
                }                
            })
    })
};

game.statics.get_all_players = function(code_partie){
    return new Promise((resolve, reject) => {
        game.findOne({code_partie: code_partie}, {}).exec()
            .then(game => {
                if( game ){
                    resolve( game.players );
                }else{
                    resolve( undefined );
                }                
            })
    })
};

game.statics.update_status = function(code_partie, player_id, status){
    return new Promise((resolve, reject) => {
        game.updateOne({ code_partie: code_partie, 'players._id': player_id }, {
            $set: { 
                "players.$.status" : status,
            }
        }).exec()
        .then ( is_preparation_updated => {
            resolve( is_preparation_updated );
        })
    })
};

game.statics.add_activity = function(code_partie, payload){
    return new Promise((resolve, reject) => {
        game.updateOne({ code_partie: code_partie }, {
            $push:{
                'activity': payload
            }
        }).exec()
        .then (is_preparation_added => {
            resolve( is_preparation_added );
        })
    })
};

game.statics.get_activity = function(code_partie){
    return new Promise((resolve, reject) => {
        game.findOne({code_partie: code_partie}, {}).exec()
            .then(game => {
                if( game ){
                    resolve( game.activity );
                }else{
                    resolve( undefined );
                }                
            })
    })
};



var game = mongoose.DB.model('game', game);
module.exports.game = game