var chai = require('chai');
var assert = chai.assert;

describe('Hungry Llama Game', function() {
  var HungryLlama = require('../modules/hungry-llama');

  describe('Inital State', function() {
  	var game = new HungryLlama();

    it('should have gameData in the initial State', function() {
      assert.equal(HungryLlama.STATE_WAITING, game.gameData.state);
      assert.notProperty(game.gameData, 'question');
      assert.notProperty(game.gameData, 'questionNum');
    });
  });

  describe('Question progression', function() {
    describe('First question', function() {
    	var game = new HungryLlama();
    	game.startGame();

      it('should have question 0 active', function() {
        assert.equal(HungryLlama.STATE_PLAYING, game.gameData.state);
        assert.equal(0, game.gameData.questionNum);
        assert.equal(game.questions[0].id, game.gameData.question.id);
      });
    });

    describe('Second question', function() {
      var game = new HungryLlama();
      game.startGame();
      game.nextQuestion();

      it('should have question 1 active', function() {
        assert.equal(1, game.gameData.questionNum);
        assert.equal(game.questions[1].id, game.gameData.question.id);
      });
    });

    describe('Loop questions', function() {
      var game = new HungryLlama();
      game.startGame();

      for (var i=0; i<game.questions.length; i++)
        game.nextQuestion();

      it('should be back at question 0', function() {
        assert.equal(0, game.gameData.questionNum);
        assert.equal(game.questions[0].id, game.gameData.question.id);
      });
    });
  });

  describe('Player join/leave', function() {
    describe('Empty player list', function() {
      var game = new HungryLlama();
      assert.equal(0, game.gameData.players.length);
    });

    describe('Add and remove a single player', function() {
      var game = new HungryLlama();
      var id = "id1";
      var name = "Shakira";
      game.addPlayer(id, name);
      assert.equal(1, game.gameData.players.length);
      assert.equal(id, game.gameData.players[0].id);
      assert.equal(name, game.gameData.players[0].name);
      assert.equal(0, game.gameData.players[0].score);
      game.removePlayer(id);
      assert.equal(0, game.gameData.players.length);
    });    

    describe('Game starts when a player joins and resets when empty', function() {
      var game = new HungryLlama();
      assert.equal(HungryLlama.STATE_WAITING, game.gameData.state);
      var id = "id1";
      var name = "Shakira";
      game.addPlayer(id, name);
      assert.equal(HungryLlama.STATE_PLAYING, game.gameData.state);
      game.removePlayer(id);
      assert.equal(HungryLlama.STATE_WAITING, game.gameData.state);
    });  
  });

  describe('Game events', function() {
    var game = new HungryLlama();
    it('should fire events when data changes', function(done) {
      game.on(HungryLlama.EVENT_DATA_CHANGED, function(data) {
        assert.equal(HungryLlama.STATE_PLAYING, data.state);
        assert.equal("test", data.players[0].id);
        assert.equal("test", data.players[0].name);
        done();
      });
      game.addPlayer("test", "test");
    });
  });


});
