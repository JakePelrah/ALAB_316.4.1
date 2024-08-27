
////////////////////// Part 3 ////////////////////// 
const regForm = document.getElementById('registration')
const displayError = document.getElementById('errorDisplay')
const displaySuccess = document.getElementById('successDisplay')

localStorage.setItem('users', JSON.stringify([]))

const { username, email, password, passwordCheck, terms } = regForm.elements

regForm.addEventListener('submit', (e) => {
    e.preventDefault()


    displayError.style.display = 'block'
    displayError.textContent = ''

    if (!validEmail(email.value)) {
        displayError.textContent += 'Invalid email: domain must not end in example.com.\n '
        return
    }

    if (!validUsername(username.value)) {
        displayError.textContent += 'Invalid Username: It must be at least four characters long without any\n' +
            'whitespace or special characters, and include at least two unique characters.\n'
        return
    }

    if (!validPassword(password.value, username.value)) {
        displayError.textContent += 'Invalid Password: Password must be at least 12 characters long.\n' +
            'Password must have at least one uppercase and one lowercase letter.\n' +
            'Password must contain at least one number.\n' +
            'Password must contain at least one special character.\n' +
            'Password cannot contain the word "password" (uppercase, lowercase, or mixed).';
        return
    }

    if (!passwordsMatch(password.value, passwordCheck.value)) {
        displayError.textContent += 'Passwords do not match'
        return
    }

    if (!terms.checked) {
        displayError.textContent += 'Please agree to the terms.'
        return
    }

    displayError.style.display = 'none'

    const userData = {
        username: username.value.toLowerCase(),
        email: email.value.toLowerCase(),
        password: password.value,
    }

    appendToLocalStorage(userData)
    alert("Form submitted succesfully!")
    regForm.reset()
})




function validEmail(email) {
    const domain = email.split('@')[1]
    if (domain === 'example.com') {
        return false
    }
    else {
        return true
    }
}

function validUsername(username) {
    // / must contain at least two unique characters
    const usernameSet = new Set(username.toLowerCase())
    // no special characters or whitespace
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(username)
    const greaterThanEQ4 = username.length >= 4

    if (greaterThanEQ4 && usernameSet.size > 1 && !hasSpecialChars) {
        return true
    }
    else {
        return false
    }
}


function validPassword(password, username) {

    // password has uppercase
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const containsUsername = password.includes(username)
    const containsPassword = /password/i.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);


    if (hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        !containsUsername &&
        !containsPassword &&
        hasSpecialChar) {
        return true
    }
    else {
        return false
    }
}

function passwordsMatch(password, passwordCheck) {
    return password === passwordCheck
}


function appendToLocalStorage(data) {
    let users = localStorage.getItem('users')
    users = JSON.parse(users)
    users.push(data)
    localStorage.setItem('users', JSON.stringify(users))
}



////////////////////// Part 4 ////////////////////// 

const loginForm = document.getElementById('login')


loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    displayError.style.display = 'block'
    displayError.textContent = ''
    displaySuccess.style.display = 'none'
    displaySuccess.textContent = ''

    const { username, password, persist } = loginForm.elements

    const user = verifyUser(username.value.toLowerCase(), password.value)

    if (user.length <= 0) {
        displayError.textContent += 'Invalid credentials.'
        return
    }

    displaySuccess.textContent += 'Successfully logged in'
    if (persist.checked) {
        displaySuccess.textContent += ', persisting login.'
    }



    displaySuccess.style.display = 'block'
    displayError.style.display = 'none'
    loginForm.reset()

})


function verifyUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users'))
    const user = users.filter(user => user.username === username && user.password === password)
    return user
}



