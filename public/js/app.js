/*************************************
//
// hungry-llama app
//
**************************************/

// connect to our socket server

var connectionString = 'http://localhost:1337/';
if (document) {
    connectionString = 'http://' + document.location.hostname;
    if (document.location.port)
        connectionString += ':' + document.location.port;
    connectionString += '/';
}
var socket = io.connect(connectionString);
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
    var currentQuestion = null;

    $("#submit").click(function() {
        var answers = [];
        $(".toggle-button").each(function(i) {
            if ($( this ).hasClass('btn-info')) {
                answers.push($( this ).attr("data-id"));
            }
        });
        socket.emit("answer", {answer:answers});
    });

    //SOCKET STUFF
    socket.on("connect", function(data) {
        // send name
        socket.emit("name", {name:playerName});
    });

    socket.on("blast", function(data){
        if (data.state == "waiting")
            return;

        // update game question state
        if (data.question.id != currentQuestion)  {
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

            currentQuestion = data.question.id;
        }
        if (data.players) {
            $('#players-table').find('tr:gt(0)').remove();
            for (var i=0; i<data.players.length; i++) {
                var trTag = '<tr>';
                if (data.players[i].id == data.lastCorrectPlayer) {
                    trTag = '<tr class="success">';
                }
                var rowString = trTag + '<td>' + data.players[i].name + '</td><td>' + data.players[i].score + '</td></tr>';
                $('#players-table tr:last').after(rowString);
            }
        }

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
