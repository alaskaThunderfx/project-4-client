import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import apiUrl from './config.js'

const gameState = {}

let userData = null

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('logo', logoImg);
        this.load.image('crab', 'https://i.imgur.com/z3CGtO2.gif')
    }
      
    create ()
    {
        gameState.player = this.add.image(400, 300, 'crab')
        gameState.player.setInteractive()
        gameState.player.on('pointerdown', () => {
            gameState.user_name = prompt('Enter a user name please!')
            console.log(gameState.user_name)
            gameState.password = prompt('Enter a password please!')
            gameState.password_conf = prompt('Confirm your password please!')
            userData = `{
                "credentials": {
                    "user_name": "${gameState.user_name}",
                    "password": "${gameState.password}",
                    "password_confirmation": "${gameState.password_conf}"
                }
            }`
        })
        gameState.player.on('pointerdown', () => {
            fetch('http://localhost:4741/sign-up', {
                method: 'POST',
                headers: {
                  "Content-type": "application/json"
                },
                body: userData
              })
                .then(req => console.log(req))
            console.log('after post request, :\n', typeof gameState.user_name)
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
