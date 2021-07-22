import { CST, gameState } from "../CST"
import { apiUrl } from '../config'

let element

export class ChangePasswordScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.CHANGEPASSWORD
        })
    }
    init() {

    }
    create() {
        // Change Password Form
        element = this.add.dom(400, 900).createFromCache('change-password')

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
            if (event.target.name === 'changepasswordButton') {
                const inputOldPassword = this.getChildByName('password')
                const inputNewPassword = this.getChildByName('new-password')
                if (inputNewPassword.value !== '' && inputOldPassword.value !== '') {
                    let userData = `{
                        "passwords": {
                            "old": "${inputOldPassword.value}",
                            "new": "${inputNewPassword.value}"
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
                            if (!res.ok) {
                                gameState.message.setText('There was an issue changing your password! Please try again').setPosition(400, 700)
                                throw Error(res.statusText)
                            } else {
                                gameState.toggleInteractive = true
                                this.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' })
                                this.scene.tweens.add({
                                    targets: element, scaleX: 2, scaleY: 2, y: 900, duration: 3000, ease: 'Power3',
                                    onComplete: function () { element.setVisible(false), gameState.message.setText('') }
                                })
                            }
                        })
                } else {
                    gameState.message.setText('You must enter something in these fields!').setPosition(400, 700)
                }
                inputOldPassword.value = ''
                inputNewPassword.value = ''
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
