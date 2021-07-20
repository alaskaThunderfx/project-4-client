import { apiUrl } from './../config.js'
import { CST, gameState } from "../CST"

var starfish

export class MainGame extends Phaser.Scene{
    constructor() {
        super({
            key: CST.SCENES.MAINGAME
        })
    }
    init() {

    }
    preload() {

    }
    create(char) {
        gameState.toggle = false
        var clams = []
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

        for (let i = 0; i < 5; i++) {
            clams.push(this.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(100, 700), 'clam'))
            // clams[i].setInteractive()
        }
        // let clam = this.add.image(400, 400, 'clam')
        // clam.setSize(40, 30)
        // this.physics.world.enable(clam);

        gameState.isActive = false

        gameState.cursors = this.input.keyboard.createCursorKeys()
        gameState.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        gameState.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        gameState.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        gameState.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        gameState.iKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I)

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

        this.anims.create({
            key: 'throw',
            frames: this.anims.generateFrameNumbers('crab-throw'),
            frameRate: 5,
            repeat: 0
        })

        gameState.player = this.add.container(400, 300, [this.physics.add.sprite(0, 0, 'crab'), this.add.text(-30, -40, char.name, { color: 'black' })])
        gameState.player.list[0].play('stand')
        gameState.player.list[0].on('animationcomplete', () => {
            gameState.player.list[0].play('stand')
        })
        // crabWalk.play('walk')
        // var hitArea = new Phaser.Geom.Rectangle(0, 0, 72, 36)
        gameState.player.setSize(72, 30)
        this.physics.world.enable(gameState.player);
        gameState.player.setInteractive()

        clams.forEach(clam => {
            clam.setSize(40,30)
            this.physics.world.enable(clam)
            })

        this.physics.add.collider(clams, gameState.player, function(thing) {
            thing.destroy()
            char.inventory.push('clam')
            console.log(char)
            let charData = `{
                "character": {
                    "inventory": "${char.inventory}"
                    }
                }`
            
            fetch(`${apiUrl}/characters/${char._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                    },
                body: charData
                })
                .then(res => (console.log(res))) 
        })

        inventory.on('pointerdown', () => {
            if (gameState.toggle === false) {
                this.scene.launch(CST.SCENES.INVENTORY, char)
                gameState.toggle = true
            } else {
                this.scene.stop(CST.SCENES.INVENTORY)
                gameState.toggle = false
            }
        })

        goBack.on('pointerdown', () => {
            clams.forEach(clam => clam.destroy())
            this.scene.stop(CST.SCENES.INVENTORY)
            this.scene.start(CST.SCENES.LOGGEDIN)
        })
    }
    update() {
        if (gameState.throwShell === true) {
            gameState.throwShell = false
            setTimeout(() => {
                gameState.shell = this.physics.add.image(gameState.player.x, gameState.player.y + 30, 'clam')
                gameState.shell.flipY = true
                gameState.shell.setInteractive()
                gameState.shell.setVelocityY(500)
                
            }, 400)
            setTimeout(() => {
                gameState.shell.destroy()
            }, 3000)
        }
        
        if (Phaser.Input.Keyboard.JustDown(gameState.upKey)) {
            gameState.player.list[0].play('walk')
        } else if (Phaser.Input.Keyboard.JustDown(gameState.downKey)) {
            gameState.player.list[0].play('walk')
        } else if (Phaser.Input.Keyboard.JustDown(gameState.leftKey)) {
            gameState.player.list[0].play('walk')
            gameState.player.list[0].flipX = true
        } else if (Phaser.Input.Keyboard.JustDown(gameState.rightKey)) {
            gameState.player.list[0].play('walk')
            gameState.player.list[0].flipX = false
        }

        if (Phaser.Input.Keyboard.JustUp(gameState.upKey)) {
            gameState.player.list[0].play('stand')
        } else if (Phaser.Input.Keyboard.JustUp(gameState.downKey)) {
            gameState.player.list[0].play('stand')
        } else if (Phaser.Input.Keyboard.JustUp(gameState.leftKey)) {
            gameState.player.list[0].play('stand')
        } else if (Phaser.Input.Keyboard.JustUp(gameState.rightKey)) {
            gameState.player.list[0].play('stand')
        }

        if (Phaser.Input.Keyboard.JustDown(gameState.iKey)) {
            if (gameState.toggle === false) {
                this.scene.launch(CST.SCENES.INVENTORY, gameState.currentCharacter)
                gameState.toggle = true
            } else {
                this.scene.stop(CST.SCENES.INVENTORY)
                gameState.toggle = false
            }
        }

        if (gameState.cursors.left.isDown) {
            gameState.player.body.setVelocityX(-160)
            gameState.player.body.setVelocityY(0)
        } else if (gameState.cursors.right.isDown) {
            gameState.player.body.setVelocityX(160)
            gameState.player.body.setVelocityY(0)
        } else if (gameState.cursors.up.isDown) {
            gameState.player.body.setVelocityY(-160)
            gameState.player.body.setVelocityX(0)
        } else if (gameState.cursors.down.isDown) {
            gameState.player.body.setVelocityY(160)
            gameState.player.body.setVelocityX(0)
        } else {
            gameState.player.body.setVelocityX(0)
            gameState.player.body.setVelocityY(0)
        }

        if (starfish) {
            starfish.rotation += 0.05
        }
    }
}