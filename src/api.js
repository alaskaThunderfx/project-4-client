import apiUrl from './config.js'

const userData = `{
    "credentials": {
        "user_name": "kk",
        "password": "kk"
    }
}`

export const SignIn = async () => {
    let jsonData = await fetch(`${apiUrl}/sign-in`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: userData
      })
}
