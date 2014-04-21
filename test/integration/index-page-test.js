var testSite = 'http://localhost:1337/';

casper.test.begin('Index Page', 3, function suite(test) {
	casper.start(testSite, function() {
		test.assertTitle("Edmund the Hungry Llama", "title is as expected");
        this.on('remote.alert', testAlert);
        this.click("#start-game");
        this.fill('form', {'name': 'testname'});
        this.click("#start-game");
	});

    var testAlert = function(message) {
        this.test.assertMatch(message, /enter a name/);
    };

    casper.run(function() {
        test.done();
    });	
});