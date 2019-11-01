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
    mode: 'development',

    // можно установить "базовую директорию" для поиска файлов, чтобы каждый раз не прописывать путь, подходит для случая, когда всё лежит в одном месте.
    context: __dirname + '/frontend',

    // entry: './home', // если одна точка входа, т.е. всё будем собирать из одного-единственного файла
    entry: {
        home: './home', // пути до файлов с точками входа
        about: './about',

        // попытка подключить зависимость как точку входа закончится ничем, т.к. файл одновременно не может быть И импортируемым модулем И точкой входа.
        // Проект соберется, но файл, являющийся одновременно И точкой входа И экспортирующий что-то будет работать очень странно:
        // код до момента экспорта отработает, но экспортировать что-то наружу сам для себя он уже не будет, т.е. экспортируемый код не будет работать для точи входа, созданной из этого файла.
        // При этом в тех точках входа, в которых этот модуль подключен как зависимость – он будет работать именно как модуль, экспортировать код и т.п.
        // Тем не менее эту сборку нельзя считать полностью рабочей.
        // welcome: './welcome'
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
        }),

        // Был раньше такой плагин, который блокировал работу сборки при возникновении ошибок (чтобы не собиралась "кривая").
        // Сейчас, по крайней мере на WP4, его нет.
        // new webpack.NoErrorsPlugin()
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader' // раньше можно было указывать просто babel, т.к. -loader добавлялось самим WP из resolve конфига по умолчанию.
            }
        ]
    },

    optimization: {
        // пришло на замену плагину CommonChunkPlugin.
        // Выделяет модули, экспортируемые одновременно в несколько точек входа, и помещает их в отдельный файл (chunk). Это делается, чтобы код зависимостей не дублировался в итоговом бандле.
        // По умолчанию затрагивает только те модули, которые экспортируются "по запросу" (1st key - chunks):
        // (by default it only affects on-demand chunks, because changing initial chunks would affect the script tags the HTML file should include to run the project.)
        // Это связано с тем, что выделение чанков из начальных точек входа приведет к тому, что их нужно будет отдельно подключать в разметку в тег <script>.
        // При сборке можно посмотреть информацию, в какой фрагмент сборки пошел какой модуль (--display-modules (+ -v)раньше, сейчас не срабатывает. Вроде и так показывает простую раскладку, а подробную как?).
        splitChunks: {
            // DEFAULT == values recommended by Documentation
            chunks: 'initial', // Какие именно чанки будут оптимизированы: 'all', 'async' - DEFAULT, 'initial'. Вместо ключа можно использовать функцию, например чтобы исключить какие-то чанки.
            minSize: 30, // DEFAULT 30 000 !!!
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};