'use strict';
// этот модуль home подключает модуль welcome

let welcome = require('./welcome');

welcome('home');

// работает тут, но не работает в другой сборке
exports.welcome = welcome;
// такой вариант работает в другой сборке
//export {welcome}

