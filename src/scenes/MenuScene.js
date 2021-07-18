import { CST, gameState } from "../CST"
export class MenuScene extends Phaser.Scene{
    constructor() {
        super({
            key: CST.SCENES.MENU
        })
    }
    init(data) {
        console.log(data)
        console.log('I GOT IT')
    }
    preload() {

    }
    create() {
        // logo
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, 'logo').setDepth(1)
        // background
        this.add.image(0, 0, 'bg').setOrigin(0).setDepth(0)
        // new account star
        let newAccount = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'starfish').setDepth(1)
        // returning user start
        let returningUser = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, 'starfish').setDepth(1)

        newAccount.setInteractive()
        returningUser.setInteractive()
        newAccount.on('pointerdown', () => {
            console.log('pressed signUp crab!')
            gameState.user_name = prompt('Enter a user name please!')
            gameState.password = prompt('Enter a password please!')
            gameState.password_conf = prompt('Confirm your password please!')
            let userData = `{
                "credentials": {
                    "user_name": "${gameState.user_name}",
                    "password": "${gameState.password}",
                    "password_confirmation": "${gameState.password_conf}"
                }
            }`
            fetch('http://localhost:4741/sign-up', {
                method: 'POST',
                headers: {
                  "Content-type": "application/json"
                },
                body: userData
              })
                .then(req => console.log(req))
            gameState.user_name = null
            gameState.password = null
            gameState.password_conf = null
            console.log('after post request, :\n', gameState.user_name, gameState.password, gameState.password_conf)
        })
        returningUser.on('pointerdown', () => {
            console.log('pressed signIn crab!')
            gameState.user_name = prompt('Enter your user name!')
            gameState.password = prompt('Enter your password!')
            let userData = `{
                "credentials": {
                    "user_name": "${gameState.user_name}",
                    "password": "${gameState.password}"
                    }
                }`

            function signInData(){
                return fetch('http://localhost:4741/sign-in', {
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
            const userStuff = signInData()
                .then(data => {
                return gameState.userData = data
            }) 
            gameState.user_name = null
            gameState.password = null
            // gameState.player = this.physics.add.sprite(400, 300, 'crab')
            
        })
    }
}