#!/usr/bin/env node
const robot = require('robotjs');
const argv = require('yargs').argv;
const fs = require('fs');
const https = require('https');
const HOME_PATH = require('os').homedir();

function makeMinutes(hours, minutes) {
  let totalMinutes = minutes;
  totalMinutes += hours * 60;
  return totalMinutes;
}

function beActive() {
  let mouse = robot.getMousePos();
  robot.moveMouse(mouse.x + 1, mouse.y + 1);
  setTimeout(beActive, 60000);
}

function doItLikeDeskTime() {
  let mouse = robot.getMousePos();
  robot.moveMouse(mouse.x + 1, mouse.y + 1);
  updateDesktimeData()
  .then((updatedDesktimeData) => {
    if (updatedDesktimeData.atWorkTime < 33000) {
      780;
      setTimeout(doItLikeDeskTime, 60000);
    } else {
return;
}
  });
}

function getdesktimeUrl(apiKey) {
  return `https://desktime.com/api/v2/json/employee?apiKey=${apiKey}`;
}

function getDesktimeAPIKey() {
  return new Promise((resolve, reject) => {
    fs.readFile(`${HOME_PATH}/.desktime.conf`, (err, apiKey) => {
      if (err) {
        reject({message: 'Could not read desktime config.'});
      } else {
resolve(apiKey);
}
   });
  });
}

function getRequest(url) {
  return new Promise((resolve, reject) => {
    let req = https.get(url, (res) => {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (data) => {
        body += data;
      });
      res.on('end', () => {
        let parsed = JSON.parse(body);
        resolve(parsed);
      });
      req.on('error', (err) => {
        reject(err);
      });
    });
  });
}

function updateDesktimeData() {
  return getDesktimeAPIKey()
  .then((APIKEY) => {
    return getRequest(getdesktimeUrl(APIKEY));
  })
  .then((desktimeDataResponse) => {
    desktimeData = desktimeDataResponse;
    return desktimeDataResponse;
  });
}

function routineWork() {
  let curTime;
  let inMinutes;

  robot.setMouseDelay(2);
  let mouse = robot.getMousePos();
  curTime = new Date();
  inMinutes = makeMinutes(curTime.getHours(), curTime.getMinutes());
  if ((inMinutes > 510 && inMinutes < 790) || (inMinutes > 830 && inMinutes < 1085)) {
    robot.moveMouse(mouse.x + 1, mouse.y + 1);
  } else {
    console.log('-');
  }
  setTimeout(routineWork, 60000);
}

if (argv.deploy) {
  console.log('.');
  routineWork();
}

if (argv.force) {
  console.log('.');
  beActive();
}

if (argv.dt) {
  console.log('.');
  doItLikeDeskTime();
}
