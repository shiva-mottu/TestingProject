
var router = require('./.../routers');

console.log(router);

console.log("loading data js loaded...");

var playlist = WaveformPlaylist.init({
  container: document.getElementById("playlist"),
  controls: {
    show: true, //whether or not to include the track controls
    width: 200 //width of controls in pixels
  },
  waveHeight: 100
});

playlist.load([
  {
    "src": "waveform/media/audio/Vocals30.mp3",
    "name": "Vocals"
  },
  {
    "src": "waveform/media/audio/BassDrums30.mp3",
    "name": "Bass & Drums"
  }
]).then(function() {
  //can do stuff with the playlist.
});
