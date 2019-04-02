;(function () {
  const loginButton = document.getElementById('loginButton')
  // If the user is logged in, replace the log in button with a log out button
  if (Cookies.get('username') !== undefined) {
    const logoutButton = document.createElement('button')
    logoutButton.id = 'logoutButton'
    logoutButton.innerHTML = 'Log out'

    const client = new HttpClient()
    logoutButton.addEventListener('click', () => {
      client.get('https://protected-tundra-24167.herokuapp.com/logout/', () =>
        alert('Logged out successfully')
      )
      Cookies.remove('username')
      location.reload()
    })

    loginButton.parentNode.replaceChild(logoutButton, loginButton)
  }
})()
