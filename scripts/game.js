// jshint esnext:true

module.exports = new Phaser.Game(
  560, // Width
  420, // Height Math.round((9/16) * 800)
  Phaser.CANVAS, // CANVAS / AUTO
  'game'
);


// jshint esnext:true

// var wHeight = window.innerHeight;
// var wWidth  = window.innerWidth;

// var maxHeight = (wHeight - 40);
// var maxWidth = (wWidth - 40);

// var baseWidth = maxWidth;
// var baseHeight = ((9/16) * baseWidth);

// if (baseHeight > maxHeight) {
//     baseHeight = maxHeight;
//     baseWidth = Math.round((16/9) * maxHeight);
// }

// module.exports = new Phaser.Game(
//   baseWidth, // Width
//   baseHeight, // Height
//   Phaser.CANVAS, // CANVAS / AUTO
//   'game'
// );
