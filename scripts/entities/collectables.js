// jshint esnext:true
var _          = require('lodash');
var BaseEntity = require('./base');
var helpers    = require('helpers');
var game       = require('game');

class Platforms extends BaseEntity {

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

  initialize(options) {
    options = _.extend({}, this.defaults(), options);
    this.group = game.add.group();
  }

  add(options) {

    options = _.extend({}, this.entity_defaults(), options);

    var sprite = game.add.sprite(
      options.x,
      options.y,
      helpers.createBlock(options.w, options.h, options.color)
    );

    game.physics.arcade.enableBody(sprite);

    sprite.body.bounce.y           = 0.2;
    sprite.body.bounce.x           = 0.2;
    sprite.body.gravity.y          = 1500;
    sprite.body.maxVelocity.y      = 5000;
    sprite.body.maxVelocity.x      = 400;
    sprite.body.collideWorldBounds = true;
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    this.group.add(sprite);
  }

}

module.exports = Platforms;
