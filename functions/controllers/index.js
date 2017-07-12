module.exports = [
    ['post', '/startGame', require('./startGame')],
    ['post', '/joinGame', require('./joinGame')],
    ['post', '/makeMove', require('./makeMove')],
];