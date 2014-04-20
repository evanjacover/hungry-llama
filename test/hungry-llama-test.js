var chai = require('chai');
var assert = chai.assert;

describe('Hungry Llama Game', function() {

  describe('Inital State', function() {
  	var HungryLlama = require("../modules/hungry-llama");
  	var game = new HungryLlama();

    it('should have gameData in the initial State', function() {
      assert.equal(HungryLlama.STATE_WAITING, game.gameData.state);
      assert.notProperty(game.gameData, 'question');
      assert.notProperty(game.gameData, 'questionNum');
    });
  });

  describe('First Question', function() {
  	var HungryLlama = require("../modules/hungry-llama");
  	var game = new HungryLlama();
  	game.nextQuestion();

    it('should have question 0 active', function() {
      //assert.equal(HungryLlama.STATE_PLAYING, game.gameData.state);
      assert.equal(game.gameData.questionNum, 0);
      assert.equal(game.gameData.question.id, HungryLlama.questions[0].id);
    });
  });

});
