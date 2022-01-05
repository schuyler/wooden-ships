var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var ship;
var map;
var layer;
var cursors;
var theta;

function preload () {
  this.load.spritesheet('ship', 'tiny-islands.png', {frameWidth: 16, frameHeight: 16});
  this.load.image('tiles', 'tiny-islands.png');
}

function create () {
  map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 50, height: 38 });
  var tiles = map.addTilesetImage("tiles");

  layer = map.createBlankLayer("ocean", tiles);
  layer.randomize(0, 0, map.width, map.height, [31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 32, 33, 34, 35, 36]);

  ship = this.physics.add.sprite(400, 300, 'ship', 132);
  // ship.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();
}

var lastTime = 0;
function update(time, delta) {
  if (cursors.left.isDown) {
    ship.body.angularVelocity = -200
  } else if (cursors.right.isDown) {
    ship.body.angularVelocity = 200
  } else {
    ship.body.angularVelocity = 0;
  }

  if (cursors.up.isDown) {
    this.physics.velocityFromAngle(ship.angle + 90, 100, ship.body.acceleration);
  } else {
    ship.body.setAcceleration(0, 0);
  }

  this.physics.world.wrap(ship);
}
