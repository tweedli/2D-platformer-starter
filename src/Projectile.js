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

        this.anims.play('bullet')
        this.body.allowGravity = false

        this.dir = ''
        this.canBounce = false
        this.firedBy = ''
        this.damage = 20
    },

    fire: function (x, y, dir, bodyVel, firedBy)
    {
        this.dir = dir 

        this.setPosition(dir === 'left' ? x - 5 : x + 5, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.enable = true
        this.body.velocity.x = 0
        this.body.velocity.y = 0
        this.body.allowGravity = false

        this.body.setSize(16, 16)
        this.body.setVelocityX(this.dir === 'right' ? this.speed : -this.speed)

        this.scene.physics.add.collider(this, this.scene.groundLayer, this.collision.bind(this));
        this.scene.physics.add.overlap(this, this.scene.enemyGroup, this.impact.bind(this));

    },

    collision: function(sprite, tile)
    { 
      this.setActive(false);
      this.setVisible(false);
      this.body.enable = false
    },

    impact: function(projectile, impacted)
    { 

      this.setActive(false);
      this.setVisible(false);
      this.body.enable = false

      impacted.damage(this.damage)

    },

    update: function (time, delta)
    {
        // biggest possible sprite around 100 - 200
        if (this.x < -100 || this.x > this.scene.groundLayer.width || this.y < -100 || this.y > this.scene.groundLayer.width)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }



});