if(window.localStorage.getItem("deviceType") == 0){

document.getElementById('connect').addEventListener('click', async () => {
    console.log("conectando al servidor...")
    let websocket = new WebSocket("ws://localhost:8080")
    websocket.onopen = () => {
        console.log("Conectado al servidor.")
        let packet = {
            type: 1,
            data: {
                username: localStorage.getItem("username"),
                token: localStorage.getItem("password"),
                deviceType: 0, // 0: PC
                loggedIn: localStorage.getItem("username") && localStorage.getItem("password") ? true : false
            }
        }
        websocket.send(JSON.stringify(packet))
    }

    websocket.onmessage = (event) => {
        let message = JSON.parse(event.data)
        console.log(message)
        if(message.msgType === 4){
            document.getElementById('events').innerHTML += `<p style="color: green;">\nConexión al servidor exitosa.</p> `
            document.getElementById('top-info').innerHTML = `<h4 style="color:#475569; position: absolute; top: 0px;">Conexion al servidor: Exitosa 🔓 Dispositivo: PC 💻</h4>`
            let packet = {
                type: 5,
                data: {}
            }
            websocket.send(JSON.stringify(packet))
        }
        if(message.msgType === 5){
            let code = message.data.code
            document.getElementById('box-code').innerHTML = `<h3 style="color: #334155;">${code}</h3>`
            document.getElementById('events').innerHTML += `<p style="color: blue;">\nCódigo de vinculación recibido</p>`
        }
        if(message.msgType === 6){
            document.getElementById('events').innerHTML = `<p style="color: green;">\n${message.data.message}</p> `

        }

    }

})
}