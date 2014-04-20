var events = require('events');
var util = require('util');

/**
 * Hungry Llama Game Model
 */

var HungryLlama = function() {

	this.questions = [
		{
			id:1,
			options:["strawberry", "blueberry"],
			correct:["strawberry"]
		},
		{
			id:2,
			options:["strawberry", "blueberry"],
			correct:["strawberry", "blueberry"]
		},		
	];

	this.gameData = {};
 	events.EventEmitter.call(this);
};
util.inherits(HungryLlama, events.EventEmitter);

/* Constants */
HungryLlama.STATE_WAITING = "waiting";
HungryLlama.STATE_PLAYING = "playing";
HungryLlama.EVENT_DATA_CHANGED = "data";

/* Class implementation */
HungryLlama.prototype.resetGame = function() {
	this.gameData = {
		questionNum:0,
		state:HungryLlama.STATE_WAITING
	};
};

HungryLlama.prototype.startGame = function() {
	this.gameData.state = HungryLlama.STATE_PLAYING;
};

HungryLlama.prototype.nextQuestion = function() {
	//TODO: Load question file
};

HungryLlama.prototype.onDataChanged = function() {
	this.emit(HungryLlama.EVENT_DATA_CHANGED, this.gameData);
};

module.exports = HungryLlama;
