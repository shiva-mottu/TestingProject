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

  var dir__ = window.location.origin;
  
  var folderName = "";
  function WebAudioSongName(folderName){
    var xhr = new XMLHttpRequest();

    xhr.open('GET', dir__+"/track/"+folderName, true);
  
    xhr.onload = function (e) {
        var songTracks = JSON.parse(this.response);
  
        var trackList = [];
        songTracks.instruments.forEach(element => {
          
          trackList.push({
            "src": dir__+"/multitrack/"+folderName+"/"+element.sound,
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
  
  function tooltipText(){
    var tooltip = document.getElementById("share");
    tooltip.innerHTML = "Copy to clipboard";
  };
  
  function shareMusicLink(){
      console.log("share music link called");
    var link = window.location.origin+"/sharemusic/"+folderName;

    navigator.clipboard.writeText(link).then(function() {
        console.log('Async: Copying to clipboard was successful!');
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    
    var tooltip = document.getElementById("share");
    tooltip.innerHTML = "Copied: " + link;
  };