window.onload = init;

function init(){


    $( "#formData" ).submit(function( event ) {
        event.preventDefault();
        let n=0;
        document.getElementById("progressbar").classList.remove('hidden');
        document.getElementById("info").classList.remove('hidden');
        document.getElementById("upload_progressbar").classList.remove('hidden');

        document.getElementById("musicPlayer").classList.add('hidden');
        document.getElementById("file_status").classList.add('hidden');

        var interval = setInterval(function() {
            progress()
        }, 1500);
    
        function progress() {
            if (n <= 98) {
                document.querySelector(".progress-bar-striped > div p").textContent = n + "%";
                document.querySelector(".progress-bar-striped > div").style.width = n + "%";
                n++;
            }
        }


        let link = $("#link").val();
        let myfile = $("#musicFile").prop('files');
        let stems = $( "#stems" ).val();

        let formData  = new FormData();
        formData.append("link",link);
        formData.append("stems",stems);

        for(var i=0;i<myfile.length;i++){
            formData.append("musicFile",myfile[i])
        }

        const UploadProgressBarFill = document.querySelector("#upload_progressbar > .progress-bar-fill");
        const UploadProgressBarText = document.querySelector(".progress-bar-text");

        var contentType = {
            headers : {
                "content-type" : "multipart/form-data"
            },
            onUploadProgress: function(progressEvent) {
                var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                UploadProgressBarFill.style.width = percentCompleted + "%";
                UploadProgressBarText.textContent = percentCompleted + "%";
                if(percentCompleted == 100){
                    document.getElementById("file_status").classList.remove('hidden');
                    document.getElementById("upload_progressbar").classList.add('hidden');
                }
            }
        }

        var output = document.getElementById('output');
        axios.post('/formUpload',formData,contentType)
        .then(function (response) {
            result = response.data;
            if(result.status)
                FolderChecking(interval,result.folderName)
            
        })
        .catch(function (error) {
            console.log(error);
        });

    });

    
    function deleteTrack(trackName){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "deleteTrack/"+trackName, true);

        xhr.onload = function (e) {
            var response = JSON.parse(this.response);
            return response;
        };
        xhr.send();
    }

    function FolderChecking(interval,filename){
    var myVar = setInterval(getData, 20000);

    
    function getTracks(folderName){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "track", true);

        // Menu for song selection
        var s= document.getElementsByClassName('dropdown-container')
        document.getElementById("dropdown_div").classList.remove('hidden');
  
        xhr.onload = function (e) {
            var songList = JSON.parse(this.response);
        
            if (songList.length == 0) {
                $("<li class='init'>No Data Found....<div class='deleteMe'>X</div> </li>").appendTo(s);
            }
        
            songList.forEach(function (songName) {
                $("<li>"+songName+"<div class='deleteMe'>X</div> </li>").appendTo(s);
            });

            $(".deleteMe").on("click", function() {
                if (confirm('Are you sure to delete?')) {
                
                  var trackName = $(this).closest("li").text().trim().slice(0, -1);
                  console.log(trackName);

                  deleteTrack(trackName);
                
                  $(this).closest("li").remove();

                } else {
                  return false
                }
                return false;
            });
            
            $('li').click(function(e) {
                var trackName = $(this).text().trim().slice(0, -1);
                console.log(trackName);
                $('#selected').html('<img class="trigger" src = "https://i.stack.imgur.com/LFSrX.png">' + trackName);
                $('.dropdown-container').hide();

                $("#iframeUrl").attr("src", "/mt5Player?name="+trackName);
            });

            $(window).click(function() {
                $(".dropdown").css("border", "1px solid red");
                $('.dropdown-container').hide();
            });
            
            $("#selected").on("click", function(e) {
                $(".dropdown").css("border", "1px solid black");
                $('.dropdown-container').show();
                return false;
            });

        };
        xhr.send();

        $('#selected').html('<img class="trigger" src = "https://i.stack.imgur.com/LFSrX.png">' + folderName);    
    }


    function getData() {
            $.ajax({
                url : 'checkOutputFolder',
                type : 'GET',
                data : {
                    'name' : filename
                },
                dataType:'json',
                success : function(data) {              
                    console.log('Chek in Floder: '+JSON.stringify(data));
                    if(data.player){
                        clearInterval(myVar);
                        document.getElementById("musicPlayer").classList.remove('hidden');
                        $("#iframeUrl").attr("src", "/mt5Player?name="+data.name);

                        clearInterval(interval);
                        getTracks(data.name);
                        document.getElementById("progressbar").classList.add('hidden');
                        document.getElementById("info").classList.add('hidden');
                    }
                },
                error : function(request,error)
                {
                    clearInterval(myVar);
                    console.log("Request: "+JSON.stringify(request));
                }
            });
    }
}

}