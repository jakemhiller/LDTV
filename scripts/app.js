// jshint esnext:true

var game      = require('game');
var MainState = require('states/main');
var mainState = new MainState('main');

game.state.add('main', mainState);
game.state.start('main');

window.game = game;
