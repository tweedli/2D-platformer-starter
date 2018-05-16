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
        this.worldName = this.scene.settings.data.tileMap

        this.load.tilemapTiledJSON(this.worldName, 'assets/tilemaps/' + this.worldName + '.json')

        this.leftNeighbor = worlds[this.worldName].leftNeighbor
        this.rightNeighbor = worlds[this.worldName].rightNeighbor

        this.entryPoint = worlds[this.worldName].entryPoint
        this.from = this.scene.settings.data.from
        this.fromDoor = this.scene.settings.data.fromDoor


        this.createMario = this.scene.settings.data.createMario
        this.fromInside = this.scene.settings.data.fromInside

        this.leftToOutside = worlds[this.worldName].leftToOutside
        this.rightToOutside = worlds[this.worldName].rightToOutside

        this.world = worlds[this.worldName]

    }

    create() {

      this.cameras.main.fadeIn(500)
      this.sys.install('AnimatedTiles');

      this.rooms = [];
      makeAnimations(this);

      this.map = this.make.tilemap({
          key: this.worldName
      });
      this.tileset = this.map.addTilesetImage('super-mario-16bits', 'tiles-16bit');

      if(worlds[this.worldName].farBackground)
      this.farBackground = this.map.createDynamicLayer('farBackground', this.tileset, 0, 0).setScrollFactor(.4,.4)
      if(worlds[this.worldName].middleBackground)
      this.middleBackground = this.map.createDynamicLayer('middleBackground', this.tileset, 0, 0).setScrollFactor(.6,.6)
      this.groundLayer = this.map.createDynamicLayer('groundLayer', this.tileset, 0, 0)
      if(worlds[this.worldName].exitLayer)
      this.exitLayer = this.map.createDynamicLayer('exitLayer', this.tileset, 0, 0)

      this.groundLayer.filterTiles(function(item){
        if(item.properties.collideDown === true)
        item.setCollision(false, false, true, false)
      })

      this.sys.animatedTiles.init(this.map);

      this.projectiles = this.add.group({
          classType: Projectile,
          runChildUpdate: true,
          maxSize: 20
      })

      // Set collision by property
      this.groundLayer.setCollisionByProperty({
          collide: true
      });


      if(this.createMario){
        this.mario = new Mario({
          scene: this,
          key: 'mario',
          x: 24, // 3500, 
          y: this.groundLayer.height - 16 - 16
        })
        this.cameras.main.fadeIn(333)
      } else {
        if(this.fromDoor){
          this.mario.body.setVelocity(0,0)
          this.mario.x = worlds[this.worldName][this.from + 'Entry'].x
          this.mario.y = worlds[this.worldName][this.from + 'Entry'].y
          this.physics.world.enable(this.mario)
          this.add.existing(this.mario)
        } else if(this.fromInside){
          this.mario.body.setVelocity(0,0)
          this.mario.x = this.fromInside.x
          this.mario.y = this.fromInside.y
          this.physics.world.enable(this.mario)
          this.add.existing(this.mario)
        } else {
        if(this.from === 'left'){
          this.mario.x = 8
          this.physics.world.enable(this.mario)
          this.add.existing(this.mario)
        } else if(this.from === 'right'){
          this.mario.x = this.groundLayer.width - 16
          this.physics.world.enable(this.mario)
          this.add.existing(this.mario)
        } 
        }
      }

      this.gfx = this.add.graphics(0, 0)
      this.background = this.map.createDynamicLayer('background', this.tileset, 0, 0)

      this.enemyGroup = this.add.group()

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

      this.keys = {
          up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
          jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
          down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
          shoot: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
      };



      this.cameras.main.setBounds(0, 0, this.groundLayer.width, this.groundLayer.height)
      this.cameras.main.startFollow(this.mario)
      this.cameras.main.setBackgroundColor('#' + worlds[this.worldName].backgroundColor); //Blue sky

      this.bounceTile = new SMBTileSprite({
          scene: this,
      })

      // Hack to get sprite's destroy method to function.
      //????????????????????????????????????????????
      this.sys.physicsManager = this.physics.world;

      this.cameras.main.roundPixels = true;

      // If the game ended while physics was disabled
      this.physics.world.resume();

      this.healthText = this.add.bitmapText(20, 8, 'font', 'HEALTH ' + this.mario.health).setScrollFactor(0)
      this.ammoText = this.add.bitmapText(20, 24, 'font', 'AMMO ' + this.mario.ammo).setScrollFactor(0)
    }

    update(time, delta) {
      if (this.physics.world.isPaused) {
          return;
      }

      this.mario.update(this.keys, time, delta);

      this.enemyGroup.children.entries.forEach(
        (sprite) => {
          sprite.update(time, delta);
        }
      )

      this.powerUps.children.entries.forEach(
        (sprite) => {
          sprite.update(time, delta);
        }
      )
    }

    tileCollision(sprite, tile) {
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


  exitWorld(player, tile){
    if(tile.index >= 0 && tile){
      this.scene.sound.playAudioSprite('sfx', 'smb_stomp');
      this.scene.scene.start('OverWorldScene', {tileMap: tile.properties.to, from: 'left', fromDoor: true})
    }
  }

}


export default OverWorldScene;