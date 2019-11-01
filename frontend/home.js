'use strict';
// этот модуль home подключает модуль welcome

import welcome from './welcome';

//welcome('home');

// ↓ работает в отсутствие babel [предположение!]
// exports.welcome = welcome;

// ↓ если установлен babel [предположение!]
export {welcome};

let someFunkHome = () => console.log(new Date().toDateString());
someFunkHome();

