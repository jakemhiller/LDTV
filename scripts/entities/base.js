// jshint esnext:true
//
class BaseEntity {
  constructor(options = {}) {
    this.instance = (options.instance || null);
    this.game = require('game');
    this.initialize(options);
  }

  initialize(options) {

  }
}

module.exports = BaseEntity;
