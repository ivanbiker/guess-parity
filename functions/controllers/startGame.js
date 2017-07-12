const admin = require('firebase-admin');
const config = require('../config');
const utils = require('../utils');

module.exports = function startGame(req, res) {
    const { playersCount } = req.body;

    if (
        typeof playersCount !== 'number' ||
        playersCount < config.MIN_PLAYERS_COUNT ||
        playersCount > config.MAX_PLAYERS_COUNT ||
        playersCount !== Math.floor(playersCount)
    ) {
        return res.send({
            code: 'error',
            message: `wrong playersCount: '${playersCount}'`,
        });
    }

    const game = {
        playersCount,
        playersJoined: 1,
        turnsCount: 0,
        createdAt: Date.now() / 1000,
        users: {
            [req.user.user_id]: {
                score: 0,
                name: req.user.name,
                turnsCount: 0,
                moves: utils.generateInitialMoves(true),
            },
        },
        indexToUid: {
            0: req.user.user_id,
        },
        indexToMakeMove: 0,
        isFinished: false,
        creatorName: req.user.name,
    };
    const games = admin.database().ref('games');
    const gameId = games.push(game).key;

    return res.send({code: 'success', gameId});
};