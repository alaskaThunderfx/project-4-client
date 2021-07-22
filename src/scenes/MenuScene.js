import { apiUrl } from './../config.js'
import { CST, gameState } from "../CST"
import { SignUpScene } from './SignUpScene.js'

export class MenuScene extends Phaser.Scene{
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
        
        let messages = gameState.message = this.add.text(this.game.renderer.width / 2, this.game.renderer.height / 2 - 75, "", { color: "#000000"}).setDepth(5). setOrigin(0.5)
        // logo
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, 'logo').setDepth(1)
        // background
        this.add.image(0, 0, 'bg').setOrigin(0).setDepth(0)
        // new account star
        let newAccount = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'starfish').setDepth(1)
        this.add.text(this.game.renderer.width / 2 + 30, this.game.renderer.height / 2, 'New User', { color: 'black'}).setDepth(1)
        // returning user star
        let returningUser = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, 'starfish').setDepth(1)
        this.add.text(this.game.renderer.width / 2 + 30, this.game.renderer.height / 2 + 100, 'Returning User', { color: 'black' }).setDepth(1)


        newAccount.setInteractive()
        returningUser.setInteractive()

        newAccount.on('pointerdown', () => {
            this.scene.launch(CST.SCENES.SIGNUP)
        })
        
        returningUser.on('pointerdown', () => {
            gameState.user_name = prompt('Enter your user name!')
            gameState.password = prompt('Enter your password!')
            let userData = `{
                "credentials": {
                    "user_name": "${gameState.user_name}",
                    "password": "${gameState.password}"
                    }
                }`

            function signInData(){
                return fetch(`${apiUrl}/sign-in`, {
                method: 'POST',
                headers: {
                  "Content-type": "application/json"
                },
                body: userData
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
                    if (data.user === undefined) {
                        this.add.text(this.add.text(300, 300, 'There was an error! Try again', { color: 'black' }))
                    } else {
                        gameState.userData = data
                        gameState.user_name = null
                        gameState.password = null
                        this.scene.start(CST.SCENES.LOGGEDIN)
                        
                    }
                    
            })
            
            

        })
    }
}