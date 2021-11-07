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
  let userRef = rtdb.ref(db, "/users");
  

  let tempSongList = []; //songs before cover is added
  let songList = [];
  
  let song_map = new Object();
  
  let admin = false;
  
  let auth = fbauth.getAuth(app);
  
  let renderUser = function(userObj){
    $("#logout").show();
    //$("#logoutDiv").empty();
    //$("#logoutDiv").append(`<button type="button" id="logout">Logout</button>`);
    //console.log(userObj.uid);
    console.log(userObj.uid);
    let id = userObj.uid;
    let adminC = rtdb.ref(db, `/users/${id}/roles/admin`);
    rtdb.onValue(adminC, ss=>{
      console.log(ss.val());
      if (ss.val() == true){
        console.log("should be showing");
        $("#first").show();
      }
      //$("#first").hide();
    });
    /*, ss=>{
      console.log(ss);
      if (ss.val() == true){
        $("#first").show();
        console.log("should be shown");
      }else{
        $("#first").hide();
      }
      */
      //$("#first").hide();
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
          $("#logout").show();
          renderUser(user);
        } else {
          $("#logout").hide();
          $("#login").show();
          $('#showLogin').show();
          $("#first").hide();
          //console.log("put code here");
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
      let userRef = rtdb.ref(db, `/users/${uid}/username`);
      rtdb.set(userRef, email);
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
        let uid = somedata.user.uid;
        /*let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/admin`);
        if (userRoleRef == true){
          $('#first').show();
          console.log("should be show");
        }else{
          $("#first").hide();
        }*/
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
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
    
    //console.log(lis);
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
    $("#login").hide();//change these two late
    
    //alert(JSON.stringify(ss.val()));
    let keys = Object.keys(ss.val());
    $("#allSongs").html("");
    keys.map(test=>{
      let songTitle = ss.val()[test].title;
      let artist = ss.val()[test].artist;
      
      /*lastfm.track.getInfo({track: ss.val()[test].title, artist: ss.val()[test].artist}, {success: function(data){
        cover = data.track.album.image[2]["#text"];
        
        $("#allSongs").append(`<li id="song"><img src=${cover}>${ss.val()[test].title + " by " + ss.val()[test].artist}</a> </li>`);
      }, error: function(code, message){
        //console.log("test");
        cover = "https://www.fillmurray.com/200/300";
        
        $("#allSongs").append(`<li id="song"><img src=${cover}>${ss.val()[test].title + " by " + ss.val()[test].artist}</a> </li>`);
      }});*/   
      tempSongList.push({songTitle, artist});



    })
    //processSongs();
    addCovers();
    
  });
    
  function addCovers(){
    for(let i = 0; i< tempSongList.length; i++){
      //console.log(tempSongList[i].songTitle, tempSongList[i].artist);
      grabCover(i, tempSongList[i].songTitle, tempSongList[i].artist, makeSongList);
    }
  }


  function makeSongList(index, song_cover){
    //console.log("working?" + index + " " + song_cover);
    let songTitle = tempSongList[index].songTitle;
    let artist = tempSongList[index].artist;
    songList.push({songTitle, artist, song_cover});

    if(songList.length == tempSongList.length){
      processSongs();
    }

  }

  function processSongs(){    
    //number of songs per page
    /*console.log("FINAL TEST");
    console.log(songList.length);
    for(let i = 0; i< songList.length; i++){
      console.log(songList[i]);
      
    }*/

    let num_page = $("#songsPerPage").val();
    num_page = Math.min(num_page, songList.length);
    //console.log(num_page);
    //console.log($("#songsPerPage").val());
    //songlist length / num page
    let total_pages = Math.max(1, Math.ceil(songList.length / num_page));
    console.log(total_pages);
    let cover;
    let counter = 0;


    //$("#allSongs").append(`<nav id="songNav"`);
    $("#songNav").append(`<div id="songButtons"></div>`);

    for(let i = 1; i <= total_pages; i++){
      //turn this li into buttons... and edit cs so that they are all side by
      //$("#allSongs").append(`<li id=${i} class="tabs">Testing tab ${i}</li>`);
      $("#songButtons").append(`<button id=${i} class="tabs">${i}</button>`);

      let tempList = [];

      for(let j = counter; j < counter + num_page; j++){
        if(!(j >= songList.length)){

        let title = songList[j].songTitle;
        let artist = songList[j].artist;
        let cover = songList[j].song_cover;
        //let song_cover = grabCover(title, artist);

        tempList.push({title, artist, cover});
        }
      }
      counter = counter + num_page;
      song_map[i] = tempList;
      //console.log(song_map);
      //console.log(tempList);
    }
    $("#allSongs").empty();
    for(let i = 0; i < song_map[1].length; i++){
      //console.log(song_map[this.id][i]);
       //let cover = "https://www.fillmurray.com/200/300";
        $(`#allSongs`).append(`<li id="song"><img src=${song_map[1][i].cover}>${song_map[1][i].title + " by " + song_map[1][i].artist}</a> </li>`);
    }    
    $(".tabs").click(function() {
      $("#allSongs").empty();
      //console.log(this.id);
      //let cover = "https://www.fillmurray.com/200/300";
      for(let i = 0; i < song_map[this.id].length; i++){
        //console.log(song_map[this.id][i]);
          $(`#allSongs`).append(`<li id="song"><img src=${song_map[this.id][i].cover}>${song_map[this.id][i].title + " by " + song_map[this.id][i].artist}</a> </li>`);
      }
      //showByID(this.id);
    });
    /*
    console.log("test");
    console.log(songList)
    console.log(songList.length);
    */

  //alert(JSON.stringify(ss.val()));
  }

$(`#refresh`).on('click', function() {
  //$("#songNav").empty();
  $("#songButtons").empty();
  processSongs();
});

function grabCover(index, song, artist, callback){
  let song_cover;
  //let index = 1;
  lastfm.track.getInfo({track: song, artist: artist}, {success: function(data){

    song_cover = data.track.album.image[2]["#text"];
    //console.log(song_cover);
    return callback(index, song_cover);
    //$(`#${i}`).append(`<li id="song"><img src=${cover}>${songList[j].songTitle + " by " + songList[j].artist}</a> </li>`);//add tabulation here
    
  }, error: function(code, message){
    song_cover = "https://www.fillmurray.com/200/300";
    //console.log(song_cover);
    return callback(index, song_cover);
    //$(`#${i}`).append(`<li id="song"><img src=${cover}>${songList[j].songTitle + " by " + songList[j].artist}</a> </li>`);//add tabulation here
  }});
}

function returnCover(song_cover){
  return song_cover;
}
  
//rtdb.update(titleRef, newObj);
//rtdb.push(peopleRef, newObj);