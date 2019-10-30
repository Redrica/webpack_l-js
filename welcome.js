'use strict'

module.exports = function (message) {
    console.log(process.env.NODE_ENV);

    if (process.env.NODE_ENV == 'development') {
        alert('DEV!!!!')
    }

    alert(`Welcome 555 ${message}`);
};