'use strict';

const webpack = require('webpack');
const path = require('path');

// заводим переменную окружения, она или указанное значение, или, если его нет, то development. Указывает на то, в каком режиме будет собираться проект.
// мы БЕРЕМ значение process.env.NODE_ENV (традиционную переменную окружения Node.js)
// и записываем его в переменную NODE_ENV.
// а вот process.env.NODE_ENV мы должны установить(!) при запуске сборки:
// set NODE_ENV=development && webpack - кривой способ для Windows
// либо уставновить npm пакет для кросплатформенного обращения к этим переменным – cross-env
// и тогда запуск будет такой: cross-env NODE_ENV=development webpack
// Это запишет значение development в переменную process.env.NODE_ENV.
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    mode: 'development',
    entry: './home',
    output: {
        filename: './build.js',
        library: 'home',
    },

    // делаем так, чтобы отслеживание изменений работало только в случае режима разработки
    watch: NODE_ENV == 'development',
    watchOptions: {
      aggregateTimeout: 100
    },

    // ставим подключение source-map в зависимость от значения переменной окружения.
    devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : false,

    plugins: [
        // для того, чтобы переменная окружения передавалась наружу, чтобы ее можно было использовать в любом модуле проекта. Передаем ключи.
        new webpack.EnvironmentPlugin('NODE_ENV'),
    ]
};