// jshint esnext:true

class Sprite extends Phaser.Sprite {

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

module.exports = Sprite;
