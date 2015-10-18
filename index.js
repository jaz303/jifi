var readline = require('readline');

var vocab = require('./vocab')();
require('./handlers')(vocab);

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

var regions = {
	main: {
		room1: {
			text: "You are in room 1",
			exits: {
				north: 'main.room2'
			}
		},
		room2: {
			text: "You are in room 2",
			exits: {
				south: 'main.room1'
			}
		}
	}
};

var actors = {
	player: {
		room: regions.main.room1
	}
};

function Map(regions) {
	this.regions = regions;
}

Map.prototype.find = function(room) {
	var chunks = room.split('.');
	var dest = this.regions;
	while (chunks.length) {
		dest = dest[chunks.shift()];
		if (!dest) {
			break;
		}
	}
	return dest;
}

var game = {
	map: new Map(regions),
	say: function(line) {
		console.log(line);
	},
	describe: function(room) {
		console.log(room.text);
	}
};

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
