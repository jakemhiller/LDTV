// jshint esnext:true
var _          = require('lodash');
var Sprite     = require('./sprite');
var helpers    = require('helpers');
var game       = require('game');

class Collectable extends Sprite {

  defaults() {
    return {};
  }

  entity_defaults() {
    return {
      x: 0,
      y: 0,
      w: 10,
      h: 10,
      color: 'red'
    };
  }

  constructor(game, options) {
    options = _.extend({}, this.entity_defaults(), options);
    super(game, options.x, options.y, helpers.createBlock(options.w, options.h, options.color));

    game.physics.arcade.enableBody(this);

    this.body.bounce.y           = 0.2;
    this.body.bounce.x           = 0.2;
    this.body.gravity.y          = 1500;
    this.body.maxVelocity.y      = 5000;
    this.body.maxVelocity.x      = 400;
    this.body.collideWorldBounds = true;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    game.add.existing(this);
  }

  canPhaseDown() {
    return false;
  }

  canPhaseUp() {
    return false;
  }

}

module.exports = Collectable;
