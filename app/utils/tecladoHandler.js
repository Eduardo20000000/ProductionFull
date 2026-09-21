module.exports = tecladoHandler
const {keyboard, Key, KeyboardClass} = require("@nut-tree-fork/nut-js");
async function tecladoHandler(socket, data) {
    if(data.tecla == "borrar"){
        keyboard.type(Key.Backspace)
        return;
    }
    keyboard.type(data.tecla)
}