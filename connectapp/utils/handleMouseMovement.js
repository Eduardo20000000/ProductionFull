module.exports = handleMouseMovement
const {mouse, Point} = require("@nut-tree-fork/nut-js");
async function handleMouseMovement(socket, data) {

  if(data.data.thing.mouseType == 0){
/**Desfuncional - no estoy hecho para la matematica */
const SENSITIVITY = 2

const MIN_INTERVAL = 16;
let lastMove = 0;


  const dx = data.data.thing.dx * SENSITIVITY;
  const dy = data.data.thing.dy * SENSITIVITY;

  const pos = await mouse.getPosition();

  await mouse.setPosition(
    new Point(pos.x + dx, pos.y + dy)
  );
}
if(data.data.thing.mouseType == 1){
  await mouse.leftClick()
}
if(data.data.thing.mouseType == 2){
  await mouse.rightClick()
}
if(data.data.thing.mouseType == 3){
  await mouse.scrollUp(5)
}
if(data.data.thing.mouseType == 4){
  await mouse.scrollDown(5)
}
}