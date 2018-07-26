#!/usr/bin/env node
const robot = require('robotjs');
const argv = require('yargs').argv;
const fs = require('fs');
const https = require('https');
const HOME_PATH = require('os').homedir();
const exec = require('child_process').exec;

let workTimeLimit = 33120;
let deskTimeLimit = 29160;

robot.setMouseDelay(2);

function isOkToLeave(desktimeData) {
  if (desktimeData.atWorkTime > workTimeLimit && desktimeData.desktimeTime > deskTimeLimit) {
      return true;
    } else {
      return false;
    }
}

function isWorkTime(inMinutes) {
  return ((inMinutes > 510 && inMinutes < 790) || (inMinutes > 830 && inMinutes < 1230));
}

function execute(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

function getUp() {
  let mouse = robot.getMousePos();
  robot.moveMouse(mouse.x + 1, mouse.y + 1);
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
    return desktimeDataResponse;
  });
}

function timeInMinutes() {
  let now = new Date();
  let inMinutes = (now.getHours() * 60) + now.getMinutes();
  return new Promise((resolve, reject) => {
    resolve(inMinutes);
  });
}

function doItLikeDeskTime() {
  updateDesktimeData()
  .then((updatedDesktimeData) => {
    timeInMinutes()
    .then((inMinutes) => {
      if (!isOkToLeave(updatedDesktimeData) && isWorkTime(inMinutes)) {
        getUp();
        return setTimeout(doItLikeDeskTime, 60000);
      } else if (isOkToLeave(updatedDesktimeData)) {
        if (argv.after) {
return execute(argv.after);
} else if (argv.sleep) {
return execute('systemctl suspend');
} else {
return execute('notify-send "Pack up"');
}
      } else {
        return setTimeout(doItLikeDeskTime, 60000);
      }
    });
  });
}

function beActive() {
  getUp();
  setTimeout(beActive, 60000);
}

function routineWork() {
  timeInMinutes()
  .then((inMinutes) => {
    if ((inMinutes > 510 && inMinutes < 790) || (inMinutes > 830 && inMinutes < 1230)) {
      getUp();
      setTimeout(routineWork, 60000);
    } else {
      setTimeout(routineWork, 60000);
    }
  });
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
