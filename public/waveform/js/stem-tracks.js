
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
  xhr.open('GET', "track/"+folderName, true);

  xhr.onload = function (e) {
      var songTracks = JSON.parse(this.response);

      var trackList = [];
      songTracks.instruments.forEach(element => {
        if(element.name == "vocals"){
          trackList.push({
            "src": "multitrack/"+folderName+"/"+element.sound,
            "name": element.name,
            "gain": 0.75,
            "muted": false,
            "soloed": false
          })
        }else if(element.name == "piano"){
          trackList.push({
            "src": "multitrack/"+folderName+"/"+element.sound,
            "name": element.name,
            "gain": 1
          })
        }else{
          trackList.push({
            "src": "multitrack/"+folderName+"/"+element.sound,
            "name": element.name
          })
        }
        console.log(element.name);
        console.log(element.sound);
      });

      console.log(trackList);

      playlist.load(trackList).then(function() {
        //can do stuff with the playlist.
      });

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