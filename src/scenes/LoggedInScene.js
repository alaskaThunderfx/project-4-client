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
            console.log('pressed signOut crab!')
            fetch('http://localhost:4741/sign-out', {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${gameState.userData.user.token}`
                }
              })
                .then(res => console.log(res))
            gameState.userData = null
            this.scene.start(CST.SCENES.MENU)
        })

        changePassword.on('pointerdown', () => {
            gameState.oldPassword = prompt('Enter your old password!')
            gameState.newPassword = prompt('Enter your new password!')
            let userData = `{
                "passwords": {
                    "old": "${gameState.oldPassword}",
                    "new": "${gameState.newPassword}"
                    }
                }`
            fetch('http://localhost:4741/change-password', {
                method: 'PATCH',
                headers: {
                  "Content-type": "application/json",
                  "Authorization": `Bearer ${gameState.userData.user.token}`
                },
                body: userData
              })
                .then(res => { 
                    return res.json().then(data => {
                        gameState.user = data
                        return data
                    }) 
                })
        })

        createCharacter.on('pointerdown', () => {
            console.log('You pressed Create Character crab!')
            console.log(gameState.characterData)
            let charData = `{
                "character": {
                    "name": "${prompt('Name your new character!')}",
                    "inventory": []
                }
            }`
            function newCharacterData(){
                return fetch('http://localhost:4741/characters', {
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
                        return data
                    }) 
                })
            }
            const charStuff = newCharacterData()
                .then(data => {
                return gameState.characterData = data
            })
        })

        loadCharacter.on('pointerdown', () => {
            console.log('You pressed Index Characters crab!')
            console.log('gameState.characterData')
            console.log(gameState.characterData)
            function newCharacterData(){
                return fetch('http://localhost:4741/characters', {
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
            
            const charStuff = newCharacterData()
                .then(data => {
                    let x = 50
                    let y = 300
                    const usersChars = []
                    console.log(data)
                    data.characters.forEach(char => {
                        if (char.owner === gameState.userData.user._id) {
                            console.log(char)
                            usersChars.push(char)
                        })

                        if (usersChars.length === 0) {
                            console.log('no characters')
                            this.add.text(400, 400, 'No characters to load!', { color: 'black' })
                            return
                        } else {
                            this.add.text(x, y, char.name, { color: 'black' })
                            y += 50
                            return
                        }
                        })
                    console.log(gameState.userData)
                    return gameState.characterData = data
            })
        }
    }
}