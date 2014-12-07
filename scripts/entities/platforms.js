// jshint esnext:true
var _          = require('lodash');
var Sprite     = require('./sprite');
var helpers    = require('helpers');
var game       = require('game');

class Platforms extends Sprite {

  defaults() {
    return {};
  }

  entity_defaults() {
    return {
      x: 0,
      y: 0,
      w: 200,
      h: 20,
      color: 'white'
    };
  }

  constructor(game, x, y, options) {
    this.options = _.extend({}, this.defaults(), options);
    super(game, x, y, helpers.createBlock(this.options.w, this.options.h, this.options.color));
    
    game.physics.arcade.enableBody(this);
    game.add.existing(this);
    this.body.immovable = true;
  }

  canCollide() {
    return this.game.state.getCurrentState().currentChannel != 2;
  }

  canPhaseDown() {
    return this.game.state.getCurrentState().currentChannel == 0;
  }

  canPhaseUp() {
    return this.game.state.getCurrentState().currentChannel == 0;
  }

}

module.exports = Platforms;
