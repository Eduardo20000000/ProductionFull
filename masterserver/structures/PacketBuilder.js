module.exports = class PacketBuilder {
    constructor(ws, msgType, data){
        this.ws = ws
        this.msgType = null,
        this.data = null
    }
    send(){
if (this.msgType == null || this.data == null) return
        this.ws.send(JSON.stringify({msgType: this.msgType, data: this.data}))
    }
    buildPacket(msgType, data){
        this.msgType = msgType
        this.data = data
        return this
    }
}