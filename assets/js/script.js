import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import $ from "https://cdn.skypack.dev/jquery@3.6.0";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
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
  
  
  let auth = fbauth.getAuth(app);
  
  let renderUser = function(userObj){
    $("#logoutDiv").append(`<button type="button" id="logout">Logout</button>`);
    $("#logout").on("click", ()=>{
      fbauth.signOut(auth);
    })
  }

  $('#showLogin').on("click", ()=>{
    $("#login").show();

  });
  
  fbauth.onAuthStateChanged(auth, user => {
        
        if (!!user){
          $('#showLogin').hide();
          $("#login").hide();
          $("#logoutDiv").show();
          renderUser(user);
        } else {
          $("#login").show();
          $('#showLogin').show();
          //$("#app").html("");
        }
  });  
  
  $("#register").on("click", ()=>{
    let email = $("#regemail").val();
    let p1 = $("#regpass1").val();
    let p2 = $("#regpass2").val();
    if (p1 != p2){
      alert("Passwords don't match");
      return;
    }
    fbauth.createUserWithEmailAndPassword(auth, email, p1).then(somedata=>{
      let uid = somedata.user.uid;
      let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/admin`);
      rtdb.set(userRoleRef, false);
      console.log("Register success")
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  });
  
  
  $("#loginButton").on("click", ()=>{
    let email = $("#logemail").val();
    let pwd = $("#logpass").val();
    fbauth.signInWithEmailAndPassword(auth, email, pwd).then(
      somedata=>{
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  });



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
    var filter = input.value;

    const ul = document.getElementById('allSongs');
    const lis= ul.getElementsByTagName('li');
    
    console.log(lis);
    for (var i = 0; i < lis.length; i++) {
        
        var name = lis[i].innerHTML;
        if (name.toLowerCase().includes(filter.toLowerCase())) 
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
    $("#login").hide();
    //alert(JSON.stringify(ss.val()));
    let keys = Object.keys(ss.val());
    $("#allSongs").html("");
    keys.map(test=>{
      songList.push(ss.val()[test].title); 
      let cover;
      lastfm.track.getInfo({track: ss.val()[test].title, artist: ss.val()[test].artist}, {success: function(data){
        cover = data.track.album.image[2]["#text"];
        
        $("#allSongs").append(`<li id="song"><img src=${cover}>${ss.val()[test].title + " by " + ss.val()[test].artist}</a> </li>`);
      }, error: function(code, message){
        //console.log("test");
        cover = "https://www.fillmurray.com/200/300";
        
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