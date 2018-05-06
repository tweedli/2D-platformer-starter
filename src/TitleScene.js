/*
 * We want this scene to show maybe a slideshow, 
 * perhaps add animations, then pop a modal
 * to let a user select their game file.
 *
 * 
 *
 * * * * * * * * * * * * * * * * * * * */
class TitleScene extends Phaser.Scene {
    
    constructor(test) {
      super({
        key: 'TitleScene'
      });
    }

    preload()
    {
        this.load.atlas('mario-sprites', 'assets/mario-sprites.png', 'assets/mario-sprites.json')
    }
    
    create()
    {
      let config = {
          key: 'title',
          frames: [{ frame: 'title', key: 'mario-sprites' }],
      }
      this.anims.create(config);
    
      this.title = this.add.sprite(this.sys.game.config.width/2, 100);
      this.title.play("title");
      // this.attractMode = this.scene.launch('OverWorldScene');
      // console.log(this.attractMode.stop);

      this.scene.bringToTop();

      this.registry.set('restartScene', false);
      this.registry.set('attractMode', true);

      let sh = window.screen.availHeight;
      let sw = window.screen.availWidth;
      let ch = 0;
      let cw = 0;
      if(sh/sw > 0.6) {
          // Portrait
          cw = sw;
          ch = sw*0.6;

      }
      else {
          // Landscape
          console.log("landscape")
          cw = sh/0.6;
          ch = sh;
      }
      let el = document.getElementsByTagName('canvas')[0];
      // console.log(el);
      el.style.width = cw*0.9+"px";
      el.style.height = ch*0.9+"px";
      // console.log(cw,ch);

      this.pressX = this.add.bitmapText(this.sys.game.config.width / 2 - 86, 200, 'font', "PRESS X TO START\n\nPRESS A TO JUMP\n\nPRESS S TO SHOOT", 8);
      this.blink = 1000;

      this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        
    }
    update(time, delta)
    {
        if(this.registry.get('restartScene')){
            this.restartScene();

        }
        // this.blink-=delta;
        // if(this.blink<0){
        //     this.pressX.alpha = this.pressX.alpha === 1 ? 0 : 1;
        //     this.blink = 500;
        // }

        // console.log(delta)
        // console.log(time)

        // if(!this.registry.get('attractMode')){
        // }
        if(this.startKey.isDown){
            this.scene.stop('OverWorldScene');
            // this.registry.set('attractMode', false);
            this.scene.start('OverWorldScene', {tileMap: 'world1', from: false, createMario: true})

        }

    }
    restartScene(){
        //        this.attractMode.stop();
        this.scene.stop('OverWorldScene');
        this.scene.launch('OverWorldScene', {tileMap: 'world1', from: false, createMario: true})
        this.scene.bringToTop()

        this.registry.set('restartScene', false);

    }
}

export default TitleScene;
