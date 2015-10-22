module.exports = function(ctx) {

    ctx.motion([
        'n',
        'ne',
        'e',
        'se',
        's',
        'sw',
        'w',
        'nw',
        'u',
        'd'
    ]);

    ctx.aliases({
        n   : ['north'],
        ne  : ['northeast'],
        e   : ['east'],
        se  : ['southeast'],
        s   : ['south'],
        sw  : ['southwest'],
        w   : ['west'],
        nw  : ['northwest'],
        u   : ['up'],
        d   : ['down']
    });

    ctx.handler('look', {
        handler: function(command, actor, game) {
            game.describe(actor.room);
        }
    });

    ctx.handler(':motion', {
        handler: function(command, actor, game) {
            if (!actor.room.hasExit(command[0])) {
                game.say("There is no exit in that direction");
            } else {
                actor.room = actor.room.exitDestination(command[0]);
                game.describe(actor.room);
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