const PacketBuilder = require("./PacketBuilder")
        const msgType = require("./msgType")
const LINKS = require("../server")
function randomCode(){
    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let code = ''
    for(let i = 0; i < 10; i++){
        code += abc.charAt(Math.floor(Math.random() * abc.length))
    }
    return code
}
module.exports = class PacketReader {
    constructor(ws, msg){
        this.ws = ws
        this.msg = msg
    }
    getMessageType(){
        if(!this.msg.type){
            //Packet Builder to disconnect.
            let packet = new PacketBuilder(this.ws)
            packet.buildPacket(msgType.DISCONNECT, {reason: "No type specified."})
            packet.send()
            return null
        }
        const type = Object.values(msgType).find(t => t === this.msg.type)
          if(!type){
            let packet = new PacketBuilder(this.ws)
            packet.buildPacket(msgType.DISCONNECT, {reason: "Invalid type specified."})
            packet.send()
            return null
        }
        return type
    }
    readMessage(){
        let type = this.getMessageType()
        if(type == null) return
        if(type === msgType.CONNECT){
            const {handshakeHandler} = require("../handlers/handshake")
            handshakeHandler(this.ws, this.msg.data)
        }
        if(type === msgType.LINK_DEVICE_onReady){
            if(this.ws.deviceType !== 0) return //Solo el pc se puede linkear a un dispositivo movil, no al reves.
            this.ws.connectionCode =  randomCode()
            LINKS.push({ws: this.ws, code: this.ws.connectionCode, taken: false, mobile: null})
            let packet = new PacketBuilder(this.ws)
            packet.buildPacket(msgType.LINK_DEVICE_onReady, {code: this.ws.connectionCode})
            packet.send()
        }
               if(type === msgType.LINK_DEVICE){
          
            if(this.ws.deviceType !== 1) return

            const ConnectionLink = require("../handlers/link")
            const handler = new ConnectionLink(this.ws, this.msg.data)
            handler.linkDevice()
        }
        if(type === msgType.OPEN_PROGRAM){
            if(this.ws.deviceType !== 1) return // exclusivamente celu
            let connectCode = LINKS.find(link => link.code === this.msg.data.connectionCode && link.taken === true)
            if(!connectCode){
                let packet = new PacketBuilder(this.ws)
                packet.buildPacket(msgType.MESSAGE, {message: "Invalid connection code."})
                packet.send()
                return this.ws.close()
            }
            let packet = new PacketBuilder(connectCode.ws)
            packet.buildPacket(msgType.OPEN_PROGRAM, {program: this.msg.data.programName})//data.{}
            packet.send()

        }
                if(type === msgType.TECLADO){
            if(this.ws.deviceType !== 1) return // exclusivamente celu
            let connectCode = LINKS.find(link => link.code === this.msg.data.connectionCode && link.taken === true)
            if(!connectCode){
                let packet = new PacketBuilder(this.ws)
                packet.buildPacket(msgType.MESSAGE, {message: "Invalid connection code."})
                packet.send()
                return this.ws.close()
            }
            let packet = new PacketBuilder(connectCode.ws)
            packet.buildPacket(msgType.TECLADO, {tecla: this.msg.data.tecla})//data.{}
            packet.send()

        }
        if(type === msgType.MOUSE_MOVE){
            if(this.ws.deviceType !== 1) return // exclusivamente celu
            let connectCode = LINKS.find(link => link.code === this.msg.data.connectionCode && link.taken === true)
            if(!connectCode){
                let packet = new PacketBuilder(this.ws)
                packet.buildPacket(msgType.MESSAGE, {message: "Invalid connection code."})
                packet.send()
                return this.ws.close()
            }
            let packet = new PacketBuilder(connectCode.ws)
            let thing = this.msg.data
            packet.buildPacket(msgType.MOUSE_MOVE, {thing})//data.{}
            packet.send()

        }
        if(type === msgType.MONITOR_TO_CLIENT){
            let code = this.msg.data.linkCode
            if(!code) return;
            let link = LINKS.find(link => link.code === code && link.taken === true)
            let packet = new PacketBuilder(link.mobile)
            packet.buildPacket(msgType.MONITOR_TO_CLIENT, {message: this.msg.data.message})
            packet.send()
        }
          if(type === msgType.INDEXAR){
            console.log(this.msg.data)
            if(!this.msg.data.programas){
            let code = this.msg.data.connectionCode
            if(!code) return;
            let link = LINKS.find(link => link.code === code && link.taken === true)
            let packet = new PacketBuilder(link.ws)
            packet.buildPacket(msgType.INDEXAR, {message: "hola mundo"})
            packet.send()
            }else {//HABLAMOS DE MONITOR AL CELUUUU 
                let link = LINKS.find(c => c.taken && c.code === this.msg.data.connectCode)
                if(!link) return;
                let packet = new PacketBuilder(link.mobile)
                packet.buildPacket(msgType.INDEXAR, {programas: this.msg.data.programas})
                packet.send();

            }
        }
    }
}