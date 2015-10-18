module.exports = function(ctx) {

    ctx.motion([
        'north',
        'northeast',
        'east',
        'southeast',
        'south',
        'southwest',
        'west',
        'northwest',
        'up',
        'down'
    ]);

    ctx.aliases({
        north: ['n'],
        northeast: ['ne'],
        east: ['e'],
        southeast: ['se'],
        south: ['s'],
        southwest: ['sw'],
        west: ['w'],
        northwest: ['nw'],
        up: ['u'],
        down: ['d']
    });

    ctx.handler('look', {
        handler: function(command, actor, game) {
            game.describe(actor.room);
        }
    });

    ctx.handler(':motion', {
        handler: function(command, actor, game) {
            var dest = actor.room.exits[command[0]];
            if (dest) {
                actor.room = game.map.find(dest);
                game.describe(actor.room);
            } else {
                game.say("There is no exit in that direction");
            }
        }
    });

    ctx.handler('get *', {
        guard: function() {

        },
        handler: function(command, actor, game) {

        }
    });


}