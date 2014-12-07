// jshint esnext:true
var _          = require('lodash');
var BaseEntity = require('./base');
var utils      = require('utils');
var game       = require('game');

class Platform extends BaseEntity {

  defaults() {
    return {
      x: 0,
      y: 0,
      w: 200,
      h: 50,
      color: 'white'
    };
  }

  initialize(options) {
    console.log('create solid');
    options = _.extend({}, this.defaults(), options);

    this.instance = game.add.sprite(
      options.x,
      options.y,
      utils.createBlock(options.w, options.h, options.color)
    );

    game.physics.arcade.enableBody(this.instance);

    this.body           = this.instance.body;
    this.body.immovable = true;
  }
}

module.exports = Platform;
