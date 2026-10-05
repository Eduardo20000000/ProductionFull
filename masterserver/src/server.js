const ws = require('ws')
require('dotenv').config("../.env")
const LINKS = []
require('colors')
/**Servidor maestro */
const server = new ws.Server({ port: 8080 })
const PacketBuilder = require('./structures/PacketBuilder')
const msgType = require('./structures/msgType')

console.log(`SERVIDOR INICIADO`.green, `\n© 2026 Eduardo Layana...`.blue)

server.on('connection', (socket) => {
    socket.isAlive = true
    // console.clear()
    socket.on('message', (msg) => {
        try {
            
            const message = JSON.parse(msg)
            const PacketReader = require('./structures/messageReader')
            let reader = new PacketReader(socket, message)
            reader.readMessage()
        } catch (e) {
            console.error("Error processing message:", e)
            socket.close(4000, "Invalid message format.")
        }
    })
    socket.on('close', (code, reason) => {
        if(LINKS.find(link => link.ws == socket)){
            if(!LINKS.find(link => link.ws == socket).mobile) return
            let packet = new PacketBuilder(LINKS.find(link => link.ws == socket).mobile)
            packet.buildPacket(msgType.MESSAGE, {message: "El computador se ha desconectado..."})
            packet.send()
            LINKS.splice(LINKS.findIndex(link => link.ws == socket), 1)
        }
        let celu = LINKS.find(link => link.mobile == socket)
         if(celu){
            let packet = new PacketBuilder(celu.ws)
            packet.buildPacket(msgType.LINK_DEVICE, {message: `El celular de ${celu.mobile.username} se ha desconectado del seridor.\nPuedes volver a reconectarte leyendo el QR o intruciendo el código de vinculación`})
            packet.send()
            LINKS[LINKS.findIndex(link => link.mobile == socket)].taken = false
            LINKS[LINKS.findIndex(link => link.mobile == socket)].mobile = null        

        }

        
    })
    socket.on('pong', () => {
        socket.isAlive = true
    
    })
})
setInterval(() => {
    server.clients.forEach((ws) => {
        if (ws.isAlive === false) {
             ws.terminate();
            return
        }

        ws.isAlive = false;
        ws.ping();
    });
}, 10000);


module.exports = LINKS