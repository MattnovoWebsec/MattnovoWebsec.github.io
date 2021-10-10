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


  $("ul").click(function() {
    //let mesg = $("#song").val();
    //alert($(this).text());
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
      $("#allSongs").append(`<li id="song">${ss.val()[test].title} </li>`);
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