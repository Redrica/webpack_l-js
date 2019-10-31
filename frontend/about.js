'use strict';
// еще одна точка входа

import welcome from './welcome';

welcome('about about abooooout meeee!');

// работает тут, но не работает в другой сборке
exports.welcome = welcome;
// такой вариант работает в другой сборке
//export {welcome}