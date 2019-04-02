;(function () {
  const loginButton = document.getElementById('loginButton')
  // If the user is logged in, replace the log in button with a log out button
  if (!Cookies.get('username')) {
    const logoutButton = document.createElement('button')
    logoutButton.id = 'logoutButton'
    logoutButton.innerHTML = 'Log out'

    const client = new HttpClient()
    loginButton.addEventListener('click', () => {
      client.get('https://protected-tundra-24167.herokuapp.com/logout/', () =>
        alert('Logged out successfully')
      )
      Cookies.remove('username')
    })

    loginButton.parentNode.replaceChild(logoutButton, loginButton)
  }
})()
