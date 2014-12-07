// jshint esnext:true

var _         = require('lodash');
var PhaserDebug = require('phaser-debug');

var BaseState = require('states/base');
var game      = require('game');
var helpers   = require('helpers');

var Player    = require('entities/player');
var Solid     = require('entities/solid');
var Platforms = require('entities/platforms');
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
    game.stage.backgroundColor = '#000';
    game.load.image('circle', '/assets/images/circle.svg');

    game.load.tilemap('platforms', 'assets/tilemaps/ldtv/basic.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('sprite-channel-0', 'assets/tilemaps/ldtv/basic-blue.png');
    game.load.image('sprite-channel-1', 'assets/tilemaps/ldtv/basic-red.png');
    game.load.image('sprite-channel-2', 'assets/tilemaps/ldtv/basic-blue.png');
  }

  create() {
    this.game.plugins.add(PhaserDebug);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = game.add.tilemap('platforms');
    this.map.addTilesetImage('basic-blue', 'sprite-channel-0');

    // this.mapLayer = this.map.createLayer('Blue Platforms');
    // this.mapLayer.resizeWorld();
    this.map.setCollisionBetween(0, 1000);

    this.groundPlatform = new Solid({
      x: 0,
      y: game.world.height - 2,
      h: 2,
      w: game.world.width,
      color: 'red'
    });

    this.player = new Player(game, {
      x: 20,
      y: 375,
      color: '#FFFFFF'
    });

    var platHeight = Math.round((game.world.height - this.groundPlatform.body.height) / 5);
    var platY      = platHeight;
    var platCount  = 5;

    var colors = ['#5D2EFF', '#844BFF', '#AE63FF', '#CF71FF', '#EF7AFF'];
    var collPositions = [];

    this.platforms = game.add.group();
    for (var i = 0; i <= platCount; i++) {
      platY = (platHeight * (i+1));
      var pY = game.world.height - (platY + this.groundPlatform.body.height);
      collPositions.push(pY + (platHeight / 2));
      // var platform = new Platforms(game, 0, pY, {
      //   x: 0,
      //   y: pY,
      //   w: game.world.width,
      //   h: platHeight,
      //   color: colors[i]
      // });
      // this.platforms.add(platform);
    }

    this.collectables = game.add.group();
    var collCount = 10;
    for (var i = 0; i <= collCount; i++) {
      platY = (platHeight * (i+1));
      var collectable = new Collectables(game, {
        x: i * Math.round(game.world.width / collCount),
        y: collPositions[Math.floor(Math.random()*collPositions.length)],
        w: 20,
        h: 20
      });
      this.collectables.add(collectable);
    }

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
    console.log("collect");
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
    // tilemap
    game.physics.arcade.collide(this.player, this.mapLayer);
    game.physics.arcade.collide(this.collectables, this.mapLayer);

    game.physics.arcade.collide(this.player, this.groundPlatform.instance);

    game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);

    game.physics.arcade.collide(this.collectables, this.platforms, _.noop, this.collide);

    var pVelo = this.player.body.velocity;

    var xSpeed = 25;
    var ySpeed = 550;
    var xSmooth = 20;

    game.physics.arcade.collide(this.player, this.platforms, _.noop, this.collide)

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