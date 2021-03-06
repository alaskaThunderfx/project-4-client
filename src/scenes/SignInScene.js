import { CST, gameState } from "../CST"
import { apiUrl } from '../config'

let element

export class SignInScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.SIGNIN
        })
    }
    init() {

    }
    create() {
        gameState.proceed = false
        // Sign In Form
        element = this.add.dom(400, 900).createFromCache('sign-in')

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
            if (event.target.name === 'signinButton') {
                const inputUsername = this.getChildByName('username')
                const inputPassword = this.getChildByName('password')
                if (inputUsername.value !== '' && inputPassword.value !== '') {
                    let userData = `{
                            "credentials": {
                                "user_name": "${inputUsername.value}",
                                "password": "${inputPassword.value}"
                                }
                            }`

                    function signInData() {
                        return fetch(`${apiUrl}/sign-in`, {
                            method: 'POST',
                            headers: {
                                "Content-type": "application/json"
                            },
                            body: userData
                        })
                            .then(res => {
                                if (!res.ok) {
                                    gameState.message.setText('There was an issue signing in! Please try again').setPosition(400, 700)
                                    throw Error(res.statusText)
                                } else {
                                    gameState.proceed = true
                                    gameState.toggleInteractive = false
                                    gameState.launchScene()
                                    element.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' })
                                    element.scene.tweens.add({
                                        targets: element, scaleX: 2, scaleY: 2, y: 900, duration: 3000, ease: 'Power3',
                                        onComplete: function () { element.setVisible(false) }
                                    })
                                    element.removeListener('click')
                                    return res
                                }
                            })
                            .then(res => {
                                return res.json().then(data => {
                                    gameState.user = data
                                    return data
                                })
                            })
                    }
                    signInData()
                        .then(data => {
                            gameState.userData = data

                        })
                } else {
                    gameState.message.setText('You must enter something in these fields!').setPosition(400, 700)
                }
                inputUsername.value = ''
                inputPassword.value = ''
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

