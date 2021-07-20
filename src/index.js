import Phaser from 'phaser';
import { apiUrl } from './config.js'
import { CST, gameState } from './CST';
import { LoadScene } from './scenes/LoadScene';
import { MenuScene } from './scenes/MenuScene';
import { MainGame } from './scenes/MainGame';
import { LoggedInScene } from './scenes/LoggedInScene';
import { PickedCharacterScene } from './scenes/PickedCharacterScene';
import { InventoryScene } from './scenes/InventoryScene';

// 72 x 36
// 86 x 36

// const gameState = {}
var starfish

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: CST.SCENES.INDEX
        });
    }

    preload ()
    {
        this.load.image('bg', 'https://i.imgur.com/SAKDIFy.png')
        this.load.image('starfish', 'https://i.imgur.com/Hpnxa6Y.png')
        this.load.spritesheet('crab', 'https://i.imgur.com/FjjhOKR.png', { frameWidth: 71, frameHeight: 36 })
        this.load.spritesheet('crab2', 'https://i.imgur.com/glMZSfU.png', { frameWidth: 83.5, frameHeight: 36})
    }
      
    create ()
    {
        this.add.image(400, 400, 'bg')

        gameState.isActive = false

        gameState.cursors = this.input.keyboard.createCursorKeys()
        gameState.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        gameState.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        gameState.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        gameState.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)


        this.anims.create({
            key: 'stand',
            frames: this.anims.generateFrameNumbers('crab'),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('crab2'),
            frameRate: 10,
            repeat: -1
        })
        gameState.player = this.physics.add.sprite(400, 300, 'crab')
        // gameState.player = null
        var crabWalk = this.add.sprite(400, 200, 'crab2')
        var signUp = this.add.image(72, 36, 'crab')
        var signIn = this.add.image(144, 36, 'crab')
        var signOut = this.add.image(216, 36, 'crab')
        var changePassword = this.add.image(288, 36, 'crab')
        var userDataCrab = this.add.image(700, 36, 'crab')
       
        var createCharacter = this.add.image(72, 80, 'crab')
        var indexCharacters = this.add.image(144, 80, 'crab')
        var showCharacter = this.add.image(216, 80, 'crab')
        var deleteCharacter = this.add.image(288, 80, 'crab')
        var pickUpStuff = this.add.image(360, 80, 'crab') 
        var dropStuff = this.add.image(432, 80, 'crab') 
        var charDataCrab = this.add.image(700, 80, 'crab')

        signUp.setInteractive()
        signIn.setInteractive()
        signOut.setInteractive()
        changePassword.setInteractive()
        userDataCrab.setInteractive()

        createCharacter.setInteractive()
        indexCharacters.setInteractive()
        showCharacter.setInteractive()
        deleteCharacter.setInteractive()
        pickUpStuff.setInteractive()
        dropStuff.setInteractive()
        charDataCrab.setInteractive()

        userDataCrab.on('pointerdown', () => {
        })

        charDataCrab.on('pointerdown', () => {
            if (gameState.isActive === false) {
                starfish = this.add.image(400, 400, 'starfish')
                gameState.isActive = true
            } else {
                starfish.destroy()
                starfish = null
                gameState.isActive = false
            }
            
        })

        signUp.on('pointerdown', () => {
            gameState.user_name = prompt('Enter a user name please!')
            gameState.password = prompt('Enter a password please!')
            gameState.password_conf = prompt('Confirm your password please!')
            let userData = `{
                "credentials": {
                    "user_name": "${gameState.user_name}",
                    "password": "${gameState.password}",
                    "password_confirmation": "${gameState.password_conf}"
                }
            }`
            fetch(`${apiUrl}/sign-up`, {
                method: 'POST',
                headers: {
                  "Content-type": "application/json"
                },
                body: userData
              })
            gameState.user_name = null
            gameState.password = null
            gameState.password_conf = null
        })

        signIn.on('pointerdown', () => {
            gameState.user_name = prompt('Enter your user name!')
            gameState.password = prompt('Enter your password!')
            let userData = `{
                "credentials": {
                    "user_name": "${gameState.user_name}",
                    "password": "${gameState.password}"
                    }
                }`

            function signInData(){
                return fetch(`${apiUrl}/sign-in`, {
                method: 'POST',
                headers: {
                  "Content-type": "application/json"
                },
                body: userData
              })
                .then(res => { 
                    return res.json().then(data => {
                        gameState.user = data
                        return data
                    }) 
                })
            }
            const userStuff = signInData()
                .then(data => {
                return gameState.userData = data
            }) 
            gameState.user_name = null
            gameState.password = null
            gameState.player = this.physics.add.sprite(400, 300, 'crab')
        })

        signOut.on('pointerdown', () => {
            fetch(`${apiUrl}/sign-out`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                }
              })
            gameState.userData = null
        })

        changePassword.on('pointerdown', () => {
            gameState.oldPassword = prompt('Enter your old password!')
            gameState.newPassword = prompt('Enter your new password!')
            let userData = `{
                "passwords": {
                    "old": "${gameState.oldPassword}",
                    "new": "${gameState.newPassword}"
                    }
                }`
            fetch(`${apiUrl}/change-password`, {
                method: 'PATCH',
                headers: {
                  "Content-type": "application/json",
                  "Authorization": `Bearer ${gameState.userData.user.token}`
                },
                body: userData
              })
                .then(res => { 
                    return res.json().then(data => {
                        gameState.user = data
                        return data
                    }) 
                })
        })

        createCharacter.on('pointerdown', () => {
            let charData = `{
                "character": {
                    "name": "${prompt('Name your new character!')}",
                    "inventory": []
                }
            }`
            function newCharacterData(){
                return fetch(`${apiUrl}/characters`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                },
                body: charData
              })
                .then(res => { 
                    return res.json().then(data => {
                        gameState.character = data
                        return data
                    }) 
                })
            }
            const charStuff = newCharacterData()
                .then(data => {
                return gameState.characterData = data
            })
        })

        indexCharacters.on('pointerdown', () => {
            function newCharacterData(){
                return fetch(`${apiUrl}/characters`, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                }
              })
                .then(res => { 
                    return res.json().then(data => {
                        gameState.character = data
                        return data
                    }) 
                })
            }
            const charStuff = newCharacterData()
                .then(data => {
                return gameState.characterData = data
            })
        })

        showCharacter.on('pointerdown', () => {
            function showCharacterData(){
                return fetch(`${apiUrl}/characters/${showData}`, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                }
              })
                .then(res => { 
                    return res.json().then(data => {
                        gameState.showCharacter = data
                        return data
                    }) 
                })
            }
            const charStuff = showCharacterData()
                .then(data => {
                    gameState.showCharacterData = data
                    if (data.character.inventory[0] === undefined) {
                        return gameState.showCharacterData.character.inventory = data.character.inventory
                    } else {
                        return gameState.showCharacterData.character.inventory = data.character.inventory[0].split(',')
                    }
            })
        })

        deleteCharacter.on('pointerdown', () => {
            const deleteData = prompt('Enter character id!')
            fetch(`${apiUrl}/characters/${deleteData}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                }
              })
            })

        pickUpStuff.on('pointerdown', () => {
            gameState.showCharacterData.character.inventory.push('stuff')
            let charData = `{
                "character": {
                    "inventory": "${gameState.showCharacterData.character.inventory}"
                    }
                }`
            fetch(`${apiUrl}/characters/${gameState.showCharacterData.character._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                    },
                body: charData
            })
        })

        dropStuff.on('pointerdown', () => {
            gameState.showCharacterData.character.inventory.splice(gameState.showCharacterData.character.inventory.indexOf('stuff'), 1)
            let charData = `{
                "character": {
                    "inventory": "${gameState.showCharacterData.character.inventory}"
                    }
                }`
            fetch(`${apiUrl}/characters/${gameState.showCharacterData.character._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                    },
                body: charData
            })
        })


        gameState.player.play('stand')
        // crabWalk.play('walk')
        gameState.player.setInteractive()
    }

    update () {
        if (Phaser.Input.Keyboard.JustDown(gameState.upKey)) {
            gameState.player.play('walk')
        } else if (Phaser.Input.Keyboard.JustDown(gameState.downKey)) {
            gameState.player.play('walk')
        } else if (Phaser.Input.Keyboard.JustDown(gameState.leftKey)) {
            gameState.player.play('walk')
            gameState.player.flipX = true
        } else if (Phaser.Input.Keyboard.JustDown(gameState.rightKey)) {
            gameState.player.play('walk')
            gameState.player.flipX = false
        }

        if (Phaser.Input.Keyboard.JustUp(gameState.upKey)) {
            gameState.player.play('stand')
        } else if (Phaser.Input.Keyboard.JustUp(gameState.downKey)) {
            gameState.player.play('stand')
        } else if (Phaser.Input.Keyboard.JustUp(gameState.leftKey)) {
            gameState.player.play('stand')
        } else if (Phaser.Input.Keyboard.JustUp(gameState.rightKey)) {
            gameState.player.play('stand')
        }

        if (gameState.cursors.left.isDown) {
            gameState.player.setVelocityX(-160)
            gameState.player.setVelocityY(0)
        } else if (gameState.cursors.right.isDown) {
            gameState.player.setVelocityX(160)
            gameState.player.setVelocityY(0)
        } else if (gameState.cursors.up.isDown) {
            gameState.player.setVelocityY(-160)
            gameState.player.setVelocityX(0)
        } else if (gameState.cursors.down.isDown) {
            gameState.player.setVelocityY(160)
            gameState.player.setVelocityX(0)
        } else {
            gameState.player.setVelocityX(0)
            gameState.player.setVelocityY(0)
        }

        if (starfish) {
            starfish.rotation += 0.05
        }
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
            // debug: true 
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
