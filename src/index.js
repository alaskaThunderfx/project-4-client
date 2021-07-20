import Phaser from 'phaser';
import { CST, gameState } from './CST';
import { LoadScene } from './scenes/LoadScene';
import { MenuScene } from './scenes/MenuScene';
import { MainGame } from './scenes/MainGame';
import { LoggedInScene } from './scenes/LoggedInScene';
import { PickedCharacterScene } from './scenes/PickedCharacterScene';
import { InventoryScene } from './scenes/InventoryScene';

var starfish

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: CST.SCENES.INDEX
        });
    }

    preload () {

    }
      
    create () {

    }

    update () {

    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            enableBody: true
        }
        
    },
    scene: [
        LoadScene,
        MenuScene,
        LoggedInScene,
        PickedCharacterScene,
        MainGame,
        InventoryScene,
        MyGame
    ]
};

const game = new Phaser.Game(config);
