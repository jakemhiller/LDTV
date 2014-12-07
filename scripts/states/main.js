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

  createPlatforms() {
    this.platforms = new Platforms();

    this.platforms.add({
      x: 0,
      y: pY,
      w: game.world.width,
      h: platHeight,
      color: colors[i]
    });
  }

  create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.platforms = new Platforms();
    this.collectables = new Collectables();

    this.groundPlatform = new Solid({
      x: 0,
      y: game.world.height - 2,
      h: 2,
      w: game.world.width,
      color: 'red'
    });

    this.player = new Player({
      y: game.world.height - (35 + this.groundPlatform.body.height),
      color: '#FFFFFF'
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

    this.currentChannel = this.nextChannel = 0

    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.changeChannel, this); 
  }

  changeChannel() {
    this.nextChannel = this.currentChannel + 1;
    if (this.nextChannel >= 3) {
      this.nextChannel = 0
    }
  }

  collect(player, item) {
    item.kill();
  }

  update() {
    game.physics.arcade.collide(this.player.instance, this.groundPlatform.instance);

    game.physics.arcade.overlap(this.player.instance, this.collectables.group, this.collect, null, this);

    game.physics.arcade.collide(this.collectables.group, this.platforms.group);

    var pVelo = this.player.body.velocity;

    var xSpeed = 25;
    var ySpeed = 550;
    var xSmooth = 20;

    if (this.playerScale < 0) {
      this.player.instance.kill()
    };

    game.physics.arcade.collide(this.player.instance, this.platforms.group, _.noop, function(a, b) {
      // Check if collision turned off for either object
      if (!this.player.canCollide() || !this.platforms.canCollide()) {
        return false;
      }

      if (this.platforms.canPhaseDown() && this.player.canPhaseDown()) {
        return false;
      } else if (this.platforms.canPhaseUp() && this.player.canPhaseUp()) {
        return false;
      }

      return true;
    }, this);

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
      console.log(this.currentChannel)
    }
  }

  render() {
    game.debug.bodyInfo(this.player, 32, 64);
    game.debug.spriteBounds(this.player.instance, 'red', false);
  }
}

module.exports = MainState;
