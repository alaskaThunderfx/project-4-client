import { apiUrl } from './../config.js'
import { CST, gameState } from "../CST"
import { SignUpScene } from './SignUpScene.js'

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.MENU
        })
    }
    init() {
    }
    preload() {
    }
    create() {
        gameState.launchScene = () => {
            this.scene.start(CST.SCENES.LOGGEDIN)
        }
        gameState.message = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 75, "", { color: "#000000" }).setDepth(5).setOrigin(0.5)
        gameState.toggleInteractive = true

        // logo
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, 'logo').setDepth(1)
        // background
        this.add.image(0, 0, 'bg').setOrigin(0).setDepth(0)
        // new account star
        let newAccount = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'starfish').setDepth(1)
        this.add.text(this.game.renderer.width / 2 + 30, this.game.renderer.height / 2, 'New User', { color: 'black' }).setDepth(1)
        // returning user star
        let returningUser = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, 'starfish').setDepth(1)
        this.add.text(this.game.renderer.width / 2 + 30, this.game.renderer.height / 2 + 100, 'Returning User', { color: 'black' }).setDepth(1)


        newAccount.setInteractive()
        returningUser.setInteractive()

        newAccount.on('pointerdown', () => {
            if (gameState.toggleInteractive === true) {
                gameState.toggleInteractive = false
                this.scene.launch(CST.SCENES.SIGNUP)
            }
        })

        returningUser.on('pointerdown', () => {
            if (gameState.toggleInteractive === true) {
                gameState.toggleInteractive = false
                this.scene.launch(CST.SCENES.SIGNIN)
            }
        })
    }
}