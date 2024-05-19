window.addEventListener('load' , ()=>{
      if( Notification.permission == 'denied'){
        alert('Notification permission is denied. Click on \"i\" side to home symbol at top and reset permissions.');
      }
    if( Notification.permission == 'granted'){
        document.getElementById("notgranted").style.display = "none" ;
        document.getElementById("granted").style.display = "flex" ;
    }
    document.getElementById("notify").addEventListener("click" , function(){
        Notification.requestPermission().then(()=>{
      if( Notification.permission == 'granted'  ){
        document.getElementById("notgranted").style.display = "none" ;
        document.getElementById("granted").style.display = "flex" ;
      }
    });

    })
   
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').then(function(registration) {
          console.log('Service Worker registered with scope:', registration.scope);
      
          registration.active.postMessage('scheduleDailyNotification');
      }).catch(function(error) {
          console.error('Service Worker registration failed:', error);
      });
  }
  
  
});
  
