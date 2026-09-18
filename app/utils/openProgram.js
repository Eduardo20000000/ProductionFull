module.exports = {openProgramHandler}
const fs = require('fs')
async function openProgramHandler(linkCode, ws, data, executePath) {
    const programName = data.program;
    const path = require('path');
    const { exec, execSync, spawn } = require('child_process');
    
    const specialApps = {
  msedge: "microsoft-edge:",
  notepad: "notepad",
  calc: "calc",
};

    function findProgramPath(name) {
      try {
        if(specialApps[name]) {
          return {isSpecial: true, name: specialApps[name]};
        }
    const result = execSync(`where.exe ${name}`, {
      encoding: "utf8",
    });

    return result.split("\n")[0].trim();
  } catch {
    return null;
  }
    }
    let programPath = findProgramPath(programName);
    if(programPath && programPath.isSpecial) {
      exec(`start "" "${programPath.name}"`, (error) => {})
      return;
    }
        let packetbBuilder = require('./packetBuilder');
    if(!programPath) return console.log("No se encontro ni una wea")
    if(executePath) programPath = executePath;

    exec(`start "" "${programPath}"`, (error) => {
    let packetbBuilder = require('./packetBuilder');
        if (error) {
           console.error(`Error al abrir ${programName}:`.red, error);
           let packet = new packetbBuilder(ws)
           packet.buildPacket(9, {message: `Error al abrir ${programName}!`, linkCode})
           packet.send()
            return;
        } else {
            let packet = new packetbBuilder(ws)
           packet.buildPacket(9, {message: `Se ha abierto ${programName} extitosamente!`, linkCode})
           packet.send()
        }
    })
}