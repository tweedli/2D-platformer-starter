import 'phaser';
import BootScene from './BootScene';
import OverWorldScene from './OverWorldScene';
import TitleScene from './TitleScene';


let config = {
    type: Phaser.WEBGL,
    parent: 'content',
    width: 800,
    height: 480,
    // width: 500,
    // height: 300, // <-- possible setting???
    // pixelArt:true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [
        BootScene,
        TitleScene,
        OverWorldScene,
    ]
};

let game = new Phaser.Game(config);

/*
https://codepen.io/samme/pen/JMVBeV*/