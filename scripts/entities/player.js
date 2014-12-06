// jshint esnext:true
var _          = require('lodash');
var BaseEntity = require('./base');
var helpers    = require('helpers');
var game       = require('game');

class Player extends BaseEntity {

  defaults() {
    return {
      x: Math.round(game.world.width/2),
      y: game.world.height,
      w: 30,
      h: 30,
      color: 'red'
    };
  }

  initialize(options) {
    console.log('initialize player');

    options = _.extend({}, this.defaults(), options);

    this.instance = game.add.sprite(
      options.x,
      options.y,
      'circle'
    );

    this.instance.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(this.instance);

    this.body = this.instance.body;

    this.body.bounce.y           = 0.2;
    this.body.bounce.x           = 0.2;
    this.body.gravity.y          = 1500;
    this.body.maxVelocity.y      = 5000;
    this.body.maxVelocity.x      = 400;
    this.body.collideWorldBounds = true;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }

  isOnFloor() {
    return this.instance.body.touching.down;
  }

}

module.exports = Player;
