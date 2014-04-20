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
    this.gameData.players.push({id:id, score:0, name:name});
    if (this.gameData.players.length == 1) {
        this.startGame();
        return;
    }
    this.dataChanged();
};

HungryLlama.prototype.removePlayer = function(id) {
    for (var i=0; i<this.gameData.players.length; i++) {
        if (this.gameData.players[i].id == id) {
            this.gameData.players.splice(i, 1);
            break;
        }
    }
    if (this.gameData.players.length === 0) {
        this.resetGame();
    }
    else {
        this.dataChanged();
    }
};

/* Class implementation */
HungryLlama.prototype.resetGame = function() {
    this.gameData = {
        state:HungryLlama.STATE_WAITING,
        players:[]
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
    this.dataChanged();
};

HungryLlama.prototype.answered = function(id, data) {
    var p = this.findPlayer(id);
    if (p) {
        var correctAnswers = this.questions[this.gameData.questionNum].correct;
        var isCorrect = true;
        if (correctAnswers.length != data.answer.length)
            isCorrect = false;
        for (var i=0; i<data.answer.length; i++) {
            if (!correctAnswers.contains(data.answer[i])) {
                isCorrect = false;
                break;
            }
        }

        // This player got it right first. Award points and move on to the next question
        if (isCorrect) {
            p.score += 100;
            this.gameData.lastCorrectPlayer = p.id;
            this.nextQuestion();
            return true;
        }
    }
    return false;
};

HungryLlama.prototype.dataChanged = function() {
    this.emit(HungryLlama.EVENT_DATA_CHANGED, this.gameData);
};

HungryLlama.prototype.findPlayer = function(id) {
    var len = this.gameData.players.length;
    for (var i=0; i<len; i++) {
        if (this.gameData.players[i].id == id)
            return this.gameData.players[i];
    }
    return null;
}

HungryLlama.prototype.sortPlayers = function() {
    this.gameData.players.sort(function(a, b) { 
        return a.score - b.score;
    });
};

module.exports = HungryLlama;
