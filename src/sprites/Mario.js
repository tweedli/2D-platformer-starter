export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.acceleration = 1200
    this.body.maxVelocity.x = 300
    this.body.maxVelocity.y = 300
    this.animSuffix = ""
    this.small();
    this.bending = false
    this.wasHurt = -1
    this.flashToggle = false
    this.star = {
      active: false,
      timer: -1,
      step: 0
    }

    this.enteringPipe = false
    this.anims.play("stand")
    this.alive = true
    this.type = "mario"
    this.health = 100

    this.jumping = false
    this.jumpTimer = 200 // always?
    this.jumpHold = false
    this.doubleJumped = false
    this.isFalling = false

    this.gunDrawn = true
    this.bullets = 0
    this.firePerSec = 5
    this.lastFired = 0
    this.projFrequency = 1000 / this.firePerSec

    this.damageTime  = 500
    this.damageTimer = 0
    this.damaged = false

    this.ammo = 50

    this.tint
    

  }

  update(keys, time, delta) {

    // If Mario falls down a cliff or died, just let him drop from the sky and prentend like nothing happened

      // console.log(this.health)
      if(this.health <= 0 && this.alive){
        this.die()
      }

    // turn on to see vector + directional velocity
    // this.body.drawDebug(this.scene.gfx)

    if(this.x < 0){
      if(this.scene.leftNeighbor !== ""){
        // this.scene.newMap(this.scene.leftNeighbor, this)
        this.scene.scene.start('OverWorldScene', {tileMap: this.scene.leftNeighbor, from: 'right'})
      } else {
        if(this.alive) this.die()
      }
    }
    
    if(this.x > this.scene.groundLayer.width - 8){
      if(this.scene.rightNeighbor !== ""){
        // this.scene.newMap(this.scene.rightNeighbor, this)
         this.scene.scene.start('OverWorldScene', {tileMap: this.scene.rightNeighbor, from: 'left'})
      } else {
        if(this.alive) this.die();
      }
    }

    //somehow gotten below the map.
    if (this.y > this.scene.groundLayer.height) {
      
      //die
      this.scene.scene.start('TitleScene');
      // this.die() <-- will cause infinite loop

      //this.y = -32;
      //if(this.x<16){
      //  this.x = 16;
     // }
      //this.alive = true;
      //this.scene.music.seek = 0;
      //this.scene.music.play();
    }else if(this.scene.groundLayer.height > 240 && this.alive){
      // this.die();

    }


    // Don't do updates while entering the pipe or being dead
    if (this.enteringPipe || !this.alive) {
      return;
    }

    ////////////////////
    ////COLLISIONS//////
    ////////////////////

    // Just run callbacks when hitting something from below or trying to enter it
    if (this.body.velocity.y < 0 || this.bending) {
      this.scene.physics.world.collide(this, this.scene.groundLayer, this.scene.tileCollision);
    }
    else {
      this.scene.physics.world.collide(this, this.scene.groundLayer);
    }


    ////////////////////
    ////WHAT////////////
    ////////////////////

    if (this.wasHurt > 0) {
      this.wasHurt -= delta;
      this.flashToggle = !this.flashToggle;
      this.alpha = this.flashToggle ? 0.2 : 1;
      if (this.wasHurt <= 0) {
        this.alpha = 1;
      }
    }

    ////////////////////
    ////////////////////
    ////////////////////



    // simplify this, dont need variable assignment in update
    let input = {
      left: keys.left.isDown,
      right: keys.right.isDown,
      up: keys.up.isDown,
      down: keys.down.isDown,
      jump: keys.jump.isDown,
      shoot: keys.shoot.isDown
    }

    //this.angle++
     // console.log(this.body.velocity.y);


    this.bending = false;


    ////////////////////
    ////INPUT///////////
    ////////////////////    

    if (input.left) {
      
      if (this.body.velocity.y === 0) {
        this.run(-this.acceleration);
      }
      else {
        this.run(-this.acceleration / 2);
      }
      this.flipX = true;
    }
    // this else if needs to be taken out
    else if (input.right) {
      if (this.body.velocity.y === 0) {
        this.run(this.acceleration);
      }
      else {
        this.run(this.acceleration / 2);
      }
      this.flipX = false;
    }

    else if (this.body.blocked.down) {

      // 10 instead of 
      if (Math.abs(this.body.velocity.x) < 20) {
        this.body.setVelocityX(0);
        this.run(0);
      }
      else {
                                                          // higher will slow it down
        this.run(((this.body.velocity.x > 0) ? -1 : 1) * this.acceleration * 2);
      }

    }

    else if (!this.body.blocked.down) {
      this.run(0);
    }

    ////////////////////
    ////FRICTION////////
    ////////////////////

    if(!input.left && !input.right && !input.jump && this.body.blocked.down){
      //not using right now, handled in the input handler.
      // this.body.velocity.x = 0
    }

    ////////////////////
    ////JUMPING/////////
    ////////////////////

    // we subtract from the the jump timer if we are jumping.
    // 
    if(this.jumpTimer > 0 && this.jumping){
      // console.log(this.jumpTimer)
      this.jumpTimer -= delta
    }

    // we want to know if the player let go of the jump button
    //  in air for the double jump
    if(this.jumpHold && !input.jump){
      this.jumpHold = false
    }

    if (this.body.velocity.y !== 0 && !this.jumping) {
      console.log("falling")
      this.isFalling = true;
    }

    if (input.jump && !this.doubleJumped) {
      this.jump()
      // this.jumpTimer = 200
      this.jumpHold = true
    }else if(!input.jump && this.body.blocked.down){
      this.jumping = false
      this.doubleJumped = false
      this.isFalling = false
      this.jumpTimer = 200
    }

    ////////////////////
    ////ANIMATIONS//////
    ////////////////////

    let anim = null;
    if (this.body.velocity.y !== 0) {
      anim = "jump"
    } else if (this.body.velocity.x !== 0) {
      anim = "run";
      if ((input.left || input.right) && ((this.body.velocity.x > 0 && this.body.acceleration.x < 0) || (this.body.velocity.x < 0 && this.body.acceleration.x > 0))) {
        anim = "turn";
      }
      else if (this.animSuffix != "" && input.down && !(input.right || input.left)) {
        anim = "bend";
      }
    }
    else {
      anim = "stand";
      if (this.animSuffix != "" && input.down && !(input.right || input.left)) {
        anim = "bend";
      }
    }

    anim += this.animSuffix;
    if (this.anims.currentAnim.key !== anim) {
      this.anims.play(anim);
    }

    ////////////////////
    ////////////////////
    ////////////////////

    if (input.down && this.body.velocity.x < 100) {
      this.bending = true;
    }

    this.physicsCheck = true;

    ////////////////////
    ////PROJECTILES/////
    ////////////////////

    if(input.shoot && (time > this.lastFired || this.lastFired === 0)){
      // console.log(this.scene.projectiles)
      let bullet = this.scene.projectiles.get();
      // console.log(bullet)
      if(bullet && this.ammo > 0){
        // console.log(this.body.x + " " + this.body.y)
        bullet.fire(this.body.x, this.body.y, this.flipX ? 'left' : 'right')
        this.ammo--
        this.lastFired = time + this.projFrequency

        this.scene.ammoText.text = 'AMMO ' + this.ammo
      } else {
        console.log("no more projectiles!! out of ammo")
      }
    }

    if(!this.damaged){
      this.scene.physics.world.overlap(this, this.scene.enemyGroup, this.overlapEnemy.bind(this));
    } else {
      this.damageTimer += delta
      if(this.damageTimer > this.damageTime){
        this.damaged = false
        this.damageTimer = 0
        this.tint = 0xFFFFFF
      }
    }

    // this.scene.physics.world.overlap(this, this.scene.exitLayer, this.exitWorld)



    // star stuff
    // if (this.star.active) {
    //   if (this.star.timer < 0) {
    //     this.star.active = false;
    //     this.tint = 0xFFFFFF;
    //   }
    //   else {
    //     this.star.timer -= delta;
    if(this.damaged){
      this.star.step = (this.star.step === 5) ? 0 : this.star.step + 1;
      this.tint = [0xFFFFFF, 0xFF0000, 0xFFFFFF, 0x00FF00, 0xFFFFFF, 0x0000FF][Math.floor(this.star.step / 4)];
    }
    // }


  if(this.scene.exitLayer && input.up)
    this.scene.physics.world.overlap(this, this.scene.exitLayer, this.scene.exitWorld.bind(this))
  }

  run(vel) {
    this.body.setAccelerationX(vel);
  }

  jump() {
    // console.log(this.jumping)
    // console.log(this.doubleJumped)
    // console.log("jumping")
    if (!this.body.blocked.down && !this.jumping && this.doubleJumped) {
      return;
    }

    // first jump just needs to be on ground
    if(this.body.blocked.down){
      this.body.setVelocityY(-200);
      this.scene.sound.playAudioSprite('sfx', 'smb_jump-small', {volume: .2});
      this.jumpTimer = 200;
      this.jumping = true;
    }
      
    // if(!this.jumping){
    //   this.jumping = true;
    // }

    // second jump needs to be
    if((this.jumping || !this.body.blocked.down) && !this.doubleJumped && (this.jumpTimer <= 0 || this.isFalling) && !this.jumpHold){
      this.body.setVelocityY(-300);
      this.doubleJumped = true
      this.scene.sound.playAudioSprite('sfx', 'smb_jump-super', {volume: .2});
    }

    // idk what this is
    // if(!this.jumping){
    //   if(this.animSuffix===""){
    //   }
    //   else {
    //   }
    // }

  }

  enemyBounce(enemy) {
    // Force Mario y-position up a bit (on top of the enemy) to avoid getting killed 
    // by neigbouring enemy before being able to bounce
    this.body.y = enemy.body.y-this.body.height;
    // TODO: if jump-key is down, add a boost value to jump-velocity to use and init jump for controls to handle.
    this.body.setVelocityY(-200);
    
  }

  // hurtBy(enemy) {
  //   if(!this.alive){
  //     return;
  //   }
  //   if (this.star.active) {
  //     enemy.starKilled(enemy, this);
  //   }
  //   else if (this.wasHurt < 1) {
  //     if (this.animSuffix !== "") {
  //       this.resize(false);
  //       this.scene.sound.playAudioSprite('sfx', 'smb_pipe');

  //       this.wasHurt = 2000;
  //     }
  //     else {
  //       this.health = this.health - 10
  //       // console.log(this.health)
  //     }
  //   }
  // }

  resize(large) {
    this.scene.physics.world.pause();
    if (large) {
      this.large();
      this.animSuffix = "Super";
      this.play("grow");
    }
    else {
      this.small();
      this.animSuffix = "";
      this.play("shrink");
    }
  }

  small() {
    this.body.setSize(10, 10)
    this.body.offset.set(3, 22)
  }

  large() {
    this.body.setSize(10, 22)
    this.body.offset.set(3, 10)
  }

  die() {
    // this.scene.music.pause(); 
    this.play("death");
    this.scene.sound.playAudioSprite('sfx', 'smb_mariodie');

    this.body.setAcceleration(0);
    this.body.setVelocity(0, -300);
    this.alive = false;
  }

  enterPipe(id, dir, init = true) {

    if (init) {
      if (this.animSuffix === "") {
        this.play("stand");
      }
      else {
        this.play("bend" + this.animSuffix);
      }
      this.scene.sound.playAudioSprite('sfx', 'smb_pipe');

      this.enteringPipe = true;
      this.body.setVelocity(0);
      this.body.setAcceleration(0);
      this.setDepth(-100);
      this.scene.tweens.add({
        targets: this,
        y: this.y + 40,
        duration: 800,
        onComplete: function () {
          console.log(this.targets, id, dir); console.log(id); console.log(dir); this.targets[0].enterPipe(id, dir, false);
        },
      });

    }
    else {
      this.setDepth(1);
      this.enteringPipe = false;
      this.x = this.scene.destinations[id].x;
      this.y = this.scene.destinations[id].top ? -100 : 100;
      this.setRoomBounds(this.scene.rooms);
    }
  }

  setRoomBounds(rooms){
    rooms.forEach(
      (room) => {
        if (this.x >= room.x && this.x <= (room.x + room.width)) {
          let cam = this.scene.cameras.main;
          let layer = this.scene.groundLayer;
          cam.setBounds(room.x, 0, room.width * layer.scaleX, layer.height * layer.scaleY);
          this.scene.finishLine.active = (room.x===0);
          this.scene.cameras.main.setBackgroundColor(room.sky);
          return;
        }
      }
    );
  }

  overlapEnemy(player, enemy){
    console.log('tile then sprite')
    console.log(this)
    console.log(player)
    console.log(enemy)

    console.log('health: ' + player.health)
    player.body.setVelocity((enemy.body.velocity.x < 0 ? -1 : 1) * enemy.bumpDamage, enemy.bumpDamage * -10)
    player.health = player.health - enemy.bumpDamage
    player.health = player.health < 0 ? 0 : player.health
    this.scene.healthText.text = 'HEALTH ' + player.health
    if(player.health === 0){
      player.die()
    } else {
      player.damaged = true
      this.scene.sound.playAudioSprite('sfx', 'smb_stomp');
    }
  }


}


