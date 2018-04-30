// export default class Projectile extends Phaser.GameObjects.Sprite {
//   constructor(config){
//     super(config.scene, config.x, config.y - 16, 'projectile')
//       config.scene.physics.world.enable(this);
//       config.scene.add.existing(this);
//       this.speed = Phaser.Math.GetSpeed(2000, 1)
//       this.dir = ''
//       this.setSize(16, 16)
//       this.anims.play('bullet')
//   }
// }

// what is wrong ^^^ ????

module.exports = Phaser.Class({

        Extends: Phaser.GameObjects.Sprite,

        initialize:

        function Projectile (scene)
        {
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'projectile')

            // high speed (1500+) results in the bullet being behind the players
            console.log("bullet constructor")
            console.log(this)
            this.speed = 700
            scene.physics.world.enable(this);
            scene.add.existing(this);

            // this.body.offset.set(22, 22)
            this.anims.play('bullet')
            this.body.allowGravity = false
            // this.setAnchor(.5)

            this.dir = ''
            this.canBounce = false
            this.firedBy = ''
            this.damage = 20
        },

        fire: function (x, y, dir, bodyVel, firedBy)
        {
            this.dir = dir 

            this.setPosition(dir === 'left' ? x - 5 : x + 5, y);
          // console.log(x + " " + y)
            this.setActive(true);
            this.setVisible(true);
            this.body.enable = true
            // console.log(this.dir)
            // console.log(dir)
            this.body.velocity.x = 0
            this.body.velocity.y = 0
            this.body.allowGravity = false

            this.body.setSize(16, 16)
            // this.body.height = 16
            // this.body.width = 16

            // this.body.offset.set(10, 10)

            // console.log(this.body)
            this.body.setVelocityX(this.dir === 'right' ? this.speed : -this.speed)

            // maybe                 overlap???????
            this.scene.physics.add.collider(this, this.scene.groundLayer, this.collision.bind(this));
            this.scene.physics.add.overlap(this, this.scene.enemyGroup, this.impact.bind(this));

        },

        collision: function(sprite, tile)
        { 

          console.log("Hit!!!")
          console.log(tile)
          console.log(sprite)
          // console.log(this)
          // if(tile.index > 0){

          // turn on for collisions
          // tile.body.drawDebug(this.scene.gfx)

          this.setActive(false);
          this.setVisible(false);
          this.body.enable = false
          // }
        },

        impact: function(projectile, impacted)
        { 

          this.setActive(false);
          this.setVisible(false);
          this.body.enable = false
          // console.log("impact!")
          // console.log(impacted.body.velocity)
          // console.log(projectile.body.velocity)
          // console.log(this)
          // if(tile.index > 0){

          // impacted.body.setVelocity(projectile.body.velocity.x, -500)

            

          impacted.damage(this.damage)

          // turn on for impacts
          // this.body.drawDebug(this.scene.gfx)

          // }
        },

        update: function (time, delta)
        {
          // if(this.dir === 'left'){
          //   this.x -= this.speed * delta;
          // } else {
          //   this.x += this.speed * delta;
          // }

          // this.body.setGravity(0,0)
          // console.log(this)

            

            // biggest possible sprite around 100 - 200
            if (this.x < -100 || this.x > this.scene.groundLayer.width || this.y < -100 || this.y > this.scene.groundLayer.width)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }



    });


//   function Projectile(config) {
//     _classCallCheck(this, Projectile);

//     var _this = _possibleConstructorReturn(this, (Projectile.__proto__ || Object.getPrototypeOf(Projectile)).call(this, config.scene, config.x, config.y - 16, 'projectile'));

//     _this.speed = Phaser.Math.GetSpeed(2000, 1);
//     config.scene.physics.world.enable(_this);
//     config.scene.add.existing(_this);

//     _this.dir = '';
//     _this.setSize(16, 16);
//     _this.anims.play('bullet');
//     return _this;
//   }

//   _classCallCheck(this, PowerUp);

//     var _this = _possibleConstructorReturn(this, (PowerUp.__proto__ || Object.getPrototypeOf(PowerUp)).call(this, config.scene, config.x, config.y, config.key));
