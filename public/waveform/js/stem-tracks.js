
var playlist = WaveformPlaylist.init({
  samplesPerPixel: 1000,
  waveHeight: 100,
  container: document.getElementById("playlist"),
  timescale: true,
  state: 'cursor',
  colors: {
    waveOutlineColor: '#E0EFF1'
  },
  controls: {
    show: true, //whether or not to include the track controls
    width: 200 //width of controls in pixels
  },
  zoomLevels: [500, 1000, 3000, 5000]
});

function getSongName(folderName){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "track", true);

  // Menu for song selection
  var s = $("<select id='songSelect'/>");
  s.appendTo("#songs");


  s.change(function (e) {
      var trackName = $(this).val();
      var trackList = [];
      console.log("You chose : " + trackName);

      document.getElementById("playlist").innerHTML = "";
      playlist = WaveformPlaylist.init({
        samplesPerPixel: 1000,
        waveHeight: 100,
        container: document.getElementById("playlist"),
        timescale: true,
        state: 'cursor',
        colors: {
          waveOutlineColor: '#E0EFF1'
        },
        controls: {
          show: true, //whether or not to include the track controls
          width: 200 //width of controls in pixels
        },
        zoomLevels: [500, 1000, 3000, 5000]
      });

      if (trackName !== "nochoice") {
          // We load if there is no current song or if the current song is
          // different than the one chosen
          var xhr1 = new XMLHttpRequest();
          xhr1.open('GET', "track/"+trackName, true);

          xhr1.onload = function (e) {
            var songTracks = JSON.parse(this.response);
            
            var tracks = songTracks.instruments;
            tracks.forEach(function (trackName) {
              trackList.push({
                "src": "multitrack/"+folderName+"/"+trackName.sound,
                "name": trackName.name
              })
            });

            playlist.load(trackList).then(function() {
              //can do stuff with the playlist.
              console.log("called..")
           });
          }

          xhr1.send();
      }
  });
  xhr.onload = function (e) {
    var songList = JSON.parse(this.response);

    if (songList[0]) {
        $("<option />", {
            value: "nochoice",
            text: "Choose a song..."
        }).appendTo(s);
    }

    songList.forEach(function (songName) {
        $("<option />", {
            value: songName,
            text: songName
        }).appendTo(s);
    });

    $('#songSelect').val( folderName ).change();

  };
  xhr.send();
}

/*
playlist.load([
  {
    "src": "waveform/media/audio/Vocals30.mp3",
    "name": "Vocals",
    "gain": 0.75,
    "muted": false,
    "soloed": false
  },
  {
    "src": "waveform/media/audio/Guitar30.mp3",
    "name": "Guitar"
  },
  {
    "src": "waveform/media/audio/PianoSynth30.mp3",
    "name": "Pianos & Synth",
    "gain": 1
  },
  {
    "src": "waveform/media/audio/BassDrums30.mp3",
    "name": "Drums"
  }
]).then(function() {
  //can do stuff with the playlist.
});
*/