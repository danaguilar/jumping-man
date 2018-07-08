//this game will have only 1 state
var GameState = {

  //initiate game settings
  init: function() {
    //adapt to screen size, fit all the game
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //Set physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;

    //Set world bounds
    this.game.world.setBounds(0,0,360,700); 

    //Set game constants
    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 550;
  },



  //load the game assets before the game starts
  preload: function() {
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('goal', 'assets/images/gorilla3.png');
    this.load.image('arrowButton', 'assets/images/arrowButton.png');
    this.load.image('actionButton', 'assets/images/actionButton.png');
    this.load.image('barrel', 'assets/images/barrel.png');

    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', 28, 30, 5, 1, 1);
    this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', 20, 21, 2, 1, 1);

    this.load.text('level', 'assets/data/level.json');
  },
  //executed after everything is loaded
  create: function() {
    // parse level data
    this.levelData = JSON.parse(this.game.cache.getText('level'));

    //create ground
    this.ground = this.add.sprite(0, 630, 'ground');
    this.game.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    //create platforms
    const platformData = [
      { "x": 0, "y": 430 },
      { "x": 45, "y": 560 },
      { "x": 90, "y": 290 },
      { "x": 0, "y": 140 }
    ]
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.levelData.PlatformData.forEach((data) => {
      this.platforms.create(data.x, data.y, 'platform');
    }, this)
    this.platforms.setAll('body.allowGravity', false);
    this.platforms.setAll('body.immovable', true);

    //create player
    this.player = this.add.sprite(this.levelData.PlayerStart.x, this.levelData.PlayerStart.y, 'player', 3);
    this.player.anchor.setTo(0.5);
    this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.body.velocity.x = 0;

    //Set camera controls
    this.game.camera.follow(this.player);

    //create keyboard controls
    this.cursors = this.game.input.keyboard.createCursorKeys();


  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.ground, this.stopPlayer);
    this.game.physics.arcade.collide(this.player, this.platforms, this.stopPlayer);

    //On left key down
    if(this.cursors.left.isDown) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.animations.play('walking');
      if(this.player.scale.x < 0){
        this.player.scale.x *= -1;
      }
    }
    //On right key down
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.animations.play('walking');
      if(this.player.scale.x > 0){
        this.player.scale.x *= -1;
      }
    }
    else {
      this.player.body.velocity.x = 0;
      this.player.frame = 3;
    }

    if(this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
    }
  },

  stopPlayer: function(player, ground) {
    player.body.velocity.y = 0;
  }

};

//initiate the Phaser framework
var game = new Phaser.Game(360, 592, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
