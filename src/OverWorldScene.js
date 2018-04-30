import Mario from './sprites/Mario'
import Enemy from './sprites/Enemy'
import PowerUp from './sprites/PowerUp'
import Projectile from './Projectile'
import SMBTileSprite from './sprites/SMBTileSprite'
import makeAnimations from './helpers/animations'
import AnimatedTiles from 'phaser-animated-tiles'
import worlds from './worlds'
import enemies from './enemies'

class OverWorldScene extends Phaser.Scene {
    constructor(config) {
        super({
            key: 'OverWorldScene'
        });
        this.worldName = ""
        this.leftNeighbor = ""
        this.rightNeighbor = ""
        this.newScene = true
    }

    preload() {
        //preload all of the scenes next to the tiles I want to go to
        console.log("preload")

        this.worldName = this.scene.settings.data.tileMap

        console.log(this.worldName)

        // for now we are loading this one
        this.load.tilemapTiledJSON(this.worldName, 'assets/tilemaps/' + this.worldName + '.json')

        this.leftNeighbor = worlds[this.worldName].leftNeighbor
        this.rightNeighbor = worlds[this.worldName].rightNeighbor

        this.entryPoint = worlds[this.worldName].entryPoint
        this.from = this.scene.settings.data.from

        console.log(this.from)
        // this.pixelArt = true

    }

    create() {
      console.log("cleaning up")
          // this.cleanUp(); // necessary??

      // console.log(this)
      // console.log(this.scene.settings.data)   

      // if (this.registry.get('attractMode')) {
      //   this.attractMode = {
      //     recording: this.sys.cache.json.entries.entries.attractMode,
      //     current: 0,
      //     time: 0
      //   }
      // }
      // else {
      // this.attractMode = null;
      // }

      console.log(this.worldName)
      console.log(this.leftNeighbor)
      console.log(this.rightNeighbor)

      // Install AnimatedTiles plugin to allow to use it
      // move???
      this.sys.install('AnimatedTiles');

      // Places to warp to (from pipes)
      this.destinations = {};

      // need to add destinations above from config
      // ******************************************


      // Array of rooms to keep bounds within to avoid the need of multiple tilemaps per level.
      this.rooms = [];
      // Running in 8-bit mode
      // this.eightBit = true;

      // Add and play the music
      // this.music = this.sound.add('overworld');
      // this.music.play({ loop: true });

      // Define all sprite animations we'll use
      makeAnimations(this);

      // Add the map 
      this.map = this.make.tilemap({
          key: this.worldName
      });
      console.log("thismap")
      console.log(this.map)
      this.tileset = this.map.addTilesetImage('super-mario-16bit', 'tiles-16bit');

      console.log(this.tileset)

      // Dynamic layer because we want breakable and animated tiles
      console.log(worlds[this.worldName])
      if(worlds[this.worldName].farBackground)
      this.farBackground = this.map.createDynamicLayer('farBackground', this.tileset, 0, 0).setScrollFactor(.4,.4)
      if(worlds[this.worldName].middleBackground)
      this.middleBackground = this.map.createDynamicLayer('middleBackground', this.tileset, 0, 0).setScrollFactor(.6,.6)
      this.groundLayer = this.map.createDynamicLayer('groundLayer', this.tileset, 0, 0)
      if(worlds[this.worldName].exitLayer)
      this.exitLayer = this.map.createDynamicLayer('exitLayer', this.tileset, 0, 0)


      console.log(this.groundLayer)
          // We got the map. Tell animated tiles plugin to loop through the tileset properties and get ready.
          // We don't need to do anything beyond this point for animated tiles to work.
      this.sys.animatedTiles.init(this.map);

      // Probably not the correct way of doing this:
      // this.physics.world.bounds.width = this.groundLayer.width;

      // Add the background as an tilesprite. TODO: Not working since beta 20
      // let tileSprite = this.add.tileSprite(0, 0, this.groundLayer.width, 500, 'background-clouds');

      this.projectiles = this.add.group({
          classType: Projectile,
          runChildUpdate: true,
          maxSize: 20
      })

      console.log(this.projectiles)

      // Set collision by property
      this.groundLayer.setCollisionByProperty({
          collide: true
      });

      // if(this.exitLayer)
      // this.exitLayer.setCollisionByProperty({
          // locked: false
      // });

      console.log("!!!")
      console.log("!!!")
      console.log("!!!")
      console.log("!!!")
      // console.log(this.exitLayer)


      // CREATE MARIO!!!
      console.log(this.mario)

      if(!this.mario){
        // alert("newmario")
        this.mario = new Mario({
          scene: this,
          key: 'mario',
          x: this.groundLayer.width - 24, // 3500, 
          y: this.groundLayer.height - 16 - 16
        })
      } else {
        // alert("oldmario")
        if(this.from === 'left'){
          this.mario.x = 8
          this.physics.world.enable(this.mario)
          this.add.existing(this.mario)
        } else if(this.from === 'right'){
          this.mario.x = this.groundLayer.width - 16
          this.physics.world.enable(this.mario)
          this.add.existing(this.mario)
        } else {

        }
      }
      console.log(this.mario)

      this.gfx = this.add.graphics(0, 0)

      console.log(this.scene)

      

      this.background = this.map.createDynamicLayer('background', this.tileset, 0, 0)

      console.log(this.background)

      // This group contains all enemies for collision and calling update-methods
      this.enemyGroup = this.add.group()

      // The map has one object layer with enemies as stamped tiles, 
      // each tile has properties containing info on what enemy it represents.

      // This can work with the update, just need to request this from a database instead of 
      // getting it from the tilemap, more configurable this way. Can even randomly place 
      // items this new way.
      // request.getConfig(function(items){})
      // .objects.forEach(  
      // (enemy) => {
      // worlds.enemies
      // let enemyObject;
      for (let enemy in worlds[this.worldName].enemies) {
          for (let i = 0; i < worlds[this.worldName].enemies[enemy]; i++) {

              //       this.groundLayer.height
              //       this.groundLayer.width
              // switch (enemy) {
              //   case "goomba":
              this.enemyGroup.add(new Enemy({
                      scene: this,
                      key: 'sprites16',
                      x: Math.random() * this.groundLayer.width,
                      y: Math.random() * this.groundLayer.height - 16,
                      type: enemy,
                      details: enemies[enemy]
                  }))
                  // }
                  //         // enemyObject = new Goomba({
                  //         //   scene: this,
                  //         //   key: 'sprites16',
                  //         //   x: enemy.x,
                  //         //   y: enemy.y
                  //         // });
                  //     break
                  //   case "turtle":
                  //     this.enemyGroup.add(new Enemy({
                  //       scene: this,
                  //       key: 'mario-sprites',
                  //       x: Math.random() * this.groundLayer.width,
                  //       y: Math.random() * this.groundLayer.height - 16,
                  //       anims: 'turtle'
                  //     }))
                  //     break
                  //   default:
                  //     console.error("Unknown:", this.tileset.tileProperties[enemy.gid - 1]);
                  //     break
                  // }
          }
      }

      // A group powerUps to update
      this.powerUps = this.add.group();

      // The map has an object layer with "modifiers" that do "stuff", see below
      // this.map.getObjectLayer("modifiers").objects.forEach((modifier) => {
      //   let tile, properties, type;
      //   // Get property stuff from the tile if present or just from the object layer directly
      //   if (typeof modifier.gid !== "undefined") {
      //     properties = this.tileset.tileProperties[modifier.gid - 1];
      //     type = properties.type;
      //     if (properties.hasOwnProperty("powerUp")) {
      //       type = "powerUp";
      //     }
      //   }
      //   else {
      //     type = modifier.properties.type;
      //   }

      //   switch (type) {
      //     case "powerUp":
      //       // Modifies a questionmark below the modifier to contain something else than the default (coin)
      //       tile = this.groundLayer.getTileAt(modifier.x / 16, modifier.y / 16 - 1);
      //       tile.powerUp = properties.powerUp;
      //       tile.properties.callback = "questionMark";
      //       if (!tile.collides) {
      //         // Hidden block without a question mark
      //         tile.setCollision(false, false, false, true);
      //       }
      //       break;
      //     case "pipe":
      //       // Adds info on where to go from a pipe under the modifier
      //       tile = this.groundLayer.getTileAt(modifier.x / 16, modifier.y / 16);
      //       tile.properties.dest = parseInt(modifier.properties.goto);
      //       break;
      //     case "dest":
      //       // Adds a destination so that a pipe can find it
      //       this.destinations[modifier.properties.id] = { x: modifier.x + modifier.width / 2, top: (modifier.y < 16) };
      //       break;
      //     case "room":
      //       // Adds a "room" that is just info on bounds so that we can add sections below pipes 
      //       // in an level just using one tilemap.
      //       this.rooms.push({ x: modifier.x, width: modifier.width, sky: modifier.properties.sky });
      //       break;
      //   }

      // }
      // );

      // this.keys will contain all we need to control Mario.
      // Any key could just replace the default (like this.key.jump)
      this.keys = {
          up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
          jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
          down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
          shoot: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
      };

      console.log(this.groundLayer.height)
      console.log(this.groundLayer.width)

      this.cameras.main.setBounds(0, 0, this.groundLayer.width, this.groundLayer.height)
          // this.cameras.main.setSize() // maybe not have a fixed size?
          // this.cameras.main.setSize(2000, 1200); // fixed size messes everything up, too small is bad,
          //                                           need to do more research ////////////////////////
      this.cameras.main.startFollow(this.mario)
      this.cameras.main.setBackgroundColor('#2471A3'); //Blue sky

      console.log(this.cameras.main)

      // An emitter for bricks when blocks are destroyed.
      this.blockEmitter = this.add.particles('mario-sprites');

      this.blockEmitter.createEmitter({
          frame: {
              frames: ["brick"],
              cycle: true
          },
          gravityY: 1000,
          lifespan: 2000,
          speed: 400,
          angle: {
              min: -90 - 25,
              max: -45 - 25
          },
          frequency: -1,
      });

      // Used when hitting a tile from below that should bounce up.
      this.bounceTile = new SMBTileSprite({
          scene: this,
      })

      // Hack to get sprite's destroy method to function.
      //????????????????????????????????????????????
      this.sys.physicsManager = this.physics.world;


      // let hud = this.add.bitmapText(5 * 8, 8, 'font', "MARIO                      TIME", 8);
      // hud.setScrollFactor(0, 0);
      this.levelTimer = {
              // textObject: this.add.bitmapText(36 * 8, 16, 'font', "255", 8),
              time: 150 * 1000,
              displayedTime: 255,
              hurry: false
          }
          // this.levelTimer.textObject.setScrollFactor(0, 0);
          // this.score = {
          // pts: 0,
          // textObject: this.add.bitmapText(5 * 8, 16, 'font', "000000", 8)
          // }
          // this.score.textObject.setScrollFactor(0, 0);

      // if (this.attractMode) {
      //   hud.alpha = 0;
      //   this.levelTimer.textObject.alpha = 0;
      //   this.score.textObject.alpha = 0;
      // }

      // Prepare the finishLine
      // let worldEndAt = -1;
      // for (let x = 0; x < this.groundLayer.width; x++) {
      //   let tile = this.groundLayer.getTileAt(x, 2);
      //   if (tile && tile.properties.worldsEnd) {
      //     worldEndAt = tile.pixelX;
      //     break;
      //   }
      // }
      // this.finishLine = {
      //   x: worldEndAt,
      //   flag: this.add.sprite(worldEndAt + 8, 4 * 16),
      //   active: false
      // }
      // this.finishLine.flag.play("flag");

      // Set bounds for current room
      this.mario.setRoomBounds(this.rooms);

      // Touch controls is really just a quick hack to try out performance on mobiles,
      // It's not itended as a suggestion on how to do it in a real game.
      // let jumpButton = this.add.sprite(350, 180);
      // jumpButton.play("button");
      // let dpad = this.add.sprite(20, 170);
      // dpad.play("dpad");
      // this.touchControls = {
      //   dpad: dpad,
      //   abutton: jumpButton,
      //   left: false,
      //   right: false,
      //   down: false,
      //   jump: false,
      //   visible: false
      // }
      // jumpButton.setScrollFactor(0, 0);
      // jumpButton.alpha = 0;
      // jumpButton.setInteractive();
      // jumpButton.on('pointerdown', (pointer) => {
      //   this.touchControls.jump = true;
      // });
      // jumpButton.on('pointerup', (pointer) => {
      //   this.touchControls.jump = false;
      // });
      // dpad.setScrollFactor(0, 0);
      // dpad.alpha = 0;
      // dpad.setInteractive();
      // dpad.on('pointerdown', (pointer) => {
      //   let x = dpad.x + dpad.width - pointer.x;
      //   let y = dpad.y + dpad.height - pointer.y;
      //   console.log(x, y);
      //   if (y > 0 || Math.abs(x) > -y) {
      //     if (x > 0) {
      //       console.log('going left');
      //       this.touchControls.left = true;
      //     }
      //     else {
      //       console.log('going right')
      //       this.touchControls.right = true;
      //     }
      //   } else {
      //     this.touchControls.down = true;
      //   }
      // });
      // dpad.on('pointerup', (pointer) => {
      //   this.touchControls.left = false;
      //   this.touchControls.right = false;
      //   this.touchControls.down = false;
      // });
      // window.toggleTouch = this.toggleTouch.bind(this);

      this.cameras.main.roundPixels = true;

      // Hide stuff while in attract mode
      // if (this.attractMode) {
      //   hud.alpha = 0;
      //   this.levelTimer.textObject.alpha = 0;
      //   this.score.textObject.alpha = 0;
      //   this.music.volume = 0;
      // }


      // If the game ended while physics was disabled
      this.physics.world.resume();

      console.log("where???")


      this.healthText = this.add.bitmapText(20, 8, 'font', 'HEALTH ' + this.mario.health).setScrollFactor(0)
      this.ammoText = this.add.bitmapText(20, 24, 'font', 'AMMO ' + this.mario.ammo).setScrollFactor(0)
    }

    update(time, delta) {
        // Avoid running updates when physics is paused
        // this.record(delta);

        /* console.log(time);*/
        // if (this.attractMode) {
        //   this.attractMode.time += delta;
        //   //console.log(this.attractMode.current);
        //   //      console.log(this.attractMode.current, this.attractMode.recording.length);

        //   if (this.mario.y > 240 || (this.attractMode.recording.length <= this.attractMode.current + 2) || this.attractMode.current === 14000) {
        //     this.attractMode.current = 0;
        //     this.attractMode.time = 0;
        //     this.mario.x = 16 * 6; // 3500, 
        //     this.tick = 0;
        //     this.registry.set('restartScene', true);

        //     //this.scene.stop();
        //     //this.scene.switch('OverWorldScene');
        //     //this.create();
        //     console.log("RESET");
        //     //        this.mario.y = this.sys.game.config.height - 48 -48
        //     //return;
        //   }

        //   if (this.attractMode.time >= this.attractMode.recording[this.attractMode.current + 1].time) {
        //     this.attractMode.current++;
        //     this.mario.x = this.attractMode.recording[this.attractMode.current].x;
        //     this.mario.y = this.attractMode.recording[this.attractMode.current].y;
        //     this.mario.body.setVelocity(this.attractMode.recording[this.attractMode.current].vx, this.attractMode.recording[this.attractMode.current].vy);

        //   }
        //   this.keys = {
        //     jump: { isDown: this.attractMode.recording[this.attractMode.current].keys.jump },
        //     jump2: {isDown: false},
        //     left: { isDown: this.attractMode.recording[this.attractMode.current].keys.left },
        //     right: { isDown: this.attractMode.recording[this.attractMode.current].keys.right },
        //     down: { isDown: this.attractMode.recording[this.attractMode.current].keys.down },

        //   }
        // }

        // this.ammoText.x = this.cameras.main.scrollX + 16
        // this.ammoText.y = this.cameras.main.scrollY + this.groundLayer.height - 180

        // this.healthText.x = this.cameras.main.scrollX + 16
        // this.healthText.y = this.cameras.main.scrollY + this.groundLayer.height - 196

        if (this.physics.world.isPaused) {
            return;
        }

        // if (this.mario.x > this.finishLine.x && this.finishLine.active) {
        //   this.removeFlag();
        //   this.physics.world.pause();
        //   return;
        // }

        // this.levelTimer.time -= delta * 2;
        // if (this.levelTimer.time - this.levelTimer.displayedTime * 1000 < 1000) {
        //   this.levelTimer.displayedTime = Math.round(this.levelTimer.time / 1000);
        //   this.levelTimer.textObject.setText(("" + this.levelTimer.displayedTime).padStart(3, "0"));
        //   if (this.levelTimer.displayedTime < 50 && !this.levelTimer.hurry) {
        //     this.levelTimer.hurry = true;
        //     this.music.pause();
        //     let sound = this.sound.addAudioSprite('sfx');
        //     sound.on('ended', (sound) => {
        //       this.music.seek = 0;
        //       this.music.rate = 1.5;
        //       this.music.resume();
        //       sound.destroy();
        //     });
        //     sound.play('smb_warning');
        //   }
        //   if (this.levelTimer.displayedTime < 1) {
        //     this.mario.die();
        //     this.levelTimer.hurry = false;
        //     this.music.rate = 1;
        //     this.levelTimer.time = 150 * 1000;
        //     this.levelTimer.displayedTime = 255;
        //   }
        // }

        // need to keep this vvvvvvvvvvvvvvvvvvvv

        // console.log('1')

        // Run the update method of Mario
        this.mario.update(this.keys, time, delta);

        // console.log('2')
        // Run the update method of all enemies
        this.enemyGroup.children.entries.forEach(
                (sprite) => {
                    sprite.update(time, delta);
                }
            )
            // console.log('3')
            // Run the update method of non-enemy sprites
        this.powerUps.children.entries.forEach(
            (sprite) => {
                sprite.update(time, delta);
            }
        )

    }

    tileCollision(sprite, tile) {
        console.log("!!!!")
        console.log(sprite)
        console.log(tile)
        if (sprite.type === "turtle") {
            if (tile.y > Math.round(sprite.y / 16)) {
                // Turtles ignore the ground
                return;
            }
        } else if (sprite.type === "mario") {
            // Mario is bending on a pipe that leads somewhere:
            if (sprite.bending && tile.properties.pipe && tile.properties.dest) {
                sprite.enterPipe(tile.properties.dest, tile.rotation);
            }
        }
        // If it's Mario and the body isn't blocked up it can't hit question marks or break bricks
        // Otherwise Mario will break bricks he touch from the side while moving up.
        if (sprite.type === "mario" && !sprite.body.blocked.up) {
            return;
        }

        // If the tile has a callback, lets fire it
        if (tile.properties.callback) {
            switch (tile.properties.callback) {
                case "questionMark":
                    // Shift to a metallic block
                    tile.index = 44;
                    // Bounce it a bit
                    sprite.scene.bounceTile.restart(tile);
                    // The questionmark is no more
                    tile.properties.callback = null;
                    // Invincible blocks are only collidable from above, but everywhere once revealed
                    tile.setCollision(true);
                    // Check powerUp for what to do, make a coin if not defined
                    let powerUp = tile.powerUp ? tile.powerUp : "coin";
                    // Make powerUp (including a coin)
                    new PowerUp({
                        scene: sprite.scene,
                        key: 'sprites16',
                        x: tile.x * 16 + 8,
                        y: tile.y * 16 - 8,
                        type: powerUp
                    });
                    break;
                case "breakable":
                    if (sprite.type === "mario" && sprite.animSuffix === "") {
                        // Can't break it anyway. Bounce it a bit.
                        sprite.scene.bounceTile.restart(tile);
                        sprite.scene.sound.playAudioSprite('sfx', 'smb_bump');
                    } else {
                        // get points
                        // sprite.scene.updateScore(50);
                        sprite.scene.map.removeTileAt(tile.x, tile.y, true, true, this.groundLayer);
                        sprite.scene.sound.playAudioSprite('sfx', 'smb_breakblock');
                        sprite.scene.blockEmitter.emitParticle(6, tile.x * 16, tile.y * 16);
                    }
                    break;
                case "toggle16bit":
                    sprite.scene.eightBit = !sprite.scene.eightBit;
                    if (sprite.scene.eightBit) {
                        sprite.scene.tileset.setImage(sprite.scene.sys.textures.get('tiles'));
                    } else {
                        sprite.scene.tileset.setImage(sprite.scene.sys.textures.get('tiles-16bit'));
                    }
                    break;
                default:
                    sprite.scene.sound.playAudioSprite('sfx', 'smb_bump');
                    break;

            }
        } else {
            sprite.scene.sound.playAudioSprite('sfx', 'smb_bump');
        }
    }

    /** To be removed, supported natively now:
     * setCollisionByProperty(map) {
      Object.keys(map.tilesets[0].tileProperties).forEach(
        (id) => {

          if (map.tilesets[0].tileProperties[id].collide) {
            map.setCollision(parseInt(id) + 1);
          }
        }
      )
    }*/

    // updateScore(score) {
    //   this.score.pts += score;
    //   this.score.textObject.setText(("" + this.score.pts).padStart(6, "0"));
    // }

    removeFlag(step = 0) {
        switch (step) {
            case 0:
                this.music.pause();
                this.sound.playAudioSprite('sfx', 'smb_flagpole');
                this.mario.play("mario/climb" + this.mario.animSuffix);
                this.mario.x = this.finishLine.x - 1;
                this.tweens.add({
                    targets: this.finishLine.flag,
                    y: 240 - 6 * 8,
                    duration: 1500,
                    onComplete: () => this.removeFlag(1)
                });
                this.tweens.add({
                    targets: this.mario,
                    y: 240 - 3 * 16,
                    duration: 1000,
                    onComplete: () => {
                        this.mario.flipX = true;
                        this.mario.x += 11;
                    }
                });
                break;
            case 1:
                let sound = this.sound.addAudioSprite('sfx');
                sound.on('ended', (sound) => {
                    /*this.mario.x = 48;
                    this.mario.y = -32;
                    this.mario.body.setVelocity(0);
                    this.mario.alpha = 1;
                    this.music.rate = 1;
                    this.music.seek = 0;
                    this.music.resume();
                    this.levelTimer.hurry = false;
                    this.levelTimer.time = 150 * 1000;
                    this.levelTimer.displayedTime = 255;
                    this.physics.world.resume();*/
                    sound.destroy();
                    this.scene.start("TitleScene");
                });
                sound.play('smb_stage_clear');

                this.mario.play("run" + this.mario.animSuffix);

                this.mario.flipX = false;
                this.tweens.add({
                    targets: this.mario,
                    x: this.finishLine.x + 6 * 16,
                    duration: 1000,
                    onComplete: () => this.removeFlag(2)
                });
                break;
            case 2:
                this.tweens.add({
                    targets: this.mario,
                    alpha: 0,
                    duration: 500,
                });
                break;
        }
    }

    // toggleTouch() {
    //   this.touchControls.visible = !this.touchControls.visible;
    //   if (this.touchControls.visible) {
    //     this.touchControls.dpad.alpha = 0;
    //     this.touchControls.abutton.alpha = 0;
    //   }
    //   else {
    //     this.touchControls.dpad.alpha = 0.5;
    //     this.touchControls.abutton.alpha = 0.5;
    //   }
    // }


    // keep this for animations, attract mode, scenes and other stuff
    // record(delta) {
    //   let update;
    //   let keys = {
    //     jump: this.keys.jump.isDown,
    //     left: this.keys.left.isDown,
    //     right: this.keys.right.isDown,
    //     down: this.keys.down.isDown,
    //   }
    //   if (typeof (recording) === "undefined") {
    //     console.log("DEFINE")
    //     window.recording = [];
    //     window.time = 0;
    //     this.recordedKeys = {};
    //     update = true;
    //   }
    //   else if (window.recording.length===1){
    //     update = false;
    //   }
    //   else {
    //     update = (time - recording[recording.length - 1].time) > 200; // update at least 5 times per second
    //   }
    //   time += delta;
    //   if (!update) {
    //     // update if keys changed
    //     ["jump", "left", "right", "down"].forEach((dir) => {
    //       if (keys[dir] != this.recordedKeys[dir]) {
    //         update = true;
    //       }
    //     });
    //   }
    //   if (update) {
    //     recording.push({ time, keys, x: this.mario.x, y: this.mario.y, vx: this.mario.body.velocity.x, vy: this.mario.body.velocity.y });
    //   }
    //   this.recordedKeys = keys;
    // }

    newMap(worldName, Player){

      this.physics.world.isPaused = true

      //fade out


        this.worldName = worldName

        this.load.tilemapTiledJSON('world2', 'assets/tilemaps/world2.json')

        this.leftNeighbor = worlds[this.worldName].leftNeighbor
        this.rightNeighbor = worlds[this.worldName].rightNeighbor

      console.log("worldName")
      console.log(this.worldName)
      console.log(this.leftNeighbor)
      console.log(this.rightNeighbor)


      // Places to warp to (from pipes)
      this.destinations = {};

      // need to add destinations above from config
      // ******************************************

      console.log(this)
      console.log(this.make)

      // Add the map 
      this.map = this.make.tilemap({
          key: "world2"
      });


      console.log("need map here")
      console.log(this.map)
      this.tileset = this.map.addTilesetImage('super-mario-16bit', 'tiles-16bit');

      console.log(this.tileset)

      // Dynamic layer because we want breakable and animated tiles
      this.farBackground = this.map.createDynamicLayer('farBackground', this.tileset, 0, 0).setScrollFactor(.4,.4)
      this.middleBackground = this.map.createDynamicLayer('middleBackground', this.tileset, 0, 0).setScrollFactor(.6,.6)
      this.groundLayer = this.map.createDynamicLayer('groundLayer', this.tileset, 0, 0)

      console.log(this.groundLayer)
          // We got the map. Tell animated tiles plugin to loop through the tileset properties and get ready.
          // We don't need to do anything beyond this point for animated tiles to work.
      this.sys.animatedTiles.init(this.map);

      // Probably not the correct way of doing this:
      // this.physics.world.bounds.width = this.groundLayer.width;

      // Add the background as an tilesprite. TODO: Not working since beta 20
      let tileSprite = this.add.tileSprite(0, 0, 500, this.groundLayer.width, 'background-clouds');

      this.projectiles = this.add.group({
          classType: Projectile,
          runChildUpdate: true,
          maxSize: 20
      })

      console.log(this.projectiles)

      // Set collision by property
      this.groundLayer.setCollisionByProperty({
          collide: true
      });


      // CREATE MARIO!!!
      this.mario = new Mario({
          scene: this,
          key: 'mario',
          x: this.groundLayer.width - 32, // 3500, 
          y: this.groundLayer.height - 16 - 16
      });

      console.log(this.mario)

      this.background = this.map.createDynamicLayer('background', this.tileset, 0, 0)

      console.log(this.background)

      // This group contains all enemies for collision and calling update-methods
      this.enemyGroup = this.add.group()

      // The map has one object layer with enemies as stamped tiles, 
      // each tile has properties containing info on what enemy it represents.

      // This can work with the update, just need to request this from a database instead of 
      // getting it from the tilemap, more configurable this way. Can even randomly place 
      // items this new way.
      // request.getConfig(function(items){})
      // .objects.forEach(  
      // (enemy) => {
      // worlds.enemies
      // let enemyObject;
      for (let enemy in worlds[this.worldName].enemies) {
          for (let i = 0; i < worlds[this.worldName].enemies[enemy]; i++) {
              this.enemyGroup.add(new Enemy({
                      scene: this,
                      key: 'sprites16',
                      x: Math.random() * this.groundLayer.width,
                      y: Math.random() * this.groundLayer.height - 16,
                      type: enemy,
                      details: enemies[enemy]
                  }))
          }
      }

      // A group powerUps to update
      this.powerUps = this.add.group();

      console.log(this.groundLayer.height)
      console.log(this.groundLayer.width)

      this.cameras.main.setBounds(0, 0, this.groundLayer.width, this.groundLayer.height)
          // this.cameras.main.setSize() // maybe not have a fixed size?
          // this.cameras.main.setSize(2000, 1200); // fixed size messes everything up, too small is bad,
          //                                           need to do more research ////////////////////////
      console.log(this.cameras.main)

      // Used when hitting a tile from below that should bounce up.

      this.physics.world.isPaused = false



      // fade in
      this.physics.world.resume();

      console.log("where???")
    }

  exitWorld(player, tile){
    if(tile.index >= 0 && tile){
      console.log(tile)
      this.scene.sound.playAudioSprite('sfx', 'smb_stomp');
      this.scene.scene.start('OverWorldScene', {tileMap: tile.properties.to})
      console.log("overlapping")
    }

  }

    cleanUp() {
        // Scenes isn't properly destroyed yet.
        // lists from    console.log(Object.keys(this));
        let ignore = ["sys", "anims", "cache", "registry", "sound", "textures", "events", "cameras", "make", "add", "scene", "children", "cameras3d", "time", "data", "input", "load", "tweens", "lights", "physics"];
        let whatThisHad = ["sys", "anims", "cache", "registry", "sound", "textures", "events", "cameras", "make", "add", "scene", "children", "cameras3d", "time", "data", "input", "load", "tweens", "lights", "physics", "destinations", "rooms", "eightBit", "music", "map", "tileset", "groundLayer", "mario", "enemyGroup", "powerUps", "keys", "blockEmitter", "bounceTile", "levelTimer", "score", "finishLine", "touchControls"];



        whatThisHad.forEach(key => {
            if (ignore.indexOf(key) === -1 && this[key]) {

                switch (key) {
                    case "enemyGroup":
                    case "music":
                    case "map":
                        // case "tileset":
                        this[key].destroy();

                        break;
                }

                this[key] = null;

            }
        })
    }
}


export default OverWorldScene;