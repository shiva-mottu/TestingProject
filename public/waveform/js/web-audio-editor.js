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
        
        trackList.push({
          "src": "multitrack/"+folderName+"/"+element.sound,
          "name": element.name.toUpperCase()
        });
      });

      playlist.load(trackList).then(function() {
        //can do stuff with the playlist.

        //initialize the WAV exporter.
        playlist.initExporter();
      });

  };
  xhr.send();
}
