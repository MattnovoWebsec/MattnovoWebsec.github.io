import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import $ from "https://cdn.skypack.dev/jquery@3.6.0";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
  apiKey: "AIzaSyAV1K2lxxVogfgOgfsjVjyUQhB3e6rEO_Y",
  authDomain: "websec-b9dad.firebaseapp.com",
  databaseURL: "https://websec-b9dad-default-rtdb.firebaseio.com",
  projectId: "websec-b9dad",
  storageBucket: "websec-b9dad.appspot.com",
  messagingSenderId: "797101736257",
  appId: "1:797101736257:web:e1f8cd800b4f906f24a1c0",
  measurementId: "G-J9RLL10P3N"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  let db = rtdb.getDatabase(app);
  let songRef = rtdb.ref(db, "/Songs");
  let queueRef = rtdb.ref(db, "/Queue");
  let songList = [];
  /*const searchWrapper = document.querySelector(".search-input");
  const inputBox = searchWrapper.querySelector("input");

inputBox.onkeyup = (e)=>{
  if (e.keyCode == 8){
    songList.clear();
    $("#suggestions").empty();
  }
  let typed = e.target.value;
  const songSearch = songList.map(song => {
    if (song.includes(typed)){
      $("#suggestions").append(`<li id="song">${song} </li>`);
    }
  });
}*/

/* Create a LastFM object */
var lastfm = new LastFM({
  apiKey    : '3887358727ab4d72a6a41c294e6f21fa',
  apiSecret : 'bdf46ad054d971ee492a224e89c08e19',
  cache     : undefined
});

/*lastfm.track.getInfo({track: 'Grace', artist: 'Lewis Capaldi'}, {success: function(data){
  console.log(data.track.album.image[0]["#text"]);
}, error: function(code, message){
  
}});*/

var input = document.getElementById('search');
input.onkeyup = function () {
    var filter = input.value.toUpperCase();

    const ul = document.getElementById('allSongs');
    const lis= ul.getElementsByTagName('li');
    
    console.log(lis);
    for (var i = 0; i < lis.length; i++) {
        
        var name = lis[i].innerHTML;
        console.log("name");
        console.log(name);
        console.log("filter");
        console.log(filter);
        if (name.toUpperCase().indexOf(filter) == 0) 
            lis[i].style.display = 'list-item';
        else
            lis[i].style.display = 'none';
    }
}


$('#allSongs').on('click','li', function() {
    //let mesg = $("#song").text();
    //alert($(this).text());
    //alert(mesg);
    rtdb.push(queueRef, $(this).text());
  });

  //let testObj = "Test457";
  //rtdb.push(titleRef, testObj);
  rtdb.onValue(songRef, ss=>{
    //alert(JSON.stringify(ss.val()));
    let keys = Object.keys(ss.val());
    $("#allSongs").html("");
    keys.map(test=>{
      songList.push(ss.val()[test].title); 
      let cover;
      lastfm.track.getInfo({track: ss.val()[test].title, artist: ss.val()[test].artist}, {success: function(data){
        cover = data.track.album.image[2]["#text"];
        console.log(data.track.album.image[0]["#text"]);
        console.log(cover);
        $("#allSongs").append(`<li id="song"><img src=${cover}>${ss.val()[test].title + " by " + ss.val()[test].artist}</a> </li>`);
      }, error: function(code, message){
        //console.log("test");
        cover = "https://www.fillmurray.com/200/300";
        console.log("test");
        $("#allSongs").append(`<li id="song"><img src=${cover}>${ss.val()[test].title + " by " + ss.val()[test].artist}</a> </li>`);
      }});   
      
       
      
    })
    
  //alert(JSON.stringify(ss.val()));
  });

rtdb.onValue(queueRef, ss=>{
    //alert(JSON.stringify(ss.val()));
    let keys = Object.keys(ss.val());
    $("#queueSongs").html("");
    keys.map(test=>{
  
      $("#queueSongs").append(`<li id="song">${ss.val()[test]} </li>`);
    })
    
  //alert(JSON.stringify(ss.val()));
  });

  
//rtdb.update(titleRef, newObj);
//rtdb.push(peopleRef, newObj);