export let apiUrl
const apiUrls = {
  production: 'https://dry-ocean-96283.herokuapp.com',
  development: 'http://localhost:4741'
}

if (window.location.hostname === 'localhost') {
  apiUrl = apiUrls.development
} else {
  apiUrl = apiUrls.production
}
