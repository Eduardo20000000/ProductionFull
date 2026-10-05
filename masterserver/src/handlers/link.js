const PacketBuilder = require("../structures/PacketBuilder")
const msgType = require("../structures/msgType")
const LINKS = require("../server")
module.exports = class ConnectionLink {
    constructor(ws, message){
        this.ws = ws
        this.message = message
    }
    async linkDevice(){
        let ws = LINKS.find(link => link.code === this.message.connectionCode && link.taken === false && link.ws.readyState === 1)
        if(!ws) {
            let packet = new PacketBuilder(this.ws)
            packet.buildPacket(msgType.MESSAGE, {message: "El código proporcionado no es válido o el dispositivo a controlar está desconectado."})
            packet.send()
            return
        }
        //Linkear dispositivos.
        ws.taken = true
        ws.mobile = this.ws
        let packet = new PacketBuilder(this.ws)
        packet.buildPacket(msgType.LINK_DEVICE, {message: "Dispositivo linkeado correctamente!"})
        packet.send()
          packet = new PacketBuilder(ws.ws)
        packet.buildPacket(msgType.LINK_DEVICE, {message: `La cuenta con nombre ${this.ws.username} ha linkeado su dispositivo correctamente!`})
        packet.send()
    }

}