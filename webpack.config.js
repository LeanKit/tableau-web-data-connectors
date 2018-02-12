const path = require( "path" );
const webpack = require( "webpack" );

module.exports = {
	entry: {
		cards: "./src/cards.js",
		tasks: "./src/tasks.js",
		tags: "./src/tags.js",
		comments: "./src/comments.js"
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve( __dirname, "dist" )
	},
	module: {
		rules: [ {
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader",
				options: {
					presets: [ "env" ]
				}
			}
		}, {
			test: /\.(css|sass|scss)$/,
			use: [
				"style-loader",
				"css-loader",
				"sass-loader"
			]
		}, {
			test: /\.(png|woff|woff2|eot|ttf|svg)$/,
			loader: "url-loader?limit=100000"
		} ]
	},
	plugins: [
		new webpack.ProvidePlugin( {
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
			Popper: [ "popper.js", "default" ]
		} )
	]
};
