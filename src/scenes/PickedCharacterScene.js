import { CST } from "../CST";

export class PickedCharacterScene extends Phaser.Scene {
    constructor() {
        super ({
            key: CST.SCENES.PICKEDCHARACTER
        })
    }
    init() {
    }
    preload() {
    }
    create(char) {
        this.anims.create({
            key: 'stand',
            frames: this.anims.generateFrameNumbers('crab'),
            frameRate: 5,
            repeat: -1
        })
        // logo
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, 'logo').setDepth(1)
        // background
        this.add.image(0, 0, 'bg').setOrigin(0).setDepth(0)

        // Start Game starfish
        let startGame = this.add.image(50, 750, 'starfish').setDepth(1)
        this.add.text(80, 750, 'Start Game!', { color: 'black' }).setDepth(1)
        startGame.setInteractive()
        // Go Back starfish
        let goBack = this.add.image(675, 750, 'starfish').setDepth(1)
        this.add.text(705, 750, 'Back', { color: 'black' }).setDepth(1)
        goBack.setInteractive()

        // crab
        let player = this.add.sprite(this.game.renderer.width / 2, this.game.renderer.height / 2 - 150, 'crab')
        this.add.text(this.game.renderer.width / 2, player.y + 30, char.name, { color: 'black' }).setOrigin(0.5)
        this.add.text(this.game.renderer.width / 2, player.y + 60, 'INVENTORY:', { color: 'black' }).setOrigin(0.5)
        if (char.inventory[0] === undefined) {
            this.add.text(this.game.renderer.width / 2, player.y + 90, "You don't have anything!", { color: 'black'}).setOrigin(0.5)
        } else {
            char.inventory = char.inventory[0].split(',')
            console.log(char.inventory)
            let x = -300
            char.inventory.forEach(item => {
                if (item === 'clam') {
                    this.add.image(this.game.renderer.width / 2 + x, this.game.renderer.height / 2, 'clam').setDepth(1)
                    x += 100
                }
            })
        }
        
        player.play('stand')

        startGame.on('pointerdown', () => {
            this.scene.start(CST.SCENES.MAINGAME, char)
        })

        goBack.on ('pointerdown', () => {
            this.scene.start(CST.SCENES.LOGGEDIN)
        })
    }
}