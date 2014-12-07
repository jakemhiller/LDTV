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

  canCollide() {
    return true;
  }

  canPhaseDown() {
    return false;
  }

  canPhaseUp() {
    return true;
  }
}

module.exports = BaseEntity;
