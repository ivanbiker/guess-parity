const admin  = require('firebase-admin');
const config = require('../config');
const _ = require('lodash');

module.exports = function makeMove(req, res) {
    const { gameId, unknownNumber, parity } = req.body;

    if (typeof gameId !== 'string' || gameId.length === 0) {
        return res.send({
            code: 'error',
            message: `wrong gameId: '${gameId}'`,
        });
    }

    if (typeof unknownNumber !== 'number' || unknownNumber !== Math.floor(unknownNumber)) {
        return res.send({
            code: 'error',
            message: `wrong unknownNumber: '${unknownNumber}'`,
        })
    }

    if (parity !== 0 && parity !== 1) {
        return res.send({
            code: 'error',
            message: `wrong parity: '${parity}'`,
        });
    }

    admin.database().ref(`games/${gameId}`).transaction(game => {
        if (!game) {
            return game;
        }

        if (game.playersJoined !== game.playersCount) {
            return game;
        }

        if (game.isFinished) {
            return game;
        }

        const expectedUid = game.indexToUid[game.indexToMakeMove];

        if (expectedUid !== req.user.uid) {
            return game;
        }

        const score = game.unknownNumber !== undefined && game.unknownNumber % 2 === parity
            ? 1
            : 0
        ;

        const nextIndexToMakeMove = game.indexToMakeMove + 1 < game.playersCount
            ? game.indexToMakeMove + 1
            : 0
        ;

        const userTurnsCount = game.users[req.user.uid].turnsCount;

        game.users[req.user.uid].moves[userTurnsCount] = game.unknownNumber === undefined
            ? -3
            : score
        ;

        game.unknownNumber = unknownNumber;
        game.turnsCount += 1;
        game.users[req.user.uid].score += score;
        game.users[req.user.uid].turnsCount += 1;
        game.indexToMakeMove = nextIndexToMakeMove;

        const winnerId = getWinner(game);

        if (winnerId) {
            game.isFinished = true;
            game.winnerId = winnerId;
        }

        return game;
    });

    res.send({code: 'success'});
};

function getWinner(game) {
    if (game.turnsCount < game.playersCount * config.MAX_TURNS_COUNT + 1) {
        return;
    }

    const scores = _.toPairs(game.users).map(([uid, u]) => u.score);
    const scoreToCount = {};

    for (const score of scores) {
        if (!(score in scoreToCount)) {
            scoreToCount[score] = 0;
        }

        scoreToCount[score] += 1;
    }

    const maxScore = Math.max.apply(Math, scores);

    if (scoreToCount[maxScore] === 1) {
        for (const uid in game.users) {
            if (game.users.hasOwnProperty(uid)) {
                const user = game.users[uid];

                if (user.score === maxScore) {
                    return uid;
                }
            }
        }
    }
}