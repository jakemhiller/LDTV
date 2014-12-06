// jshint esnext:true

var _         = require('lodash');
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
  }

  preload() {
    game.stage.backgroundColor = '#000';
    game.load.image('circle', '/assets/images/circle.svg');
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.platforms = new Platforms();
    this.collectables = new Collectables();
    var groundHeight = 20;

    this.player = new Player({
      y: game.world.height - 35,
      color: '#FFFFFF'
    });

    this.groundPlatform = new Solid({
      y: game.world.height - 20,
      w: game.world.width,
      h: 20,
      color: '#3E0F7B' // #870CFF
    });

    var platHeight = Math.round((game.world.height - this.groundPlatform.body.height) / 5);
    var platY      = platHeight;
    var platCount  = 5;

    var colors = ['#5D2EFF', '#844BFF', '#AE63FF', '#CF71FF', '#EF7AFF'];
    var collPositions = [];

    for (var i = 0; i <= platCount; i++) {
      platY = (platHeight * (i+1));
      var pY = game.world.height - (platY + this.groundPlatform.body.height);
      collPositions.push(pY + (platHeight / 2));
      this.platforms.add({
        x: 0,
        y: pY,
        w: game.world.width,
        h: platHeight,
        color: colors[i]
      });
    }

    var collCount = 10;

    for (var i = 0; i <= collCount; i++) {
      platY = (platHeight * (i+1));
      this.collectables.add({
        x: i * Math.round(game.world.width / collCount),
        y: collPositions[Math.floor(Math.random()*collPositions.length)],
        w: 20,
        h: 20
      });
    }

    this.cursors = game.input.keyboard.createCursorKeys();
  }

  shouldPhasePlatforms() {
    return (this.cursors.down.isDown);
  }

  collect(player, item) {
    item.kill();
  }

  update() {
    game.physics.arcade.collide(this.player.instance, this.groundPlatform.instance);

    game.physics.arcade.overlap(this.player.instance, this.collectables.group, this.collect, null, this);

    var pVelo = this.player.body.velocity;

    var xSpeed = 25;
    var ySpeed = 550;
    var xSmooth = 20;

    if (pVelo.y > 0 && !this.shouldPhasePlatforms()) {
      // Collide with platforms if above them and not pressing down
      game.physics.arcade.collide(this.player.instance, this.platforms.group, _.noop, function() {
        return !this.shouldPhasePlatforms();
      }, this);
    }

    var onFloor = this.player.isOnFloor();

    if (this.cursors.left.isDown) {
      // stop right momentum
      if (pVelo.x > 0) {
        pVelo.x = 0;
      }
      pVelo.x += -xSpeed;

    } else if (this.cursors.right.isDown) {
      // stop left momentum
      if (pVelo.x < 0) {
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
      var modifier = this.cursors.up.duration;
      pVelo.y = -ySpeed;
    }
  }

  render() {
    game.debug.bodyInfo(this.player, 32, 64);
    game.debug.spriteBounds(this.player.instance, 'red', false);
  }

}

module.exports = MainState;
