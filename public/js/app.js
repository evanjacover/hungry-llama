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


    $("#submit").click(function() {
        socket.emit("answer", {player:"me", answer:["strawberry"]});
        console.log("send answer");
    });

    //SOCKET STUFF
    socket.on("blast", function(data){
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
