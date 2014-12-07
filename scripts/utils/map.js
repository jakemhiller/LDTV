var _    = require('lodash');
var game = require('game');

var MapUtils = {
    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjects: function(map, layer, type) {
    var result = [];
    console.log(layer, map.objects[layer]);
    map.objects[layer].forEach(function(element){

      //omit type to include all objects in layer
      if (!type) {
        result.push(element);
      } else if ((element.type === type) || (element.properties.type === type)) {
        result.push(element);
      }

    });
    return result;
  },

  createFromObject: function(element, group, Entity) {
    var sprite;
    var props;

    if (Entity) {

      props = _.extend({
        x: element.x,
        y: element.y,
        w: element.width,
        h: element.height
      }, element.properties);

      sprite = new Entity(game, props);
      group.add(sprite);
    } else {

      sprite = group.create(element.x, element.y, element.properties.sprite);
      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
    }
  }
};

module.exports = MapUtils;
