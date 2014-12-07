
var MapUtils = {
    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjects: function(map, layer, type) {
    var result = [];
    map.objects[layer].forEach(function(element){
      if(type && (element.type === type) || (element.properties.type === type)) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      } else if (!type) {
        // omit type to include all objects
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  },

  createFromObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  }
};

module.exports = MapUtils;
