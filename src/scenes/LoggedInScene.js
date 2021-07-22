import { apiUrl } from './../config.js'
import { CST, gameState } from "../CST";


export class LoggedInScene extends Phaser.Scene{
    constructor() {
        super({
            key: CST.SCENES.LOGGEDIN
        })
    }
    init() {

    }
    preload() {

    }
    create() {
        gameState.toggleInteractive = true
        gameState.message = this.add.text(this.game.renderer.width / 2 + 30, this.game.renderer.height / 2, '', { color: 'black' }).setOrigin(0.5).setDepth(1)
        // logo
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, 'logo').setDepth(1)
        // background
        this.add.image(0, 0, 'bg').setOrigin(0).setDepth(0)

        // change password star
        let changePassword = this.add.image(50, 750, 'starfish').setDepth(1)
        this.add.text(80, 750, 'Change Password', { color: 'black' }).setDepth(1)
        changePassword.setInteractive()

        // sign out star
        let signOut = this.add.image(675, 750, 'starfish').setDepth(1)
        this.add.text(705, 750, 'Sign Out', { color: 'black' }).setDepth(1)
        signOut.setInteractive()

        // new character
        let createCharacter = this.add.image(500, 250, 'starfish').setDepth(1)
        this.add.text(530, 250, 'Create Character', { color: 'black' }).setDepth(1)
        createCharacter.setInteractive()

        // load character
        let loadCharacter = this.add.image(150, 250, 'starfish').setDepth(1)
        this.add.text(180, 250, 'Load Character', { color: 'black' }).setDepth(1)
        loadCharacter.setInteractive()

        signOut.on('pointerdown', () => {
            fetch(`${apiUrl}/sign-out`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                }
              })
            gameState.userData = null
            this.scene.start(CST.SCENES.MENU)
        })

        changePassword.on('pointerdown', () => {
            if (gameState.toggleInteractive === true) {
                gameState.toggleInteractive = false
                this.scene.launch(CST.SCENES.CHANGEPASSWORD)
            }
        })

        createCharacter.on('pointerdown', () => {
            if (gameState.toggleInteractive === true) {
                gameState.toggleInteractive = false
                this.scene.launch(CST.SCENES.CREATECHARACTER)
            }
        })

        loadCharacter.on('pointerdown', () => {
            function newCharacterData(){
                return fetch(`${apiUrl}/characters`, {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                }
              })
                .then(res => { 
                    return res.json().then(data => {
                        gameState.character = data
                        return data
                    }) 
                })
            }
            
            newCharacterData()
                .then(data => {
                    let x = 50
                    let y = 300
                    
                    const usersChars = []
                    data.characters.forEach(char => {
                        if (char.owner === gameState.userData.user._id) {
                            usersChars.push(char)
                        }})

                    if (usersChars[0] === undefined) {
                        gameState.message.setText('No characters to load!')
                        return
                    } else {
                        gameState.message.setText('')
                        usersChars.forEach(char => {
                            this.add.text(x, y, char.name, { color: 'black' })
                            let crab = this.add.image(x + 150, y, 'crab')
                            crab.setInteractive()
                            crab.on('pointerdown', () => {
                                this.scene.start(CST.SCENES.PICKEDCHARACTER, char)
                                return gameState.currentCharacter = char
                            })
                            y += 50
                            return
                        })
                    }
                })
            })
        }
    }