const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
    },
    devtool: 'inline-source-map',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
				clean: true,
				assetModuleFilename: '[name][ext]',
    },
		// devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
						{
							test: /\.svg$/,
							loader: 'svg-inline-loader',
						}
        ],
    },
		plugins: [
			new HtmlWebpackPlugin ({
				title: 'To-Do List',
				filename: 'index.html',
				template: 'template.html'
			})
		]
};