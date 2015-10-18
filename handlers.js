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
        down: ['down']
    });

    // ctx.rewrite('go <direction:motion>', '$direction');

    ctx.handler(':motion', {
        handler: function(command, actor, game) {
            console.log(arguments);
        }
    });

    ctx.handler('get *', {
        guard: function() {

        },
        handler: function(command, actor, game) {

        }
    });


}