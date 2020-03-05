window.onload = init;

function init(){


    $( "#formData" ).submit(function( event ) {
        event.preventDefault();
        let n=0;
        document.getElementById("progressbar").classList.remove('hidden');
        document.getElementById("info").classList.remove('hidden');
        document.getElementById("upload_progressbar").classList.remove('hidden');

        document.getElementById("musicPlayer").classList.add('hidden');
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

    function FolderChecking(interval,filename){
    var myVar;

    myVar = setInterval(getData, 20000);

    function getData() {
            $.ajax({
                url : 'checkOutputFolder',
                type : 'GET',
                data : {
                    'name' : filename
                },
                dataType:'json',
                success : function(data) {              
                    console.log('Data: '+JSON.stringify(data));
                    if(data.player){
                        clearInterval(myVar);
                        document.getElementById("musicPlayer").classList.remove('hidden');
                        $("#playerUrl").attr("href", "/mt5Player?name="+data.name);
                        
                        clearInterval(interval);
                        document.getElementById("progressbar").classList.add('hidden');
                        document.getElementById("info").classList.add('hidden');
                        document.getElementById("upload_progressbar").classList.add('hidden');
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