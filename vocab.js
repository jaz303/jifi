var util = require('util');

function YES() { return true; }

module.exports = function() {

    var vocab = {};
    var handlers = [];

    function reduceWord(w) {
        while (vocab[w] && vocab[w].type === 'alias') {
            w = vocab[w].of;
        }
        return w;
    }

    return {
        motion: function(dirs) {
            dirs.forEach(function(d) {
                vocab[d] = 'motion';
            });
        },
        aliases: function(aliases) {
            for (var k in aliases) {
                aliases[k].forEach(function(alias) {
                    vocab[alias] = {type: 'alias', of: k};
                });
            }
        },
        handler: function(pattern, opts) {
            pattern = pattern.split(/\s+/).map(function(word) {
                if (word[0] === ':') {
                    return { type: 'class', className: word.substring(1) };
                } else if (word[0] === '*') {
                    return { type: 'any' };
                } else {
                    return { type: 'literal', word: word };
                }
            })

            opts.guard = opts.guard || YES;
            opts.pattern = pattern;
            handlers.push(opts);
        },
        invoke: function(command, actor, game) {
            function _try(handler) {
                var p = handler.pattern;
                var m = [];

                if (p.length !== words.length) {
                    return false;
                }

                for (var i = 0; i < p.length; ++i) {
                    var w = p[i];
                    var r = reduceWord(words[i]);
                    switch (w.type) {
                        case 'class':
                            if (vocab[r] !== w.className) {
                                return false;
                            }
                            break;
                        case 'any':
                            break;
                        case 'literal':
                            if (w.word !== r) {
                                return false;
                            }
                            break;
                    }
                    m.push(r);
                }

                handler.handler(m, actor, game);
                return true;
            }

            words = command.toLowerCase().trim().split(/\s+/);
            for (var i = 0; i < handlers.length; ++i) {
                if (_try(handlers[i])) return;
            }

            game.say("Sorry, I don't understand");
        }
    }
}