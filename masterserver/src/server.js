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
    socket.on('close', () => {
        if(LINKS.find(link => link.ws == socket)){
            if(!LINKS.find(link => link.ws == socket).mobile) return
            let packet = new PacketBuilder(LINKS.find(link => link.ws == socket).mobile)
            packet.buildPacket(msgType.MESSAGE, {message: "El computador se ha desconectado..."})
            packet.send()
            LINKS.splice(LINKS.findIndex(link => link.ws == socket), 1)
            console.log("sent alert to mobile")
        }
        let celu = LINKS.find(link => link.mobile == socket)
         if(celu){
            let packet = new PacketBuilder(celu.ws)
            packet.buildPacket(msgType.LINK_DEVICE, {message: `El celular de ${celu.mobile.username} se ha desconectado del seridor. Vínculación eliminada`})
            packet.send()
            LINKS.splice(LINKS.findIndex(link => link.mobile == socket), 1)
            console.log("Sent disconnect packet to pc")
        }

        
    })
    socket.on('pong', () => {
        socket.isAlive = true
    })
})
const interval = setInterval(() => {
    server.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
    });
}, 10000);


module.exports = LINKS