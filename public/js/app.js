/*************************************
//
// hungry-llama app
//
**************************************/

// connect to our socket server
var socket = io.connect('http://127.0.0.1:1337/');

var app = app || {};


// shortcut for document.ready'

$(function(){
    //setup some common vars
    var $blastField = $('#blast'),
        $allPostsTextArea = $('#allPosts'),
        $clearAllPosts = $('#clearAllPosts'),
        $sendBlastButton = $('#send');

    var urlsplits = window.location.href.split("=");
    var playerName = (urlsplits.length > 1) ? decodeURIComponent(urlsplits[1]) : "Unknown";

    $("#submit").click(function() {
        var answers = [];
        $(".toggle-button").each(function(i) {
            if ($( this ).hasClass('btn-info')) {
                answers.push($( this ).attr("data-id"));
            }
        });
        socket.emit("answer", {player:"me", answer:answers});
        console.log("send answer");
    });

    //SOCKET STUFF
    socket.on("connect", function(data) {
        // send name
        socket.emit("name", {name:playerName});
    });

    socket.on("blast", function(data){
        if (data.state == "waiting")
            return;
        console.log(data);

        // update game state        
        $('#question-image').attr('src', 'img/questions/' + (data.question.id) + '.png');
        $('#choice-buttons').empty();
        var numOptions = data.question.options.length; 
        var buttonHTML = "";
        for (var i=0; i<numOptions; i++) {
            buttonHTML += '<button type="button" data-id="' + data.question.options[i] + '" class="btn btn-default btn-lg toggle-button"><img src="img/' + data.question.options[i] + '.png"/></button> ';
        }
        $('#choice-buttons').html(buttonHTML);

        // Choose options
        $(".toggle-button").click(function() {
            $( this ).toggleClass('btn-info');
        });    
    });
    
    $clearAllPosts.click(function(e){
        $allPostsTextArea.text('');
    });

    $sendBlastButton.click(function(e){

        var blast = $blastField.val();
        if(blast.length){
            socket.emit("blast", {msg:blast}, 
                function(data){
                    $blastField.val('');
                });
        }


    });

    $blastField.keydown(function (e){
        if(e.keyCode == 13){
            $sendBlastButton.trigger('click');//lazy, but works
        }
    });
    
});
