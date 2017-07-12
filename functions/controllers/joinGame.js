const admin = require('firebase-admin');
const utils = require('../utils');

module.exports = function joinGame(req, res) {
    const { gameId } = req.body;

    if (typeof gameId !== 'string' || gameId.length === 0) {
        return res.send({
            code: 'error',
            message: `wrong gameId: '${gameId}'`,
        });
    }

    admin.database().ref(`games/${gameId}`).once('value')
        .then(snapshot => {
            if (snapshot.val() === null) {
                return res.send({
                    code: 'error',
                    message: `game does not exist: '${gameId}'`,
                });
            }

            admin.database().ref(`games/${gameId}`).transaction(game => {
                if (!game) {
                    return game;
                }

                if (game.playersJoined === game.playersCount) {
                    return game;
                }

                game.indexToUid[game.playersJoined] = req.user.user_id;
                game.playersJoined += 1;
                game.users[req.user.user_id] = {
                    score: 0,
                    name: req.user.name,
                    turnsCount: 0,
                    moves: utils.generateInitialMoves(),
                };

                return game;
            });

            res.send({code: 'success'});
        })
    ;
};