import { CST, gameState } from "../CST"
import { apiUrl } from '../config'

let element

export class SignUpScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.SIGNUP
        })
    }
    init() {

    }
    create() {
        // Sign Up Form
        element = this.add.dom(400, 900).createFromCache('sign-up')

        element.setPerspective(800)
        element.addListener('click')
        element.on('click', function () {
            if (event.target.name === 'gobackButton') {
                gameState.toggleInteractive = true
                this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' })
                this.scene.tweens.add({
                    targets: element, scaleX: 2, scaleY: 2, y: 900, duration: 3000, ease: 'Power3',
                    onComplete: function () { element.setVisible(false), gameState.message.setText('') }
                })
            }
            if (event.target.name === 'signupButton') {
                const inputUsername = this.getChildByName('username')
                const inputPassword = this.getChildByName('password')
                const inputConfirmPassword = this.getChildByName('confirm-password')
                if (inputUsername.value !== '' && inputPassword.value !== '' && inputConfirmPassword.value !== '') {
                    if (inputPassword.value === inputConfirmPassword.value) {
                        gameState.signedUpName = inputUsername.value
                        gameState.toggleInteractive = true
                        this.removeListener('click')
                        this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' })
                        this.scene.tweens.add({
                            targets: element, scaleX: 2, scaleY: 2, y: 900, duration: 3000, ease: 'Power3',
                            onComplete: function () { element.setVisible(false) }
                        })

                        let userData = `{
                            "credentials": {
                                "user_name": "${inputUsername.value}",
                                "password": "${inputPassword.value}",
                                "password_confirmation": "${inputConfirmPassword.value}"
                            }
                        }`
                        fetch(`${apiUrl}/sign-up`, {
                            method: 'POST',
                            headers: {
                                "Content-type": "application/json"
                            },
                            body: userData
                        })
                            .then(res => {
                                gameState.message.setText(`Thank you for signing up, ${gameState.signedUpName}! Please click 'Returning User' to sign in!`)

                            })
                    } else {
                        gameState.message.setText('Your passwords don\'t match!').setPosition(400, 700)
                    }

                } else {
                    gameState.message.setText('You must enter something in these fields!').setPosition(400, 700)
                }
                inputUsername.value = ''
                inputPassword.value = ''
                inputConfirmPassword.value = ''
            }
        })
        this.tweens.add({
            targets: element,
            y: 400,
            duration: 1000,
            ease: 'Power3'
        })
    }
}

