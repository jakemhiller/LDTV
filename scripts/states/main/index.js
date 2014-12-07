
var _           = require('lodash');
var PhaserDebug = require('phaser-debug');

var BaseState = require('states/base');
var game      = require('game');

var mapUtils  = require('utils/map');

var Player       = require('entities/player');

var Platforms    = require('entities/platforms');
var Collectables = require('entities/collectables');

class MainState extends BaseState {

  initialize() {
    this.platforms = null;
    this.player    = null;
    this.cursors   = null;
    this.scoretext = null;
    this.timer = 0;

    this.score             = 0;
    this.countPlatforms    = 12;
    this.maxPlatformHeight = 0;
    this.baseGravity       = 0;

    console.log(this);
  }

  preload() {
    game.stage.backgroundColor = '#fff';
    game.load.image('circle', '/assets/images/circle.svg');

    game.load.tilemap('platforms', 'assets/tilemaps/ldtv/basic.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('sprite-channel-0', 'assets/tilemaps/ldtv/basic-blue.png');
    game.load.image('sprite-channel-1', 'assets/tilemaps/ldtv/basic-red.png');
    game.load.image('sprite-channel-2', 'assets/tilemaps/ldtv/basic-blue.png');

    game.load.spritesheet('background', 'assets/tilemaps/ldtv/bg-sprite.png', 20, 20, 3);
  }


  createPlayer() {
    var playerPosition = mapUtils.findObjects(this.map, 'PlayerData', 'playerStart');

    return new Player(game, {
      x: playerPosition[0].x,
      y: playerPosition[0].y,
      color: '#FFFFFF'
    });
  }

  createGroup(layer, Entity) {
    var group = game.add.group();
    var elementData = mapUtils.findObjects(this.map, layer);

    _.each(elementData, function(element) {
      mapUtils.createFromObject(element, group, Entity);
    }, this);

    return group;
  }

  create() {
    this.game.plugins.add(PhaserDebug);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');
    this.background.frame = 2;

    this.map = game.add.tilemap('platforms');

    this.player       = this.createPlayer();
    this.platforms    = this.createGroup('Platforms', Platforms);
    this.collectables = this.createGroup('Collectables', Collectables);

    this.cursors = game.input.keyboard.createCursorKeys();

    this.currentChannel = this.nextChannel = 0;

    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.changeChannel, this);
  }

  changeChannel() {
    this.nextChannel = this.currentChannel + 1;
    if (this.nextChannel >= 3) {
      this.nextChannel = 0;
    }
  }

  collect(player, item) {
    console.log('collect');
    item.kill();
  }

  collide(a, b) {
    // Check if collision turned off for either object
    if (!a.canCollide() || !b.canCollide()) {
      return false;
    }

    if (a.canPhaseDown() && b.canPhaseDown()) {
      return false;
    } else if (a.canPhaseUp() && b.canPhaseUp()) {
      return false;
    }

    return true;
  }

  update() {
    game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);

    game.physics.arcade.collide(this.collectables, this.platforms, _.noop, this.collide);

    var pVelo = this.player.body.velocity;

    var xSpeed = 25;
    var ySpeed = 550;
    var xSmooth = 20;

    game.physics.arcade.collide(this.player, this.platforms, _.noop, this.collide);

    var onFloor = this.player.isTouching('down');

    if (this.cursors.left.isDown) {
      // stop right momentum
      if (pVelo.x > 0 || this.player.isTouching('left')) {
        pVelo.x = 0;
      }
      pVelo.x += -xSpeed;

    } else if (this.cursors.right.isDown) {
      // stop left momentum
      if (pVelo.x < 0 || this.player.isTouching('right')) {
        pVelo.x = 0;
      }

      pVelo.x += xSpeed;

    } else if (onFloor) {
      pVelo.y = 0;
      if (pVelo.x > 0 && !((pVelo.x - xSmooth) <= 0)) {
        pVelo.x -= xSmooth;
      } else if (pVelo.x < 0 && !((pVelo.x + xSmooth) >= 0)) {
        pVelo.x += xSmooth;
      } else {
        pVelo.x = 0;
      }

    }

    if (this.cursors.up.isDown && onFloor) {
      pVelo.y = -ySpeed;
    }

    // Change Channel
    if (this.nextChannel != this.currentChannel) {
      this.currentChannel = this.nextChannel;
      console.log(this.currentChannel);
    }
  }

  render() {
    if (this.player) {
      game.debug.text(this.player.body.touching.down ? 'touching down' : '', 10, 10);
      game.debug.text(this.player.body.blocked.down ? 'blocked down' : '', 10, 30);
    }
    game.debug.spriteBounds(this.player, 'red', false);
  }
}

module.exports = MainState;
