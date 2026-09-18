
const msgType = require('../structures/msgType')
const packetBuilder = require('../structures/PacketBuilder')
module.exports = {handshakeHandler}
async function handshakeHandler(socket, message){
   

    if(message.deviceType && message.deviceType !== 0) {

         if(!message.loggedIn) return ws.close()
    if(!message.username) return ws.close()
    if(!message.token) return ws.close()

  let response = await fetch("https://api.connectapp.dpdns.org/prod/v1/validate-session?username=" + message.username + "&token=" + message.token)
        let result = await response.json()
    if(!result.success) 
        if(socket.readyState === socket.OPEN) socket.close(4003, "Invalid session.")
    
        }
    //Lo dejamos entrar al server.
    let packet =  new packetBuilder(socket)
    .buildPacket(msgType.HANDSHAKE_SUCCESS, {message: "Handshake successful."}).send()

    socket.deviceType = message.deviceType // 0: PC | 1: Mobile
    socket.username = message.username

}