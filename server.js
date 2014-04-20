/*************************************
//
// hungry-llama app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server); 
var device  = require('express-device');

var HungryLlama = require('./modules/hungry-llama.js');
var game = new HungryLlama();

var runningPortNumber = process.env.PORT;

app.configure(function(){
    // I need to access everything in '/public' directly
    app.use(express.static(__dirname + '/public'));

    //set the view engine
    app.set('view engine', 'ejs');
    app.set('views', __dirname +'/views');

    app.use(device.capture());
});


// logs every request
app.use(function(req, res, next){
    // output every request in the array
    console.log({method:req.method, url: req.url, device: req.device});

    // goes onto the next function in line
    next();
});

app.get("/", function(req, res){
    res.render('index', {});
});
app.get("/game", function(req, res){
    var obj = {};
    obj.name = req.query.name;
    res.render('game', obj);
});

var clients = [];
io.sockets.on('connection', function (socket) {
    io.sockets.emit('blast', game.gameData);
    clients.push(socket);

    socket.on('name', function(data){
        game.addPlayer(socket.id, data.name);
    });

    socket.on('blast', function(data, cb){
        console.log("data=" + data);
        io.sockets.emit('blast', {msg:data.msg});
        cb();
    });

    socket.on('answer', function(data, fn) {
        console.log("answer data=" + data);
        game.answered(socket.id, data);
    });

    socket.on('disconnect', function() {
        console.log("client disconnected");
        game.removePlayer(socket.id);
        clients.splice(clients.indexOf(socket));
    });

});



server.listen(runningPortNumber);

