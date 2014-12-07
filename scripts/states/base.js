// jshint esnext:true


class BaseState {
  constructor(name) {
    this.name = name;
    this.game = require('game');
    this.initialize();
  }

  initialize() {}
}

module.exports = BaseState;
