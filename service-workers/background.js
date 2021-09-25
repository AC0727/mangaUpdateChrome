console.log("start");
throw new Error("lol");
console.log("end");

//where to place this in background?
chrome.runtime.onMessage.addListener(data => {
  if (data.type === 'notification') {
    chrome.notifications.create('', data.options);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Installed');
  scheduleRequest();
  scheduleWatchdog();
  startRequest();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('startup');
  startRequest();
});

chrome.alarms.onAlarm.onInstalled((alarm) => {
  //if watchdog is triggered, checks if refresh is still there
  if(alarm && alarm.name === 'watchdog') {
    chrome.alarms.get('refresh', alarm => {
      if(alarm) {
        console.log('refresh exists!');
      }
      else {
        //start a new request and reschedule refresh
        console.log('refresh does not exist, start new one');
        startRequest();
        scheduleRequest();
      }
    });
  }

  //if refresh is triggered, start new request
    else {
      startRequest();
    }

});

//-------------------------------------------------------------

// schedule new fetch every 30 min
function scheduleRequest() {
  console.log('schedule refresh alarm to 60 min');
  chrome.alarms.create('refresh', {periodInMinutes: 60});
}

//watchdog checks if refresh alarm is available
function scheduleWatchdog() {
  console.log('schedule watchdog alarm to 10 min');
  chrome.alarms.create('watchdog', {periodInMinutes: 10});
}

//fetch data and save to local storage
async function startRequest() {
  console.log('started request');
  const latest = await fetchUpdate();
  saveUpdate();
}


function fetchUpdate() {
  let manga = "my hero academia"; //for testing
  manga = manga.toLowerCase().replace(/ /g, "_"); //g is to replace all occurence of a space
  const url = 'http://fanfox.net/manga/' + manga;
  const fetch = require("./updateCh.js");

  return fetch.checkUpdate(url);

}


//saves the new data
function saveUpdate(latest) {


}






