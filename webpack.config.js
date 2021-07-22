const path = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');

const PRODUCTION = "production";
const DEVELOPMENT = "development";
const isProduction = process.env.NODE_ENV === "production" ? true : false;
const isDevelopment = !isProduction;

console.log(isProduction ? "IT'S PRODUCTION" : "IT'S DEVELOPMENT");

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    }

    if (isProduction) {
        config.minimize = true
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

const babelLoader = preset => {
    const options = {
        loader: 'babel-loader',
        options: {
            presets: ["@babel/preset-env"]
        }
    }

    if (preset) {
        options.options.presets.push([preset])
    }

    return options;
}

module.exports = {
    mode: isProduction ? PRODUCTION : DEVELOPMENT,
    context: path.resolve(__dirname, "src"),
    entry: {
        main: ["@babel/polyfill", "./index.jsx"]
    },
    output: {
        filename: "static/js/[name].[contenthash].chunk.js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".js", ".json", ".jsx"]
    },
    optimization: optimization(),
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            // filename: "assets/index.html",
            inject: "body",
            minify: isProduction
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash].css"
        }),
        new EslintWebpackPlugin({
            extensions: ["js", "jsx"],
            exclude: "node_modules"
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: babelLoader()
            },
            {
                test: /\.jsx$/i,
                exclude: /node_modules/,
                use: babelLoader('@babel/preset-react')
            }
        ]
    },
    devServer: {
        port: 9000
    },
    devtool: "source-map"
}