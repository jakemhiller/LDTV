// jshint esnext:true
var game = require('game');

var Utils = {
  createBlock: function(sizew, sizeh, color) {
    var bmd = game.add.bitmapData(sizew, sizeh);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fillRect(0,0, sizew, sizeh);
    return bmd;
  },

  createCircle: function(sizew, sizeh, color) {
    var bmd = game.add.bitmapData(sizew, sizeh);
    bmd.ctx.beginPath();
    bmd.ctx.arc(sizeh/2, sizew/2, sizeh/2, 0, 2*Math.PI, false);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fill();
    return bmd;
  }
};

module.exports = Utils;
