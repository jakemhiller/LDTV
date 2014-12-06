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
      w: 200,
      h: 20,
      color: 'white'
    };
  }

  initialize(options) {
    console.log('initialize platforms');
    options = _.extend({}, this.defaults(), options);
    this.group = game.add.group();
  }

  add(options) {
    console.log('added platform');
    options = _.extend({}, this.entity_defaults(), options);

    var sprite = game.add.sprite(
      options.x,
      options.y,
      helpers.createBlock(options.w, options.h, options.color)
    );

    game.physics.arcade.enableBody(sprite);

    sprite.body.immovable = true;

    this.group.add(sprite);
  }

}

module.exports = Platforms;
