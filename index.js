var readline = require('readline');

var vocab = require('./vocab')();
require('./handlers')(vocab);

require('./lib/loaders/folder')(__dirname + '/example', function(err, loadedMap) {
	
	game = {
		map: loadedMap,
		say: function(line) {
			console.log(line);
		},
		describe: function(room) {
			console.log(room.description());
		}
	};

	actors = {
		player: {
			room: game.map.findRoom('main.room1')
		}
	};

	start();
});

var game = null;
var actors = null;

function start() {
	var rl = readline.createInterface({
	    input: process.stdin,
	    output: process.stdout,
	});

	function handle(line) {
		vocab.invoke(line, actors.player, game);
	}

	rl.setPrompt('> ');
	rl.prompt();
	rl.on('line', function(line) {
	    rl.pause();
	    handle(line.trim());
	    rl.resume();
	    rl.prompt();
	}).on('close', function() {
	    console.log('Have a great day!');
	    process.exit(0);
	});
}
