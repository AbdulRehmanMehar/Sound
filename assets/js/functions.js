$(document).ready(() => {
  const fs = require('fs');
  const path = require('path');
  const jsmediatags = require("jsmediatags");

  //Adding the audio.playing... picture
  let themetadata = (file) => {
    let title,artist,image;
    jsmediatags.read(file, {
      onSuccess: function(tag) {
        tags = tag.tags;
        title = tags.title;
        artist = tags.artist;
        image = tags.picture;        

        document.getElementById("thetitle").innerHTML = title;
        document.getElementById("theartist").innerHTML = artist;

        if (image) {
          var base64String = "";
          for (var i = 0; i < image.data.length; i++) {
              base64String += String.fromCharCode(image.data[i]);
          }
          var base64 = "data:" + image.format + ";base64," +
                  window.btoa(base64String);
          document.getElementById('thepic').setAttribute('src',base64);
          // document.getElementById('thepic').style.backgroundImage = base64;

        } else {
          document.getElementById('thepic').setAttribute('src',"assets/img/sound-logo.png");
        }
      },
      onError: function(){
        let getThatExt = file.split('.').pop();
        if(getThatExt != ""){
          document.getElementById("thetitle").innerHTML = file;
          document.getElementById("theartist").innerHTML = "unknown";
          document.getElementById('thepic').setAttribute('src',"assets/img/sound-logo.png");
        }
      }
    });
  }

  $("#createPlayList").change(() => {
    let audioFiles = document.getElementById("createPlayList"),
    filesLength = audioFiles.files.length;
    for (i = 0; i < filesLength; i++) {
      fs.appendFile('file.txt', audioFiles.files[i].path + "\n");
    }   
    document.location.reload(true);
  });
  $("#OpenDirectory").change(() => {
    if(playList.length !== 0){
      playList = [];
      fs.writeFile('file.txt', '');
      document.location.reload(true);
    }
    let openedDir = document.getElementById("OpenDirectory");
    DirLength = openedDir.files.length;
    for(i = 0; i < DirLength; i++){
      let theURL = openedDir.files[i].path;
      let theFiles = fs.readdirSync(theURL);
      for(var i in theFiles) {
        if( (path.extname(theFiles[i]) === ".mp3")  || (path.extname(theFiles[i]) === ".ogg") || path.extname(theFiles[i]) === ".wav") {
          // fs.appendFile('file.txt', theFiles[i] + "\n");
          let theFileURL = theURL+ "/" +theFiles[i];
          fs.appendFile('file.txt', theFileURL + "\n");          
        }
     }
     document.location.reload(true);
    }
  });


  //Audio File
  let audio = new Audio();  
  // let playList =  ["Dil-Diyan-Galla.mp3","hawaien.mp3","radha.mp3","Tu-ban-ja-gali.mp3"];
  // let filetoload = load("file.txt");

  let playList = fs.readFileSync('file.txt').toString().split("\n");
  let playList_index = 0;
  audio.src = playList[0];
  audio.pause();
  themetadata(playList[playList_index]);

  //MainSlider Dynamically
  let seekto, seeking;
  let mainslide = $("#mainslide");

  $(audio).bind("timeupdate", (e) => {
    e.preventDefault();
    let newTime = audio.currentTime * ( 100 / audio.duration );
    let currentMins = Math.floor(audio.currentTime / 60);
    let currentSecs = Math.floor(audio.currentTime - currentMins / 60);
    let durationMins = Math.floor(audio.duration / 60);
    let durationSecs = Math.floor(audio.duration - durationMins / 60);
    currentMins < 10 ? currentMins = "0" + currentMins : "" ;
    currentSecs < 10 ? currentSecs = "0" + currentSecs : "" ;
    durationMins < 10 ? durationMins = "0" + durationMins : "" ;
    durationSecs < 10 ? durationSecs = "0" + durationSecs : "" ;
    $("#curTime").html(currentMins + ":" + currentSecs);
    $("#durTime").html(durationMins + ":" + durationSecs);
    mainslide.val(newTime);
  });

  mainslide.click((e) => {
    e.preventDefault();
    seekto = audio.duration * ( mainslide.val() / 100);
    audio.currentTime = seekto;
    // mainslide.val(seekto);
  });
 

  //Pause & Play Dynamically
  $("#play").click(() => { playnpause (); });
  let playnpause = () => {
    if(audio.paused){
      audio.play();
      $("#play i").removeClass("fa-play");
      $("#play i").addClass("fa-pause");
    }else{
      audio.pause();
      $("#play i").removeClass("fa-pause");
      $("#play i").addClass("fa-play");
    }
  }
  //Stop Functionality
  $("#stop").click(() => {
    audio.pause();
    audio.currentTime = 0;
    $("#play i").removeClass("fa-pause");
    $("#play i").addClass("fa-play");
  });

  //Dynamic Volume Slider
  $("#volslider").on("mousemove keydown keyup keypress",() => {
    let volslider = $("#volslider").val() / 100;
    if(volslider > .5){
      $(".volico").removeClass("fa-volume-off");
      $(".volico").removeClass("fa-volume-down");
      $(".volico").addClass("fa-volume-up");
    }else if(volslider === 0){
      $(".volico").removeClass("fa-volume-up");
      $(".volico").removeClass("fa-volume-down");
      $(".volico").addClass("fa-volume-off");
    }else{
      $(".volico").removeClass("fa-volume-off");
      $(".volico").removeClass("fa-volume-up");
      $(".volico").addClass("fa-volume-down");
    }
    audio.volume = volslider;          
  });

  //Dynamically Loop
  $("#loop").click(() => {
    if( $("#loop").is(".not-clicked") ){
      $("#loop").removeClass("not-clicked");
      $("#loop").addClass("active");
      audio.loop = true;
    }else{
      $("#loop").addClass("not-clicked");
      $("#loop").removeClass("active");
      audio.loop = false;
    }
  });

  
  //Shuffle The Audio
  let res;
  Array.prototype.shuffle = function(){
    var currentIndex = this.length, temporaryValue, randomIndex ;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = this[currentIndex];
      this[currentIndex] = this[randomIndex];
      this[randomIndex] = temporaryValue;
    }
    return this;
  }
  $("#shuffle").click(() => {
    if( $("#shuffle").is(".not-clicked") ){
      $("#shuffle").removeClass("not-clicked");
      $("#shuffle").addClass("active");
      res = playList.shuffle();
    }else{
      $("#shuffle").removeClass("active");
      $("#shuffle").addClass("not-clicked");
      res = playList;
    }
    !audio.paused ? audio.play() : audio.pause();
  });

  //Next Btn
  $("#next").click(() => {
    if(playList.length > playList_index + 2 ){
      playList_index++;
      audio.src = playList[playList_index];
      playnpause();
      themetadata(playList[playList_index]);
    }
  }); 
  //previous btn
  $("#prev").click(() => {
    if(playList_index != 0){
      playList_index--;
      audio.src = playList[playList_index];
      playnpause();
      themetadata(playList[playList_index]);
    }
  });


  //Listen to end the track
  audio.addEventListener("ended",() => {
   
    if(playList.length === 1){
      $(".playico").removeClass("fa-pause");
      $(".playico").addClass("fa-play");
      audio.pause();
      audio.currentTime = 0;
      return;
    }if(playList_index == (playList.length - 2)){
      playList_index = 0;
    }else{
      playList_index++;
    }
    audio.src = playList[playList_index];
    audio.play();
    themetadata(playList[playList_index]);
  });
  

  try{
    let holder_element,holder_single , theanchorlink;  
    playList.forEach((v,e) => {
      // let getThatExt = playList[e].split('.').pop();
      // if( (getThatExt != "mp3") && (getThatExt != "") ){
      //   theanchorlink = ('<a class="nav-link" href="'+v+'" id="'+e+'">');
      //   $(document).on('click','.nav-link',function(e){
      //     e.preventDefault();
      //     let href = $(this).attr('href');
      //     playList_index = $(this).attr('id');
      //     audio.src = playList[playList_index];
      //     playnpause();
      //     themetadata(playList[playList_index]);
      //   });
      //   holder_element = (
      //     '<li class="nav-item">'+
      //       theanchorlink + 
      //         '<div class="container">' +
      //           '<div class="row">' + 
      //             '<div class="col-xs-2">' + 
      //               '<img src="assets/img/sound-logo.png" height="80" width="80" class="theplaylistpicture">' + 
      //             '</div>' +
      //             '<div class="col-xs-10 theplaylisttitle">'+ playList[e] +'</div>' +
      //           '</div>'+
      //         '</div>'+
      //       '</a>'+
      //     '</li>'
      //   );         
      //   $("#holder").append(holder_element); 
      //   return;
      // }
      jsmediatags.read(playList[e], {
        onSuccess: function(thetag) {
          let thetags = thetag.tags;
          let thetitle = thetags.title;
          let theimage = thetags.picture;
          theanchorlink = ('<a class="nav-link" href="'+v+'" id="'+e+'">');
          $(document).on('click','.nav-link',function(e){
            e.preventDefault();
            let href = $(this).attr('href');
            playList_index = $(this).attr('id');
            audio.src = playList[playList_index];
            playnpause();
            themetadata(playList[playList_index]);
          });
  
          if (theimage) {
            let base64String = "";
            for (let i = 0; i < theimage.data.length; i++) {
                base64String += String.fromCharCode(theimage.data[i]);
            }
            let base64 = "data:" + theimage.format + ";base64," +
                    window.btoa(base64String);
            holder_element = (
              '<li class="nav-item">'+
                theanchorlink + 
                  '<div class="container">' +
                    '<div class="row">' + 
                      '<div class="col-xs-2">' + 
                        '<img src="'+ base64 +'" height="80" width="80" class="theplaylistpicture">' + 
                      '</div>' +
                      '<div class="col-xs-10 theplaylisttitle">'+ thetitle +'</div>' +
                    '</div>'+
                  '</div>'+
                '</a>'+
              '</li>'
            );         
            $("#holder").append(holder_element); 
          } else {
            holder_element = (
              '<li class="nav-item">'+
                theanchorlink + 
                  '<div class="container">' +
                    '<div class="row">' + 
                      '<div class="col-xs-2">' + 
                        '<img src="assets/img/sound-logo-white.png" height="80" class="theplaylistpicture">' + 
                      '</div>' +
                      '<div class="col-xs-10 theplaylisttitle">'+ thetitle +'</div>' +
                    '</div>'+
                  '</div>'+
                '</a>'+
              '</li>'
            );        
            $("#holder").append(holder_element);     
          }
          
        },
        onError: function(){
          let getThatExt = playList[e].split('.').pop();
          if(getThatExt != ""){
            theanchorlink = ('<a class="nav-link" href="'+v+'" id="'+e+'">');
              $(document).on('click','.nav-link',function(e){
                e.preventDefault();
                let href = $(this).attr('href');
                playList_index = $(this).attr('id');
                audio.src = playList[playList_index];
                playnpause();
                themetadata(playList[playList_index]);
              });
              holder_element = (
                '<li class="nav-item">'+
                  theanchorlink + 
                    '<div class="container">' +
                      '<div class="row">' + 
                        '<div class="col-xs-2">' + 
                          '<img src="assets/img/sound-logo.png" height="80" width="80" class="theplaylistpicture">' + 
                        '</div>' +
                        '<div class="col-xs-10 theplaylisttitle">'+ playList[e] +'</div>' +
                      '</div>'+
                    '</div>'+
                  '</a>'+
                '</li>'
              );         
              $("#holder").append(holder_element); 
          }
        }
      });
    });
  }catch(e){
    console.log(e);
  }
  


});
 