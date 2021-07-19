import { CST, gameState } from "../CST"

export class InventoryScene extends Phaser.Scene {
    constructor() {
        super ({
            key: CST.SCENES.INVENTORY
        })
    }
    create(items) {
        let playerInv = []
        let x = 95
        let inventoryBox = this.add.rectangle(400, 120, this.game.renderer.width - 100, 200, 0x000000)
        for (let i = 0; i < items.length; i++) {
            playerInv.push(this.add.image(x, 50, 'clam'))
            x += 50
        }
        playerInv.forEach(item => {
            item.setInteractive()
            item.on('pointerdown', () => {
                console.log('hi')
                console.log(playerInv.indexOf(item))
                gameState.player.list[0].play('walk')
            })
        })
    }
}