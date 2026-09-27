module.exports = {findPrograms}
function findPrograms(){
    const paths = [
        `${process.cwd()}/accesos_directos`
];
const fs = require("fs");
const path = require("path");
let arrayReal = []
function findShortcuts(dir) {
    let shortcuts = [];

    for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            findShortcuts(fullPath)
        } else if (file.name.toLowerCase().endsWith(".lnk")) {
            arrayReal.push(fullPath);
        }
    }

    return "nose";
}

const locations =[
        `${process.cwd()}/accesos_directos`
];
locations.forEach((e) => findShortcuts(e))
let returnArray = []
for(let da = 0; da < arrayReal.length; da++){
    returnArray.push({
        pathName: `${arrayReal[da]}`,
        name: path.basename(`${arrayReal[da]}`, ".lnk")
    })
}
return returnArray;
}