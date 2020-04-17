window.onload = init;
var uploadedFileName = "";

function init(){


    $( "#formData" ).submit(function( event ) {
        event.preventDefault();
        let n=0;
        document.getElementById("progressbar").classList.remove('hidden');
        document.getElementById("info").classList.remove('hidden');
        document.getElementById("upload_progressbar").classList.remove('hidden');

        document.getElementById("playerInfo").classList.add('hidden');
        
        document.getElementById("file_status1").classList.add('hidden');
        document.getElementById("file_status2").classList.add('hidden');

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
                    document.getElementById("upload_progressbar").classList.add('hidden');

                    if(myfile.length>0){
                        document.getElementById("file_status1").classList.remove('hidden');
                    }else{
                        document.getElementById("file_status2").classList.remove('hidden');
                    }
                }
            }
        }

        axios.post('/formUpload',formData,contentType)
        .then(function (response) {
            result = response.data;
            if(result.status)
                FolderChecking(interval,result.folderName,result.renamedFileName)
            
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

    function getTracks(folderName){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "track", true);

        // Menu for song selection
        var s= document.getElementsByClassName('dropdown-container')
        document.getElementById("dropdown_div").classList.remove('hidden');
  
        xhr.onload = function (e) {
            var songList = JSON.parse(this.response);
        
            if (songList.length == 0) {
                $("<li class='init'>No Data Found....<img class='deleteMe' src='img/delete.png' style='width: 26px; '> </li>").appendTo(s);
            }
        
            songList.forEach(function (songName) {
                $("<li>"+songName+"<img class='deleteMe' src='img/delete.png' style='width: 26px; '> </li>").appendTo(s);
            });

        
            $(".deleteMe").click(function() {
                if (confirm('Are you sure to delete?')) {
                
                  var trackName = $(this).closest("li").text();
                  console.log(trackName);

                  deleteTrack(trackName);
                
                  $(this).closest("li").remove();

                } else {
                  return false
                }
                return false;
            });
            
            $('li').click(function(e) {
                var trackName = $(this).text();
                console.log(trackName);
                $('#selected').html('<img class="trigger" src = "img/down_arrow_select.jpg">' + trackName);
                $('.dropdown-container').hide();

                $("#musicUrl").attr("src", "/mt5Player?name="+trackName);
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

        $('#selected').html('<img class="trigger" src = "img/down_arrow_select.jpg">' + folderName);    
    }

    function deleteSong(songName){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "deleteUploadedSong?name="+songName, true);
        xhr.onload = function (e) {
            var response = JSON.parse(this.response);
            console.log(response);
        }
        xhr.send();
    }

    function FolderChecking(interval,filename,filenamewithExt){
    var myVar = setInterval(getData, 20000);   

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
                    document.getElementById("playerInfo").classList.remove('hidden');
                    $("#musicUrl").attr("src", "/mt5Player?name="+data.name);
                    //$('#guitarUrl').attr("src","https://wasabi.i3s.unice.fr/dynamicPedalboard/?bank=Blues&preset=Michel1");
                    
                    //$('#guitarUrl').attr("src","https://mainline.i3s.unice.fr/Wasabi-Pedalboard/#");

                    clearInterval(interval);
                    getTracks(data.name);
                    document.getElementById("progressbar").classList.add('hidden');
                    document.getElementById("info").classList.add('hidden');

                    deleteSong(filenamewithExt);
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