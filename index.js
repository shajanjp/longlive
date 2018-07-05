#!/usr/bin/env node
var robot = require('robotjs');
const argv = require('yargs').argv;

function makeMinutes (hours, minutes) {
  let totalMinutes = minutes;
  totalMinutes += hours * 60;
  return totalMinutes;
}

if (argv.deploy) {
  console.log('loaded...');
  let curTime;
  let tym;
  let inMinutes;
  robot.setMouseDelay(2);

  function doThisThing() {
  let mouse = robot.getMousePos();
    curTime = new Date();
    inMinutes = makeMinutes(curTime.getHours(), curTime.getMinutes());
    if ((inMinutes > 510 && inMinutes < 790) || (inMinutes > 830 && inMinutes < 1085)) {
      robot.moveMouse(mouse.x + 1, mouse.y + 1);
      // console.log('Running...');
    } else {
      console.log('false');
    }
    setTimeout(doThisThing, 60000);
  }

  doThisThing();
}

function beActive(){
  let mouse = robot.getMousePos();
  robot.moveMouse(mouse.x + 1, mouse.y + 1);
  console.log('.');
  setTimeout(beActive, 60000);
}

if (argv.force) {
  beActive();
}
