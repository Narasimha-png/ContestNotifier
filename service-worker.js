self.addEventListener('install', event => {
    console.log('Service Worker installed.');
    scheduleDailyNotification();
});

self.addEventListener('activate', event => {
    console.log('Service Worker activated.');
});

self.addEventListener('message', event => {
    if (event.data === 'scheduleDailyNotification') {
        scheduleDailyNotification();
    }
});

function sendDailyNotification(head , body) {
    return self.registration.showNotification(head , {
        body: body,
        icon: 'logo.png' // optional icon
    }).then(() => {
        console.log('Notification sent!');    
    }).catch(error => {
        console.error('Notification failed:', error);
    });
}

function contestNotifier(){
    var day = getWeekday(new Date()) ;
    if( day == 'Sunday'){
        sendDailyNotification("LeetCode Weekly Contest" , "Starts at 08:00 AM" );
        sendDailyNotification("Geeks For Geeks Contest" , "Starts at 07:00 PM"  ) ;
    }
    else if( day == 'Monday'){
        sendDailyNotification("LeetCode Weekly Contest" , "Starts at 08:00 AM" );
        sendDailyNotification("Geeks For Geeks Contest" , "Starts at 07:00 PM"  ) ;
    }
    else if( day == 'Saturday' ){
        if(isDateInList(biweeklySaturdays, new Date()))
        sendDailyNotification("LeetCode Bi-Weekly Contest" , "Starts at 08:00 PM" );
    }
    else if( day == 'Wednesday' ){
        sendDailyNotification("CodeChef Contest" , "Starts at 08:00 PM"  );
    }
    else if( day == 'Thursday' ){
        sendDailyNotification("CodeStudio Contest" , "Starts at 8:00PM"  ) ;
    }
    fetchdata() ;
}

function scheduleDailyNotification() {
    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(5,36, 0, 0);  
    if (scheduledTime.getTime() < now.getTime()) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    console.log('Time until next notification:', timeUntilNotification);

    setTimeout(() => {
        if (navigator.onLine) {
            console.log('Online at scheduled time, sending notification.');
            contestNotifier();
        } else {
            console.log('Offline at scheduled time, waiting to come online.');
            self.addEventListener('online', handleOnlineStatus);
        }
        scheduleDailyNotification() ;
    }, timeUntilNotification);
}

function handleOnlineStatus() {
    console.log('Came online after scheduled time, sending notification.');
    sendDailyNotification();
}


function getWeekday(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

async function fetchdata(){
    const cfetch =await fetch("https://codeforces.com/api/contest.list") ;
    const cf =await cfetch.json();
    var map = new Map() ;
    for (let i = 0; i < cf.result.length; i++) {
        const element = cf.result[i];
        if (element.phase !== "BEFORE") {
            break;
        }
        map.set(element.name, -1 * element.relativeTimeSeconds);
        
    }
    console.log(map) ;
    map.set("DIV 2 " , 7260)
    for(const [key , value ] of map.entries() ){
       if( value < 86400 ){
        var hours = new Date().getHours() ;
        var nhours =Math.floor(value/(60*60) );
        var min = Math.floor((value % (60*60))/60) ;
        sendDailyNotification(key , `Starts at ${hours+nhours} : ${min}`) ;
       }
    }
}

function generateBiweeklySaturdays(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 14);
    }

    return dates;
}
function isDateInList(dateList, targetDate) {
    return dateList.some(date => {
        return date.toDateString() === targetDate.toDateString();
    });
}

let startDate = new Date('2024-05-25');
let endDate = new Date('2026-05-25');

let biweeklySaturdays = generateBiweeklySaturdays(startDate, endDate);


