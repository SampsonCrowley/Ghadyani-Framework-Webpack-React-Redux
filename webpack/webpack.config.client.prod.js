const HappyPack = require('happypack')
const webpack = require('webpack')

// Configs
const dir = require(`${global.baseDir}/global-dirs`)
const config = require(`${dir.includes}config-settings`)
const paths = require(`${dir.includes}paths`)
const webpackDefaultConfig = require(`${dir.webpack}webpack.config.default`)

const threadPool = HappyPack.ThreadPool({ size: 2 })

const webpackConfig = {
	entry: { main: `./${paths.code.src}client` },
	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[id].bundle.js',
		path: './web/',
		pathinfo: false,
		publicPath: '/',
	},
	plugins: [
		new webpack.ProgressPlugin((percentage, msg) => {
			console.info(Math.round(percentage * 100), `dev ${msg}`)
		}),
		new webpack.NoErrorsPlugin(),
		new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
		new webpack.WatchIgnorePlugin([
			'./conf/',
			'./includes/',
			'./node_modules/',
			'./services/',
			'./webpack/',
		]),
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(config.getEnv()) }),
		new HappyPack({
			id: 'jsx', threadPool, loaders: [
				'babel-loader',
			]
		}),
		new HappyPack({
			id: 'css', threadPool, loaders: [
				'isomorphic-style-loader',
				'css-loader',
				'postcss-loader',
			]
		}),
		new HappyPack({
			id: 'styl', threadPool, loaders: [
				'isomorphic-style-loader',
				'css-loader',
				'postcss-loader',
				'stylus-loader?linenos=false&compress=true',
			]
		}),
		new webpack.optimize.CommonsChunkPlugin({ async: true }),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false },
			mangle: { except: ['$super', '$', 'exports', 'require'] },
			output: {
				comments: false,
				screw_ie8: true,
			},
			sourceMap: true,
		}),
	],
}

module.exports = Object.assign({},
	webpackDefaultConfig.getProd(),
	webpackConfig
)
