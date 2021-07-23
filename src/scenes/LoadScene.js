import { CST } from "../CST"
import { signUpForm } from "../assets/signupform"
import { signInForm } from "../assets/signinform"
import { changePasswordForm } from "../assets/changepasswordform"
import { createCharacterForm } from "../assets/createcharacter"

export class LoadScene extends Phaser.Scene{
    constructor() {
        super({
            key: CST.SCENES.LOAD
        })
    }
    init() {

    }
    preload() {
        this.cache.html.add('sign-up', signUpForm)
        this.cache.html.add('sign-in', signInForm)
        this.cache.html.add('change-password', changePasswordForm)
        this.cache.html.add('create-character', createCharacterForm)
        this.load.image('bg', 'https://i.imgur.com/SAKDIFy.png')
        this.load.image('logo', 'https://i.imgur.com/XB8YvO0.png')
        this.load.image('starfish', 'https://i.imgur.com/Hpnxa6Y.png')
        this.load.image('conch', 'https://i.imgur.com/sLrduqP.png')
        this.load.image('clam', 'https://i.imgur.com/HTMFp8d.png')
        this.load.spritesheet('crab', 'https://i.imgur.com/FjjhOKR.png', { frameWidth: 71, frameHeight: 36 })
        this.load.spritesheet('crab2', 'https://i.imgur.com/glMZSfU.png', { frameWidth: 83.5, frameHeight: 36 })
        this.load.spritesheet('crab-throw', 'https://i.imgur.com/winRwny.png', { frameWidth: 120, frameHeight: 60 })

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })
        this.load.on('progress', (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50)
        })
    }
    create() {
        this.scene.start(CST.SCENES.MENU)
    }
}