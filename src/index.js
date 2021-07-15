import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import apiUrl from './config.js'

const gameState = {}

const userData = `{
    "credentials": {
        "user_name": "joe",
        "password": "hi"
    }
}`

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('logo', logoImg);
    }
      
    create ()
    {
        gameState.player = this.add.image(400, 300, 'logo')
        gameState.player.setInteractive()
        gameState.player.on('pointerdown', () => {
            fetch('http://localhost:4741/sign-in', {
                method: 'POST',
                headers: {
                  "Content-type": "application/json"
                },
                body: userData
              })
                .then(req => console.log(req))
        })
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
};

const game = new Phaser.Game(config);
