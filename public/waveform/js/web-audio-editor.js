var playlist = WaveformPlaylist.init({
  samplesPerPixel: 3000,
  waveHeight: 100,
  container: document.getElementById("playlist"),
  state: 'cursor',
  colors: {
    waveOutlineColor: '#E0EFF1',
    timeColor: 'grey',
    fadeColor: 'black'
  },
  timescale: true,
  controls: {
    show: true, //whether or not to include the track controls
    width: 200 //width of controls in pixels
  },
  seekStyle : 'line',
  zoomLevels: [500, 1000, 3000, 5000]
});



function WebAudioSongName(folderName){
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
            "fadeIn": {
              "duration": 0.5
            },
            "fadeOut": {
              "duration": 0.5
            },
            "cuein": 5.918,
            "cueout": 14.5,
            "customClass": "vocals",
            "waveOutlineColor": '#c0dce0'
          })
        }else if(element.name == "drums"){
          trackList.push({
            "src": "multitrack/"+folderName+"/"+element.sound,
            "name": element.name,
            "start": 8.5,
            "fadeIn": {
              "shape": "logarithmic",
              "duration": 0.5
            },
            "fadeOut": {
              "shape": "logarithmic",
              "duration": 0.5
            }
          })
        }else if(element.name == "piano"){
          trackList.push({
            "src": "multitrack/"+folderName+"/"+element.sound,
            "name": element.name,
            "start": 23.5,
            "fadeOut": {
              "shape": "linear",
              "duration": 0.5
            },
            "cuein": 15
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

      playlist.load(trackList).then(function() {
        //can do stuff with the playlist.

        //initialize the WAV exporter.
        playlist.initExporter();
      });

  };
  xhr.send();
}


/*
playlist.load([
  {
    "src": "waveform/media/audio/Vocals30.mp3",
    "name": "Vocals",
    "fadeIn": {
      "duration": 0.5
    },
    "fadeOut": {
      "duration": 0.5
    },
    "cuein": 5.918,
    "cueout": 14.5,
    "customClass": "vocals",
    "waveOutlineColor": '#c0dce0'
  },
  {
    "src": "waveform/media/audio/BassDrums30.mp3",
    "name": "Drums",
    "start": 8.5,
    "fadeIn": {
      "shape": "logarithmic",
      "duration": 0.5
    },
    "fadeOut": {
      "shape": "logarithmic",
      "duration": 0.5
    }
  },
  {
    "src": "waveform/media/audio/Guitar30.mp3",
    "name": "Guitar",
    "start": 23.5,
    "fadeOut": {
      "shape": "linear",
      "duration": 0.5
    },
    "cuein": 15
  }
]).then(function() {
  //can do stuff with the playlist.

  //initialize the WAV exporter.
  playlist.initExporter();
});

*/