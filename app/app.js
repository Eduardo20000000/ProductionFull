require('colors')
const WebSocket = require('ws')
const {openProgramHandler} = require('./utils/openProgram');
const handleMouseMovement = require('./utils/handleMouseMovement');
const tecladoHandler = require('./utils/tecladoHandler');
let linkCode;
console.log(`
╔═════════════════════════════════════════════════════╗
║          || - || Iniciando ConnectApp || - ||       ║
║                                                     ║
╚═════════════════════════════════════════════════════╝ 
`.green, `\n© 2026 Eduardo Layana...`.blue)
const appData = {
    "database": {
        "host": "api.connectapp.dpdns.org"
    },
    "server": {
        "port": 443,
        "host": "masterserver.connectapp.dpdns.org"
    }
}
const websocket = new WebSocket(`wss://${appData.server.host}:${appData.server.port}`)
websocket.onopen = () => {
        console.log(`Conexión establecida con el servidor!`.green)
    setTimeout(() => {
    let packet = {
            type: 1,
            data: {
                deviceType: 0, // 0: PC
                loggedIn: false //No es necesario para la laptop, pues el celu es el que se loguea y vincula con la laptop.
            }
        }
        websocket.send(JSON.stringify(packet))
        console.log("📡 Comunicación en proceso (Moviendo ceros y unos...)".yellow)

    }, 3000)
}
websocket.onclose = (event) => {
       console.warn(
            `WebSocket cerrado | código: ${event.code} | motivo: ${event.reason}`
        );

}
 websocket.onmessage = (event) => {
        let message = JSON.parse(event.data)
        if(message.msgType === 4){
            let packet = {
                type: 5,//onReady - Ahora esperamos la respuesta con el codigo de vinculación creado
                data: {}
            }
            setTimeout(() => {
                websocket.send(JSON.stringify(packet))
            }, 2000)
        }
          if(message.msgType === 5){
            var QRCode = require('qrcode')

QRCode.toString(`https://connectapp.dpdns.org/mobile.html?linkCode=${message.data.code}`,{type:'terminal', small: true}, function (err, url) {
  console.log(url)
})
          console.log(`Código de vinculación recibido: ${message.data.code}`.green)
          console.log(`Puedes introducir el código o escanear este QR...`.cyan)
        }

           if(message.msgType === 6){
          console.log(`${"=".repeat(message.data.message.length)}\n${message.data.message}`.green)
        }
         if(message.msgType === 7){
             handleMouseMovement(websocket, message)
            
        }
        if(message.msgType === 8){
            openProgramHandler(linkCode, websocket, message.data)
            
        }
         if(message.msgType === 10){
            tecladoHandler(websocket, message.data)
            
        }
 }