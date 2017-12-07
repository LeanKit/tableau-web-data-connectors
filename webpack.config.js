const path = require( "path" );

module.exports = {
	entry: {
		cards: "./src/cards.js",
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
		} ]
	}
};
