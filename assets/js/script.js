import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import $ from "https://cdn.skypack.dev/jquery@3.6.0";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
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
  let songRef = rtdb.ref(db, "/testing");
  let queueRef = rtdb.ref(db, "/Queue");
  let userRef = rtdb.ref(db, "/users");
  let missedRef = rtdb.ref(db, "/Missed");
  let editRef;

  let tempSongList = []; //songs before cover is added
  let songList = [];
  let songListCopy = [];

  let songNames = [];

  let queueList = [];
  
  let song_map = new Object();
  let cover_map = new Object();
  let queueOrder_map = new Object();

  let test_map = new Object();

  let currLine = 1;


  let songInfo_Name = new Object();

  let chunkCompleted;

  let lastFiltered ='';

  let admin = false;
  
  let auth = fbauth.getAuth(app);

  let songCount;
  
  let activeTab = 1;

  let currLoop;
  let processed = false;

  let renderUser = function(userObj){
    $("#logout").show();
    //$("#logoutDiv").empty();
    //$("#logoutDiv").append(`<button type="button" id="logout">Logout</button>`);
    //console.log(userObj.uid);
    
    let id = userObj.uid;
    let adminC = rtdb.ref(db, `/users/${id}/roles/admin`);
    rtdb.onValue(adminC, ss=>{
      //console.log(ss.val());
      if (ss.val() == true){
        //console.log("should be showing");
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

  /*$('#openPopup').on("click", ()=>{
    console.log("should work");
    document.getElementById('ready').style.display = 'block';
  });*/


  $('#seeSongs').on("click", ()=>{
    let u_id;
        if(auth.currentUser != null){
          let user = auth.currentUser;
          u_id = user.uid;
        }else{
          signInAnonymously(auth)
          .then(() => {
          console.log("works");
          let user = auth.currentUser;
          u_id = user.uid;
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
          });
          
        }
    rtdb.onValue(queueRef, ss=>{
      $('#mySongList').empty();
      //alert(JSON.stringify(ss.val()));
      let keys = Object.keys(ss.val());
      let counter = 0;
      keys.map(test=>{
        let firebase_id = keys[counter];
        counter++;
        if(ss.val()[test].user_id == u_id){
          //console.log(ss.val()[test]);
          
          $('#mySongList').append(`<li> ${ss.val()[test].song} </li>
          <button id=${firebase_id} class="editEntry">EDIT</button>
          <div class="editBox" hidden=true>
          <form id="submitSongChange">
          Change Singer  
          
          <input id="singerChange" value= ${ss.val()[test].singer} ></input>
          
          Change Song
          
          <input list="songChanges" name="songChange" id="songChange">
          <datalist id="songChanges">
          </datalist>
          <button i>Submit</button>
          </form>
          </div>
          `)
        }
      })
      $(document).on('submit', '#submitSongChange', function() {
        let newSong = songChange.value;
        let newSinger = singerChange.value;
        //console.log(newSinger);
        //console.log(test);
        //rtdb.update(editRef, {test: "working"});
        //console.log(songInfo_Name[newSong]);
        rtdb.update(editRef, {singer: newSinger, song: newSong, artist: songInfo_Name[newSong].artist, duration: songInfo_Name[newSong].length});
        return false;
       });

      $('.editEntry').on('click', function(){
        $('.editBox').show();
        var list = document.getElementById('songChanges');

        songNames.forEach(function(item){
        var option = document.createElement('option');
        option.value = item;
        list.appendChild(option);
        });
        console.log(this.id)
        //this.id to track
        //make input boxes show where you can change things
        //make confirm and cancel button
        editRef = rtdb.ref(db, `/Queue/${this.id}`);
        //rtdb.udate(editRef, {singer: changedSinger, song: changedSong});
        
      });
    //alert(JSON.stringify(ss.val()));
    });
});

  $('#closePopup').on("click", ()=>{
    document.getElementById('test').style.display = 'none';
    document.getElementById('ready').style.display = 'none';
    document.getElementById('confirm').style.display = 'none';
  });


  $('#showLogin').on("click", ()=>{
    $("#login").show();

  });
  
  fbauth.onAuthStateChanged(auth, user => {
        
        if (!!user){
          //console.log(user.uid);
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


  $('#queueSongs').on("click",'li', function() {
    let test = this.id;
    //console.log(test);
    let removeRef = rtdb.ref(db, `/Queue/${test}`);
    rtdb.set(removeRef, null);
  });



  rtdb.onValue(missedRef, ss=>{
    //alert(JSON.stringify(ss.val()));
    let user = auth.currentUser;
    let u_id = user.uid;
    let keys = Object.keys(ss.val()); 
    keys.map(test=>{
      if(ss.val()[test].user_id == u_id){
        alert("you missed your song");
      }
    });
  });

  rtdb.onValue(queueRef, ss=>{
    //alert(JSON.stringify(ss.val()));
    let keys = Object.keys(ss.val());
    $("#queueSongs").html("");
    let counter = 0;
    
    keys.map(test=>{
      currLine++;
      let firebase_id = keys[counter];
      queueOrder_map[firebase_id] = keys[counter];
      //console.log(firebase_id);
      counter++;
      let user = auth.currentUser;
      let u_id = user.uid;
      
      if(ss.val()[test].user_id == u_id){
        if(ss.val()[test].linePlace == 1){
          document.getElementById('ready').style.display = 'block';
        }
      }
      let button_id = firebase_id;
      $("#queueSongs").append(`<li id=${firebase_id}>${ss.val()[test].singer} singing ${ss.val()[test].song} by ${ss.val()[test].artist}</li><button class="missedSong" id=${button_id}>NO SHOW</button>`);
      $('.missedSong').on("click", function() {
        let test = this.id;
        //console.log(test);
        let obj;
        let removeRef = rtdb.ref(db, `/Queue/${test}`);
        rtdb.onValue(removeRef, ss=>{
          obj = ss.val();
          rtdb.push(missedRef, obj);
        //alert(JSON.stringify(ss.val()));
        });
        rtdb.set(removeRef, null);
      });
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
input.onkeyup = function (e) {
  if(e.keyCode == 8){
    input.value = '';
    songList.length = [];
    for(let i = 0; i < songListCopy.length; i++){
      songList.push(songListCopy[i]);
    }
  }
    /*songList=[];
    for(let i = 0; i < songListCopy.length; i++){
      songList.push(songListCopy[i]);
    }*/
    //console.log(songList);
    var filter = input.value;
    
    //const ul = document.getElementById('allSongs');
    //const lis= ul.getElementsByTagName('li');
    
    //console.log(lis);
    for (var i = 0; i < songList.length; i++) {
        
        var name = songList[i].songTitle;
        if (!(name.toLowerCase().includes(filter.toLowerCase()))) 
        {
          //songList[i].style.display = 'list-item';
          songList.splice(i, 1);
        }
        /*else{
          //lis[i].style.display = 'none';
          
        }*/
            
    }
    processSongs();

    
}


$('#allSongs').on('click','li', function() {
  
    //after confirmation add below line to confirm function
    //rtdb.push(queueRef, $(this).text());
    let currWaitTime = checkWaitTime();
    $("#waitTime").html(currWaitTime);
    //need to be able to eventually get just the song name not the artist as well
    let testCover = cover_map[$(this).text()];
    //console.log(testCover);
    $("#songName").html($(this).text());
    document.getElementById('test').style.display = 'block';
    let songName = $(this).text();
    //console.log(songInfo_Name[songName]);
    $("#submitAddSong").on('click', ()=>
    {
      if($("#inputSinger").val() == ""){
        alert("You must enter a name before submitting");
      }else{
        let singer = $("#inputSinger").val();
        document.getElementById('test').style.display = 'none';
        let theSong = $(this).text();
        let user_id;
        if(auth.currentUser != null){
          let user = auth.currentUser;
          user_id = user.uid;
          rtdb.push(queueRef, {linePlace: currLine,user_id: user_id, singer: singer, song: theSong, artist: songInfo_Name[theSong].artist, duration: songInfo_Name[theSong].length});
          //document.getElementById('confirm').style.display = 'block';
          $("#inputSinger").empty();
        }else{
          signInAnonymously(auth)
          .then(() => {
          console.log("works");
          let user = auth.currentUser;
          user_id = user.uid;
          rtdb.push(queueRef, {linePlace: currLine,user_id: user_id, singer: singer, song: theSong, artist: songInfo_Name[theSong].artist, duration: songInfo_Name[theSong].length});
          //document.getElementById('confirm').style.display = 'block';
          $("#inputSinger").empty();
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
          });
          
        }
        //console.log(user_id);
        
      }
      
    });
    
  });

  function checkWaitTime(){

    //have to change to queueList instead of songList

    let totalTime = 0;

    /*for(let i = 0; i < songList.length; i++){
      if(songList[i].song_length != 0){
        totalTime = totalTime + (songList[i].song_length / 1000);
      }
    }*/

    rtdb.onValue(queueRef, ss=>{
      //alert(JSON.stringify(ss.val()));
      let keys = Object.keys(ss.val());
      keys.map(test=>{
        let currTime = ss.val()[test].duration;
        if(currTime != 0){
          totalTime = totalTime + (currTime / 1000);
        }
      })
      
    //alert(JSON.stringify(ss.val()));
    });
    totalTime = millisToMinutesAndSeconds(totalTime * 1000);

    return totalTime;
  }

  //let testObj = "Test457";
  //rtdb.push(titleRef, testObj);
  rtdb.onValue(songRef, ss=>{
    $("#login").hide();//change these two late
    $("#allSongs").html("");
    /*
    this function is purely to add covers
    to every song in the db. 

    THIS CODE ONLY NEEDS TO BE RAN ONCE EVERYTIME
    THE SONGBOOK IS UPDATED


    THE FOLLOWING CODES ALSO NEED TO BE 
    UNCOMMENTED FOR THIS TO WORK:

    PROCESSEDFUNCTION()
    COVERINDEX()
    COVERTODB90
    */
   /* uncomment when needing to process stuff to db
    if(!processed){
      processedFunction(ss);
      processed = true;
    }
    */

    //normal loading function
    processSongs(ss);
    
    //addCovers();
    
  });


  // FUNCTION 2-4 OF ADDING COVERS TO SONGS IN THE DB
  /*
  function processedFunction(ss){
    let keys = Object.keys(ss.val());

        console.log(ss.val());
        //found better performance when seperating for loop into chunks of 2000
        for(let test = 12000; test < keys.length; test++){
          /* testing trimming strings
          let t = "     dsa      fda   asdfa  "
          console.log(t);
          let ts = t.replace(/\s+/g, ' ').trim();
          console.log(ts);
          
          let songTitleBefore = ss.val()[test].title;
          let artistBefore = ss.val()[test].artist;

          let songTitle = songTitleBefore.replace(/\s+/g, ' ').trim();
          let artist = artistBefore.replace(/\s+/g, ' ').trim();
          if(ss.val()[test].length != null){
            console.log("didnt need one")
            //grabCover(keys[test], songTitle, artist, coverToDB);
          }else{
            //console.log("grabbing cover");
            grabCover(keys[test], songTitle, artist, coverToDB);
          }
          
        }
  }

  //function is outdated keeping in case I change my mind
  function coverIndex(index, songTitle, artist, callback){
    return callback(index, songTitle, artist, coverToDB);
  }
    
  function coverToDB(index, song_cover, song_length){
    
    console.log(index);
    //console.log(song_length)
    let coverRef = rtdb.ref(db, `/testing/${index}`);
    rtdb.update(coverRef, {cover: song_cover, length: song_length});
    chunkCompleted = index;
  }

  */

  //Function is outdated keeping in case I change my mind
  function addCovers(){
    for(let i = 0; i< tempSongList.length; i++){
      //console.log(tempSongList[i].songTitle, tempSongList[i].artist);
      grabCover(i, tempSongList[i].songTitle, tempSongList[i].artist, makeSongList);
    }
  }


  //outdated function
  function makeSongList(index, song_cover, song_length){
    //console.log("working?" + index + " " + song_cover);
    let songTitle = tempSongList[index].songTitle;
    let artist = tempSongList[index].artist;
    songList.push({songTitle, artist, song_cover, song_length});
    songListCopy.push({songTitle, artist, song_cover, song_length});
    if(songList.length == tempSongList.length){
      processSongs();
    }

  }

  function processSongs(ss){ 
    let keys = Object.keys(ss.val());
    songCount = keys.length;
    if(songCount != 0){   
    //number of songs per page
    /*console.log("FINAL TEST");
    console.log(songList.length);
    for(let i = 0; i< songList.length; i++){
      console.log(songList[i]);
      
    }*/

    let num_page = $("#songsPerPage").val();
    num_page = Math.min(num_page, songCount);
    //console.log(num_page);
    //console.log($("#songsPerPage").val());
    //songlist length / num page
    let total_pages = Math.max(1, Math.ceil(songCount / num_page));
    //console.log(total_pages);
    let cover;
    let counter = 0;


    //$("#allSongs").append(`<nav id="songNav"`);
    //$("#songNav").append(`<div id="songButtons"></div>`);
    $("#songButtons").empty();
    for(let i = 1; i <= total_pages; i++){
      //turn this li into buttons... and edit cs so that they are all side by
      //$("#allSongs").append(`<li id=${i} class="tabs">Testing tab ${i}</li>`);
      $("#songButtons").append(`<button id=${i} class="tabs">${i}</button>`);
      $(`#${i}`).hide();
      /*let tempList = [];

      for(let j = counter; j < counter + num_page; j++){
        if(!(j >= songList.length)){

        let title = songList[j].songTitle;
        let artist = songList[j].artist;
        let cover = songList[j].song_cover;
        let length = songList[j].song_length;

        songInfo_Name[title] = {artist, cover, length};
        //let song_cover = grabCover(title, artist);
        cover_map[title] = cover;
        tempList.push({title, artist, cover, length});
        }
      }

      counter = counter + num_page;
      song_map[i] = tempList;
      */
      //console.log(song_map);
      //console.log(tempList);
    }
  
    $("#allSongs").empty();
    for(let i = 1; i < 6; i++){
      $(`#${i}`).show();
    }
    for(let i = 0; i < num_page; i++){
      //console.log(song_map[this.id][i]);
       //let cover = "https://www.fillmurray.com/200/300";
        $(`#allSongs`).append(`<li id="song"><img src=${ss.val()[i].cover}>${ss.val()[i].title}</li>`);
    }    
    $(".tabs").click(function() {
      $(`.tabs`).hide();
      //console.log(parseInt(this.id) + 2);
      let buffStart;
      if((parseInt(this.id) - 2) > 0){
        buffStart = parseInt(this.id) - 2;
      }else if((parseInt(this.id) - 2) > 1) {
        buffStart = parseInt(this.id) -1;
      }
      for(let i = buffStart; i <= (parseInt(this.id) + 2); i++){
        $(`#${i}`).show();
      }
      $("#allSongs").empty();
      //console.log(this.id);
      //let cover = "https://www.fillmurray.com/200/300";
      let start = ((this.id - 1) * num_page);
      for(let i = start; i < (start + num_page); i++){
        
        //console.log(song_map[this.id][i]);
          $(`#allSongs`).append(`<li id="song"><img src=${ss.val()[i].cover}>${ss.val()[i].title}</li>`);
      }
      //showByID(this.id);
    });

  }else{
    $('#allSongs').empty();
    $(`#allSongs`).append(`<li id="song">NO SONGS THAT MATCH THE SEARCH</li>`);
  }
    /*
    console.log("test");
    console.log(songList)
    console.log(songList.length);
    */

  //alert(JSON.stringify(ss.val()));
  }

$(`#refresh`).on('click', function() {
  $("#songButtons").empty();
  processSongs();
});

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function grabCover(index, song, artist, callback){
  let song_cover;
  
  lastfm.track.getInfo({track: song, artist: artist}, {success: function(data){
    let songTime = data.track.duration;
    
    if(data.track.album != null){
      song_cover = data.track.album.image[2]["#text"];
    }else{
      song_cover = "https://www.fillmurray.com/200/300";
    }
    
    
    return callback(index, song_cover, songTime);
  }, error: function(code, message){
    
    song_cover = "https://www.fillmurray.com/200/300";
    return callback(index, song_cover, "200000");
  }});
  
}

function returnCover(song_cover){
  return song_cover;
}
  
//rtdb.update(titleRef, newObj);
//rtdb.push(peopleRef, newObj);