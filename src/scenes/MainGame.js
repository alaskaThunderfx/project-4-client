import { CST, gameState } from "../CST"

var starfish

export class MainGame extends Phaser.Scene{
    constructor() {
        super({
            key: CST.SCENES.MAINGAME
        })
    }
    // init() {

    // }
    preload() {

    }
    create(char) {
        // background
        this.add.image(400, 400, 'bg')
        // go back starfish
        let goBack = this.add.image(675, 750, 'starfish').setDepth(1)
        this.add.text(705, 750, 'Go Back', { color: 'black' }).setDepth(1)
        goBack.setInteractive()
        // inventory starfish
        let inventory = this.add.image(50, 750, 'starfish').setDepth(1)
        this.add.text(80, 750, 'Inventory', { color: 'black' }).setDepth(1)
        inventory.setInteractive()

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
        gameState.player.play('stand')
        // crabWalk.play('walk')
        gameState.player.setInteractive()

        inventory.on('pointerdown', () => {
            console.log(char.inventory)
            // this.scene.start(CST.SCENES.MAINGAME, char)
        })

        goBack.on ('pointerdown', () => {
            this.scene.start(CST.SCENES.LOGGEDIN)
        })
    }
    update() {
        
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