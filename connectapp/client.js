const API = "https://api.connectapp.dpdns.org/"

var loggedIn = localStorage.getItem('username') && localStorage.getItem('password')
var deviceType = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 1 : 0 // 0: PC | 1: Mobile
localStorage.setItem('deviceType', deviceType)


if(!loggedIn && deviceType === 1 && !window.location.href.includes("login.html")){
    console.log("Cuenta es necesaria para conectar al servidor.")
    location.href = "./login.html"
}
if(loggedIn && deviceType === 1){
    location.href = "./mobile.html"
}
if(deviceType === 0) location.href = "./PC.html"


/**LOGIN */
document.getElementById("btn-login")?.addEventListener("click", async () => {
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    let iniciarSession = document.getElementById("checkBox").checked
    if(!username || !password) return alert("Por favor completa todos los campos.")
    if(iniciarSession){
        let response = await fetch(API+"prod/v1/validate-session?username=" + encodeURIComponent(username) + "&token=" + encodeURIComponent(password))
        let data = await response.json()
        if(!data.success) return alert("Error al iniciar sesión: " + data.message)
            localStorage.setItem("username", username)
            localStorage.setItem("password", password)
        alert("Se ha iniciado sesión.")
        location.href = "./mobile.html"

    }else {
        let response = await fetch(API+"prod/v1/createUser?user=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password))
        let data = await response.json()
        if(!data.success) return alert("Error al crear la cuenta: " + data.message)
            localStorage.setItem("username", username)
            localStorage.setItem("password", password)
        location.href = "./mobile.html"
        alert("Se ha creado tu cuenta exitosamente.")
    }
})