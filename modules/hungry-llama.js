/**
 * Hungry Llama Game Model
 */


var events = require('events');
var util = require('util');

var HungryLlama = function() {

    this.questions = [
        {
            id:1,
            options:["strawberry", "blueberry"],
            correct:["blueberry"]
        },
        {
            id:2,
            options:["strawberry", "blueberry", "pizza", "lettuce"],
            correct:["strawberry", "blueberry", "lettuce"]
        }, 
        {
            id:3,
            options:["orange", "blueberry", "pizza", "lettuce", "carrot"],
            correct:["orange", "carrot"]
        },             
    ];

    this.players = [];
    this.gameData = {};
    this.resetGame();
    events.EventEmitter.call(this);
};
util.inherits(HungryLlama, events.EventEmitter);

/* Constants */
HungryLlama.STATE_WAITING = "waiting";
HungryLlama.STATE_PLAYING = "playing";
HungryLlama.EVENT_DATA_CHANGED = "data";

HungryLlama.prototype.addPlayer = function(id, name) {    
    this.players.push({id:id, score:0, name:name});
    if (this.players.length == 1) {
        this.startGame();
    }
};

HungryLlama.prototype.removePlayer = function(id) {
    for (var i=0; i<this.players.length; i++) {
        if (this.players[i].id == id) {
            this.players.splice(i, 1);
            break;
        }
    }
    if (this.players.length === 0) {
        this.resetGame();
    }
};

/* Class implementation */
HungryLlama.prototype.resetGame = function() {
    this.gameData = {
        state:HungryLlama.STATE_WAITING
    };
};

HungryLlama.prototype.startGame = function() {
    this.gameData.state = HungryLlama.STATE_PLAYING;    
    this.setQuestion(0);
};

HungryLlama.prototype.nextQuestion = function() {
    var nextQuestion = this.gameData.questionNum + 1;    
    if (nextQuestion >= this.questions.length) {
        nextQuestion = 0;
    }
    this.setQuestion(nextQuestion);
};

HungryLlama.prototype.setQuestion = function(n) {
    this.gameData.questionNum = n;
    this.gameData.question = this.questions[n];
};

HungryLlama.prototype.answered = function(id, data) {
    console.log(data);

};

HungryLlama.prototype.onDataChanged = function() {
    this.emit(HungryLlama.EVENT_DATA_CHANGED, this.gameData);
};

module.exports = HungryLlama;
