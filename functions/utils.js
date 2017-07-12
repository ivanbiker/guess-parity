const config = require('./config');

module.exports.generateInitialMoves = function generateInitialMoves(forGameCreator) {
    const moves = {};

    let i = 0;
    let N = config.MAX_TURNS_COUNT;

    if (forGameCreator) {
        moves[0] = -2;
        i += 1;
        N += 1;
    }

    for (; i < N; i += 1) {
        moves[i] = -1;
    }

    return moves;
};