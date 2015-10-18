var readline = require('readline');

var rooms = {
    start: {
        name: 'Start',
        exits: {}
    }       
};

var actors = {
    player: {
        room: 'start',
        inventory: [],
        pc: true
    }
};

var player = 'player';
var editMode = false;

var inputState = {
    state: 'ready'
};

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function YesNoHandler(cb) { this.cb = cb; }
YesNoHandler.prototype.prompt = function() { return 'y/n> '; }
YesNoHandler.prototype.handle = function(cmd) {
    if (cmd.toLowerCase() === 'y') {
        return this.cb(true);
    } else if (cmd.toLowerCase() === 'n') {
        return this.cb(false);
    } else {
        console.log("please answer 'y' or 'n'");
        return this;
    }
}

function InteractiveRoomCreator(startRoom, direction, next) {
    this.next = next;
}

InteractiveRoomCreator.prototype.prompt = function() {
    return 'newroom> ';
}

InteractiveRoomCreator.prototype.init = function() {
    console.log("This is the room creator. Type :help for help.")
}

InteractiveRoomCreator.prototype.handle = function(cmd) {

}


var defaultInputHandler = {
    prompt: function() { return '> '; },
    handle: function(cmd) {
        var nextHandler = null;
        if (cmd === ':edit on') {
            editMode = true;
            console.log("edit mode ON");
        } else if (cmd === ':edit off') {
            editMode = false;
            console.log("edit mode OFF");
        } else if (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw', 'u', 'd'].indexOf(cmd) >= 0) {
            nextHandler = this.motion(cmd);
        } else {
            console.log("i don't understand");
        }
        return nextHandler || this;
    },
    motion: function(direction) {
        var self = this;
        var currentActor = actors[player];
        var currentRoom = rooms[currentActor.room];
        var targetRoom = currentRoom.exits[direction];
        if (!targetRoom) {
            if (editMode) {
                console.log("there is no exit in that direction! would you like to create a room?");
                return new YesNoHandler(function() {
                    return new InteractiveRoomCreator(function() {
                        return self;
                    });
                });
            } else {
                console.log("you can't go that way");   
            }
        } else {
            currentActor.room = targetRoom;
        }   
    }
};

var handleInput = defaultInputHandler;

rl.setPrompt(handleInput.prompt());
rl.prompt();
rl.on('line', function(line) {
    rl.pause();
    line = line.trim();
    var nextHandler = handleInput.handle(line);
    if (typeof nextHandler.then === 'function') {
        nextHandler.then(_continue);
    } else {
        _continue(nextHandler);
    }
    function _continue(nextHandler) {
        handleInput = nextHandler;
        rl.resume();
        rl.setPrompt(handleInput.prompt());
        rl.prompt();
    }
}).on('close', function() {
    console.log('Have a great day!');
    process.exit(0);
});
