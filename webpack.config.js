var webpack = require('webpack');

module.exports={
    entry:{
        index:'./js/index.js',
        list:'./js/list.js'
    },
    output:{
        path:'./',
        filename:'dist/js/[name].js',
        publicPath:"/"
    },
    module:{
        loaders:[
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {presets: ['es2015']}
            }/*,
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {test:/\.css$/,loader:'style-loader!css-loader'},
            {test:/\.scss$/,loader:'style-loader!sass-loader'}*/
        ]
    },
    plugins:[
        /*new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery",
            "window.jQuery":"jquery"
        })*/
        new webpack.optimize.CommonsChunkPlugin('common.js')
    ]
};