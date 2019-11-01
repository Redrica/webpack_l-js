'use strict';

let someString = 'Some string';
console.log(someString);

export default function (message) {
    console.log(process.env.NODE_ENV);

    // используем константу NODE_ENV, которую передает DefinePlugin
    if (NODE_ENV == 'development') {
        alert('DEV!')
    }

    if (NODE_ENV == 'production') {
        alert('PROD!')
    }

    if (NODE_ENV != 'development' && NODE_ENV != 'production') {
        alert('There is something strange.')
    }

    alert(`Welcome 555 ${message}`);
};