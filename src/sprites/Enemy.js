/*
Generic enemy class that extends Phaser sprites.
Classes for enemy types extend this class.
*/

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y - 16, config.key, config.type, config.details);    
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.alive = true;
    // start still and wait until needed
    this.body.setVelocity(0, 0).setBounce(0, 0).setCollideWorldBounds(false);
    this.body.allowGravity = false;
    this.beenSeen = false;
    // know about Mario
    this.mario = this.scene.mario; 
    // Base horizontal velocity / direction.
    this.direction = -300;    
    // Standard sprite is 16x16 pixels with a smaller body
    this.body.setSize(config.details.width, config.details.height);
    this.body.offset.set(config.details.offsetX, config.details.offsetY);
    this.anims.play(config.type)   
    this.health = config.details.health
    this.killAt = 0;
    this.type = config.type
    this.bumpDamage = config.details.bumpDamage

    this.biDirectional = config.details.biDir

    this.flipX = this.biDirectional


  }

  activated(){
    // Method to check if an enemy is activated, the enemy will stay put
    // until activated so that starting positions is correct
    // if(!this.alive){
    //   if(this.y>240){
    //     this.kill();
    //   }
    //   return false;
    // }
    if(!this.beenSeen){
      // check if it's being seen now and if so, activate it
      if(this.x<this.scene.cameras.main.scrollX+this.scene.sys.game.canvas.width+32){
        this.beenSeen = true;
        this.body.velocity.x = this.direction;
        this.body.allowGravity = true;
        return true;
      }
      return false;
    }
    return true;
  }

  update (time, delta) {
    // If it's not activated, then just skip the update method (see Enemy.js)
    if(!this.activated()) return
    this.scene.physics.world.collide(this, this.scene.groundLayer)
    // might need to take this out incase it equals 0 at one point, which it may
    if(!this.alive){
      // The killtimer is set, keep the flat Goomba then kill it for good.
      // console.log(this.body.velocity)
      if(this.killAt === 500){
        this.body.setVelocityY(-200)
      }
      this.killAt-=delta;
      if(this.killAt < 0){
        this.destroy();
      }
      return;
    }
    // Collide with Mario!
    // this.scene.physics.world.overlap(this, this.mario, this.scene.enemygroup);
    // The Goomba stopped, better try to walk in the other direction.
    if(this.body.velocity.x === 0) {
      this.direction = -this.direction
      this.body.velocity.x = this.direction
      this.flipX = !this.flipX
    }
  }

  verticalHit(enemy, mario){
     // quick check if a collision between the enemy and Mario is from above.
     if(!mario.alive){return false}
     return mario.body.velocity.y>=0 && (mario.body.y+mario.body.height)-enemy.body.y<10;
  }

  hurtMario(enemy, mario){
    // send the enemy to mario hurt method (if mario got a star this will not end well for the enemy)
    this.scene.mario.hurtBy(enemy);
  }

  starKilled(){
    // Killed by a star or hit from below with a block, later on also fire
    if(!this.alive){
      return;
    }
    this.body.velocity.x  = 0;
    this.body.velocity.y = -200;
    this.alive = false;
    this.flipY = true;
    this.scene.sound.playAudioSprite('sfx', 'smb_stomp');
    // this.scene.updateScore(100);
  }

  kill(){
    console.log("killing")
    console.log(this.body.velocity)
    this.killAt = 500
    this.body.velocity.y = -500
    this.flipY = true
    this.alive = false
    console.log(this.body.velocity)
  }

  damage(damage){
    this.health = this.health - damage
    console.log(this.body)
    if(this.health <= 0) this.kill()
  }
}
