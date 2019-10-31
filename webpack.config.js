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
// почему-то, если при старте процесса не задать NODE_ENV в переменную окружения, то 'development' не присваивается, а NODE_ENV оказывается undefined.
// UPD оно присваивается, просто это разные NODE_ENV. Тут константа, которую мы используем в настройках сборки, а в плагин EnvironmentPlugin мы передаем NODE_ENV из объекта process.env
// ИТОГО: process.env.NODE_ENV либо задается при запуске в командной строке, тогда const NODE_ENV принимает ее значение,
// либо const NODE_ENV получает значение development и через DefinePlugin уставливает process.env.NODE_ENV. Вроде бы так.

module.exports = {
    // mode: 'development',
    // entry: './home', // если одна точка входа, т.е. всё будем собирать из одного-единственного файла
    entry: {
        home: './frontend/home',
        about: './frontend/about',
    },

    // output: { // если нужен единый конечный бандл, возможно для маленького проекта
    //     filename: './build.js',
    //     library: 'home',
    // },

    output: {
        path: __dirname + '/public', // обязательно абсолютный путь
        filename: '[name].js', // задается шаблон, вместо name будет подставлено имя того файла, на основе которого собирается бандл
        library: '[name]', // то же самое, каждая сборка экспортируется в своб глобальную переменную
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

        // new webpack.EnvironmentPlugin('NODE_ENV'), - такой вариант не подойдет, т.е. если не задать при запуске NODE_ENV, то она будет undefined

        // ↓ таким образом мы задаем для NODE_ENV (переменной окружения) значение по умолчанию. Этот вариант подходит только для записи самой по себе process.env.NODE_ENV
        // new webpack.EnvironmentPlugin({
        //      NODE_ENV: 'development'
        // }),

        // чтобы передавать "наружу" именно переменную NODE_ENV - используем такой способ.
        // при этом мы И записываем значение в process.env.NODE_ENV И передаем его наружу в виде переменной NODE_ENV
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV), // внутрь stringify передаем значени const NODE_ENV
        })
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader' // раньше можно было указывать просто babel, т.к. -loader добавлялось самим WP из resolve конфига по умолчанию.
            }
        ]
    }


};