// jshint esnext:true
var _          = require('lodash');
var Sprite     = require('./sprite');
var helpers    = require('helpers');
var game       = require('game');

class Player extends Sprite {

  defaults() {
    return {
      name: 'Player',
      x: Math.round(game.world.width/2),
      y: game.world.height,
      w: 30,
      h: 30,
      color: 'red'
    };
  }

  constructor(game, options) {
    options = _.extend({}, this.defaults(), options);

    super(game, options.x, options.y, 'circle');

    this.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(this);

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

  isTouching(direction='down') {
    return this.body.touching[direction] || this.body.blocked[direction];
  }

  canCollide() {
    return true;
  }

  canPhaseDown() {
    return (this.body.velocity.y > 0 && game.state.getCurrentState().cursors.down.isDown);
  }

  canPhaseUp() {
    return (this.body.velocity.y < 0 && game.state.getCurrentState().cursors.up.isDown);
  }
}

module.exports = Player;
