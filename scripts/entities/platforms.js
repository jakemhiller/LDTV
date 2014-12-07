// jshint esnext:true
var _          = require('lodash');
var Sprite     = require('./sprite');
var utils      = require('utils');
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

  constructor(game, options) {
    console.log('create platform');
    this.options = _.extend({}, this.entity_defaults(), options);
    super(game, options.x, options.y, utils.createBlock(this.options.w, this.options.h, this.options.color));

    game.physics.arcade.enableBody(this);
    game.add.existing(this);
    this.body.immovable = true;
  }

  canCollide() {
    return this.game.state.getCurrentState().currentChannel !== 2;
  }

  canPhaseDown() {
    return this.game.state.getCurrentState().currentChannel === 0;
  }

  canPhaseUp() {
    return this.game.state.getCurrentState().currentChannel === 0;
  }

}

module.exports = Platforms;
