import { CST, gameState } from "../CST"
import { apiUrl } from '../config'

let element

export class CreateCharacterScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.CREATECHARACTER
        })
    }
    init() {

    }
    create() {
        // Create Character Form
        element = this.add.dom(400, 900).createFromCache('create-character')

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
            if (event.target.name === 'createcharacterButton') {
                const inputCreateCharacter = this.getChildByName('create-character')
                if (inputCreateCharacter.value !== '') {
                    let charData = `{
                        "character": {
                            "name": "${inputCreateCharacter.value}",
                            "inventory": []
                        }
                    }`
                    function newCharacterData() {
                        return fetch(`${apiUrl}/characters`, {
                            method: 'POST',
                            headers: {
                                "Content-type": "application/json",
                                "Authorization": `Bearer ${gameState.userData.user.token}`
                            },
                            body: charData
                        })
                            .then(res => {
                                return res.json().then(data => {
                                    gameState.character = data
                                    gameState.toggleInteractive = true
                                    element.scene.tweens.add({ targets: element.rotate3d, x: 1, w: 90, duration: 3000, ease: 'Power3' })
                                    element.scene.tweens.add({
                                        targets: element, scaleX: 2, scaleY: 2, y: 900, duration: 3000, ease: 'Power3',
                                        onComplete: function () { element.setVisible(false), gameState.message.setText('') }
                                    })
                                    return data
                                })
                            })
                    }
                    newCharacterData()
                        .then(data => {
                            gameState.message.setText('New character made! Load \'em up!')
                            return gameState.characterData = data
                        })
                } else {
                    gameState.message.setText('You must enter something in these fields!').setPosition(400, 700)
                }
                inputCreateCharacter.value = ''
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
