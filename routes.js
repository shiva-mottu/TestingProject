var express = require("express");
const fs = require("fs");
let fsExtra = require("fs-extra");

const youtubedl = require('youtube-dl');
const ytdl = require('ytdl-core');

var multer  = require('multer');
const  path = require("path");
const { exec } = require('child_process');

const uploadFiles = "./public/songs/";

var storage = multer.diskStorage({
    destination: uploadFiles,
    filename: function (req, file, cb) {
      originalname = file.originalname;
      splitName = originalname.split(path.extname(file.originalname))
      name = splitName[0].replace(/[^A-Z0-9]/ig, "");
      cb(null, name + '-' + Date.now() +path.extname(file.originalname));
    }
}) 
var upload = multer({ storage: storage }).single("musicFile") 

var router = express.Router();

TRACKS_PATH = "./public/multitrack/";


router.get("/",function(req,res){
    res.render('index');
});

router.post("/formUpload",(req,res)=>{
upload(req, res, function (err) {
    if (err) {
      // An unknown error occurred when uploading.
      console.log(err);
      res.redirect("/");
    }
      
    const config = {
      onUploadProgress: function(progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(percentCompleted)
      }
    }
      
      let link = req.body.link;
      let stems = req.body.stems;
      
      let renamedFileName = "";
      let originalName = "";
      let splitName = [""];
      if(typeof(req.file) == "undefined"){

        console.log(req.body);

        let fileName = "";
        let splitName = [""];

        var videoReadableStream = ytdl(link, { filter: 'audioonly'});

        ytdl.getInfo(link, function(err, info){
              var videoName = info.title.replace(/[^a-zA-Z0-9]/g, "").toString('ascii');
              folderName = videoName +"_"+Date.now()
              fileName = folderName+ '.mp3'

              var videoWritableStream = fs.createWriteStream(uploadFiles+fileName); 

              var stream = videoReadableStream.pipe(videoWritableStream);

              stream.on('finish', function() {

                console.log("file download finished..");

                ChildProcessScript(fileName,stems)

                res.send({
                  "status":true,
                  originalFileName : fileName,
                  renamedFileName : fileName,
                  folderName : folderName
                });
              });              
        });
                
        /*youtubedl.exec(link, ['-x', '--audio-format', "mp3" ,"-o","/spleeter/songs/%(title)s_"+Date.now()+".%(ext)s","--restrict-filenames",`--unhandled-rejections=strict`], {}, function(err, output) {
          if (err) throw err
          
              console.log(output.join('\n'))
              for(var i=0;i<output.length;i++){
                  if(output[i].startsWith("[ffmpeg] Destination:")){
                    var str = output[i].split("[ffmpeg] Destination:")[1]
                    fileName = str.split("songs\\")[1];
                    splitName = fileName.split(path.extname(fileName))
                    console.log("fileName :"+fileName);
                  }
              }

              ChildProcessScript(fileName,stems)

              res.send({
                "status":true,
                originalFileName : fileName,
                renamedFileName : fileName,
                folderName : splitName[0]
              });

        });*/

      }else{
        console.log(req.file);
        renamedFileName = req.file.filename;
        originalName = req.file.originalname;
        splitName = renamedFileName.split(path.extname(originalName))

        ChildProcessScript(renamedFileName,stems)

        res.send({
          "status":true,
          originalFileName : originalName,
          renamedFileName : renamedFileName,
          folderName : splitName[0]
        });
      }
  })

});

const ChildProcessScript = function(fileName,stems){
  //console.log("fileName :: "+ fileName  +" :: stems :: "+stems)
  //spleeter_cmd = "python -m spleeter separate -i spleeter/songs/"+ fileName +" -p spleeter:"+stems+"stems -o public/multitrack"

  /*const ls = exec(spleeter_cmd, function (error, stdout, stderr) {
    if (error) {
      console.log(error.stack);
      console.log('Error code: '+error.code);
      console.log('Signal received: '+error.signal);
    }
    console.log('Child Process STDOUT: '+stdout);
    console.log('Child Process STDERR: '+stderr);
  });
  
  ls.on('exit', function (code) {
    console.log('Child process exited with exit code '+code);
  });*/

/*const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function spleeter() {
  const { stdout, stderr } = await exec(spleeter_cmd);
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
spleeter();
*/

const { spawn } = require('child_process');


const node = spawn("python",["./spleeter_python.py",fileName,stems]);
node.stdout.on('data', (data) => {
  console.log("stdout:"+ data.toString());
});

node.stderr.on('data', (data) => {
  console.log("stderr:"+ data.toString());
});



/*
cmd =  [ "-m", "spleeter","separate" ,"-i", "spleeter/songs/"+ fileName,"-p","spleeter:"+stems+"stems" ,"-o", "output"]
console.log(cmd)
const node = spawn("python",cmd );

node.stdout.on('data', (data) => {
  console.log('stdout :'+data);
});

node.stderr.on('data', (data) => {
  console.error('stderr: '+data);
});

node.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});*/


}

router.get("/checkOutputFolder", async (req, res) => {
  const folderName = req.query.name;
  let folderPath = TRACKS_PATH+folderName
  let data = {};
  //check directory exist's or not
  if (fs.existsSync(folderPath)) {
      data.player = true;
      data.name = folderName;
      data.checkFolder = true;
  }
  res.send(data);

});

router.get("/deleteUploadedSong", async (req, res) => {
  const name = req.query.name;
  const filePath = "./public/songs/"+name;
  fs.access(filePath, error => {
    if (!error) {
        fs.unlinkSync(filePath);
        res.send({
          "file_delete":true
        });
    } else {
        console.log(error);
        res.send({
          "file_delete":false
        });
    }
});
})

router.get("/mt5Player", async (req, res) => {
  const name = req.query.name;
  if(typeof(name)!="undefined"){
    res.render('web_audio',{name:name});
  }else{
    res.send();
  }
  
});

router.get("/deleteTrack/:name", async (req, res) => {
  const trackName= req.params.name;
  fsExtra.remove(TRACKS_PATH+trackName,function(){
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({"delete" : "done"}));
    res.end();
  });
});

router.get("/sharemusic/:name", async (req, res) => {
  const trackName= req.params.name;
  res.render('player',{name:trackName});
});

// player routing
router.get("/track", async (req, res) => {
    const trackList = await getTracks();
  
    if (!trackList) {
      return res.send(404, "No track found");
    }
  
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(trackList));
    res.end();
  });
  
  // routing
  router.get("/track/:id", async (req, res) => {
    const id = req.params.id;
    const track = await getTrack(id);
  
    if (!track) {
      return res.send(404, 'Track not found with id "' + id + '"');
    }
  
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(track));
    res.end();
  });
  
  const getTracks = async () => {
    const directories = await getFiles(TRACKS_PATH);
    return directories.filter(dir => !dir.match(/^.DS_Store$/));
  };
  
  const endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) !== -1;
  
  isASoundFile = fileName => {
    if (endsWith(fileName, ".mp3")) return true;
    if (endsWith(fileName, ".ogg")) return true;
    if (endsWith(fileName, ".wav")) return true;
    if (endsWith(fileName, ".m4a")) return true;
    return false;
  };
  
  const getTrack = async id =>
    new Promise(async (resolve, reject) => {
      if (!id) reject("Need to provide an ID");
  
      const fileNames = await getFiles(`${TRACKS_PATH}/${id}`);
  
      if (!fileNames) {
        reject(null);
      }
  
      fileNames.sort();
  
      const track = {
        id: id,
        instruments: fileNames
          .filter(fileName => isASoundFile(fileName))
          .map(fileName => ({
            name: fileName.match(/(.*)\.[^.]+$/, "")[1],
            sound: fileName
          }))
      };
  
      resolve(track);
    });
  
  const getFiles = async dirName =>
    new Promise((resolve, reject) =>
      fs.readdir(dirName, function(error, directoryObject) {
        if (error) {
          reject(error);
        }
  
        if (directoryObject !== undefined) {
          directoryObject.sort();
        }
        resolve(directoryObject);
      })
    );
  


module.exports = router;