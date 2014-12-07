// jshint esnext:true
var game = require('game');

class Helpers {
  createBlock(sizew, sizeh, color) {
    var bmd = game.add.bitmapData(sizew, sizeh);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fillRect(0,0, sizew, sizeh);
    return bmd;
  }

  createCircle(sizew, sizeh, color) {
    var bmd = game.add.bitmapData(sizew, sizeh);
    bmd.ctx.beginPath();
    bmd.ctx.arc(sizeh/2, sizew/2, sizeh/2, 0, 2*Math.PI, false);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fill();
    return bmd;
  }

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType(type, map, layer) {
    var result = [];
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  }

  createFromTiledObject(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  }
}

module.exports = new Helpers();
