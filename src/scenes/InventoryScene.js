import { apiUrl } from './../config.js'
import { CST, gameState } from "../CST"

export class InventoryScene extends Phaser.Scene {
    constructor() {
        super ({
            key: CST.SCENES.INVENTORY
        })
    }
    create(char) {
        const items = char.inventory
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
                items.splice(playerInv.indexOf(item), 1)
                gameState.currentCharacter.inventory = items
                gameState.player.list[0].play('throw')
                gameState.throwShell = true
                let charData
                if (items.length > 0) { 
                    charData = `{
                    "character": {
                        "inventory": "${items}"
                        }
                    }`
                } else {
                    charData = `{
                        "character": {
                            "inventory": []
                            }
                        }`
                }
                
                fetch(`${apiUrl}/characters/${char._id}`, {
                    method: 'PATCH',
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${gameState.userData.user.token}`
                        },
                    body: charData
                    })
                gameState.toggle = false
                this.scene.stop(CST.SCENES.INVENTORY)
            })
        })
    }
    update() {
        
    }
}