
const API = "https://api.connectapp.dpdns.org/prod/v1/"
var websocket = null;
var savedHTML = []
var holding = false
var connectionCode = ""
var lastX;
var LastY
var interval;
const params = new URLSearchParams(window.location.search);

const linkCode = params.get("linkCode");
let añadidos = [];
var modos = {
    0: "default",
    1: "teclado-mouse",
    2: "indexado-programas"
}
var current = 0;
let obj = {
    0: "Conectando",
    1: "Conectado",
    2: "Cerrando",
    3: "Cerrado"
}
window.addEventListener('beforeunload', () => {
    if(!websocket && websocket.readyState == 1)
        websocket.close()
})
checkSession()
let previusValue = ""
async function loadMode(mode){

    if(modos[mode] == null) return;
           if(añadidos.length && modos[mode] !== "indexado-programas"){
            añadidos.forEach((añadido) => {
                añadido.removeEventListener('click', null)
                              añadido.hidden = true

              añadido = null
            })
            añadidos = []
        }
        if(document.getElementById('teclado') && modos[mode] !== "teclado"){
         document.getElementById('teclado').removeEventListener('input', null)
        document.getElementById('teclado').removeEventListener('beforeinput', null)
        }

    if(modos[mode] == 'default'){
    document.getElementById("microsoftEdge").hidden = false
    document.getElementById("VisualStudioCode").hidden = false
    document.getElementById("calc").hidden = false
    document.getElementById("notepad").hidden = false
    document.getElementById("teclado").hidden = true;
    }
    if(modos[mode] == "teclado-mouse"){
        
        document.getElementById("microsoftEdge").hidden = true
    document.getElementById("VisualStudioCode").hidden = true
    document.getElementById("calc").hidden = true
    document.getElementById("notepad").hidden = true
    document.getElementById("teclado").hidden = false;
    document.getElementById("teclado").addEventListener('input', (event) => {
        let tecla = event.target.value;
        
     let packet = {
      type: 10,
      data : {
        tecla,
        connectionCode

      }
    }
    
       
    websocket.send(JSON.stringify(packet))
        event.target.value = "";

    })
    document.getElementById('teclado').addEventListener("beforeinput", (e) => {

    if (e.inputType === "deleteContentBackward") {
           let packet = {
      type: 10,
      data : {
        tecla: "borrar",
        connectionCode

      }
    }
        websocket.send(JSON.stringify(packet))
    }
});
    
    }
    console.log(modos[mode] == "indexado-programas")
    console.log(modos[mode])
    if(modos[mode] == "indexado-programas"){
//  alert("Cargado")
    document.getElementById("teclado").hidden = true;
    document.getElementById("microsoftEdge").hidden = true
    document.getElementById("VisualStudioCode").hidden = true
    document.getElementById("calc").hidden = true
    document.getElementById("notepad").hidden = true
    
    let packet = {
        type: 11,//search
        data: {
            connectionCode
        }
    }
        websocket.send(JSON.stringify(packet))

    }
}
async function checkSession(){
    console.log("Verificando sesión... (En base a datos guardados)")
    let username = localStorage.getItem("username")
    let password = localStorage.getItem("password")
    if(!username || !password) return location.href = "./login.html"
     let response = await fetch(API+"validate-session?username=" + username + "&token=" + password)
        let data = await response.json()
    if(!data.success) return location.href = "./login.html"

    initWS()

    
    interval = setInterval(() => {
        document.getElementById("mobile-info").innerHTML = `
    <h3 id="mobile-info">
            Cuenta de: ${data.user.username} <br>
            Conexión al servidor: ${obj[websocket.readyState]}.
            `
            if(websocket.readyState == 1 || websocket.readyState == 3) clearInterval(interval)
    }, 1000)
  
}
function initWS(){
     websocket = new WebSocket("wss://masterserver.connectapp.dpdns.org:443")
     websocket.onclose = () => {
        alert("Conexión cerrada...")
        location.reload()
     }
    websocket.onopen = () => {
        clearInterval(interval)
          document.getElementById("mobile-info").innerHTML = `
    <h3 id="mobile-info">
            Conexión al servidor: Operacional <br>
        </h3>
    `
          let packet = {
            type: 1,
            data: {
                username: localStorage.getItem("username"),
                token: localStorage.getItem("password"),
                deviceType: 1, // 1: celu
                loggedIn: localStorage.getItem("username") && localStorage.getItem("password") ? true : false
            }
        }
        websocket.send(JSON.stringify(packet))
    }
    websocket.onmessage = (event) => {
        let message = JSON.parse(event.data)

        if(message.msgType === 3){
            alert(message.data.message)
            if(message.data.message == "El computador se ha desconectado...") location.reload()
        }
        if(message.msgType === 4){
            console.log("Conexión al servidor exitosa.")
            if(linkCode !== null){
                  websocket.send(JSON.stringify({
        type: 6,
        data: {connectionCode: linkCode, username: localStorage.getItem("username"), token: localStorage.getItem("password")}
    }))
            connectionCode = linkCode
            }
        }
        if(message.msgType === 6){
         
                alert("Conectado a la instancia con el monitor.")
                //no mas drama, ya esta autenticado el usuario!
                document.getElementById("mobile-info").innerHTML = `
    <h3 id="mobile-info" style="color: green;">
            Cuenta de: ${localStorage.getItem('username')} <br>
            Código de vinculación correcto! <br>
             <br>
             Por favor revise su PC para ver si la vinculación fue exitosa. <br>
        </h3>
    `
    document.getElementById("contenedor").hidden = false;
    document.getElementById('tutorial').hidden = true
    document.getElementById('touchpad').hidden = false
    document.getElementById('buttonsArea').hidden = false
    document.getElementById('buttonsArea').style.display = "flex"
    document.getElementById("microsoftEdge").hidden = false
    document.getElementById("VisualStudioCode").hidden = false
    document.getElementById("calc").hidden = false
    document.getElementById("notepad").hidden = false
    addListeners()
  }
 if(message.msgType === 11){
    console.log("Programas del computador obtenidos..")
    let programas = message.data.programas
    console.log(message.data.programas)
for (const programa of programas) {

    const button = document.createElement("button");

    button.textContent = programa.name;
    
    button.addEventListener("click", () => {

        let packet = {
            type: 8,
            data: {
                programName: programa.pathName,
                connectionCode
            }
        };

        websocket.send(JSON.stringify(packet));
    });

    document.getElementById("contenedor").appendChild(button);
    añadidos.push(button)
}
  }
    }
}
document.getElementById("btn-code").addEventListener("click", () => {
    let code = document.getElementById("code").value
    if(websocket !== null && websocket.readyState !== 1) alert("El servidor no esta disponible.")
    if(!code) return alert("Por favor ingresa un código de vinculación.")

                        document.getElementById("mobile-info").innerHTML = `
    <h3 id="mobile-info">
            Cuenta de: ${localStorage.getItem('username')} <br>
            Se ha enviado el código al servidor! <br>
             <br>
        </h3>
    `


    websocket.send(JSON.stringify({
        type: 6,
        data: {connectionCode: code, username: localStorage.getItem("username"), token: localStorage.getItem("password")}
    }))
            connectionCode = code


    })
      document.getElementById('back').addEventListener("click", () => {
        if(connectionCode == undefined || connectionCode == null) return;
            current--;
            if(current < 0) current = 2
            loadMode(current)
        })
            document.getElementById('front').addEventListener("click", () => {
                        if(connectionCode == undefined || connectionCode == null) return;

            current++;
            if(current > 2) current = 0
            loadMode(current)
        })
    function addListeners(){
      
        document.getElementById('touchpad').addEventListener("touchstart", (event) => {
            const touch = event.touches[0]
            lastX = touch.clientX
            LastY = touch.clientY   
        })
    document.getElementById("touchpad").addEventListener("touchmove", (event) => {
        event.preventDefault()
        let touch = event.touches[0]
        let touchX = touch.clientX - lastX
        let touchY = touch.clientY - LastY
        lastX = touch.clientX
        LastY = touch.clientY
        let packet = {
            type: 7,
            data: {
                mouseType: 0,
                dx: touchX,
                dy: touchY,
                connectionCode
            }
        }
        websocket.send(JSON.stringify(packet))

    })
    document.getElementById("microsoftEdge").addEventListener("click", () => {
        let packet = {
      type: 8,
      data : {
        programName: "msedge",
        connectionCode
      }
    }
        websocket.send(JSON.stringify(packet))
    })
    document.getElementById("VisualStudioCode").addEventListener("click", () => {
        let packet = {
      type: 8,
      data : {
        programName: "code",
        connectionCode
      }
    }
        websocket.send(JSON.stringify(packet))
    })
    document.getElementById("calc").addEventListener("click", () => {
        let packet = {
      type: 8,
      data : {
        programName: "calc",
                connectionCode

        
      }
    }
        websocket.send(JSON.stringify(packet))
    })
    document.getElementById("notepad").addEventListener("click", () => {
        let packet = {
      type: 8,
      data : {
        programName: "notepad",
                connectionCode

      }
    }
        websocket.send(JSON.stringify(packet))

    })
    document.getElementById("leftClick").addEventListener("click", () => {
        let packet = {
      type: 7,
      data : {
        mouseType: 1,
        connectionCode
      }
    }
        websocket.send(JSON.stringify(packet))
    })
        document.getElementById("rightClick").addEventListener("click", () => {
        let packet = {
      type: 7,
      data : {
        mouseType: 2,
        connectionCode
      }
    }
        websocket.send(JSON.stringify(packet))
    })
}
