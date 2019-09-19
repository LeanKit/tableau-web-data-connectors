const path = require( "path" );
const webpack = require( "webpack" );

module.exports = {
	mode: "production",
	entry: {
		cards: [ "@babel/polyfill", "./src/cards.js" ],
		tasks: [ "@babel/polyfill", "./src/tasks.js" ],
		tags: [ "@babel/polyfill", "./src/tags.js" ],
		comments: [ "@babel/polyfill", "./src/comments.js" ],
		currentuserassignments: [ "@babel/polyfill", "./src/currentuserassignments.js" ],
		currentusertaskassignments: [ "@babel/polyfill", "./src/currentusertaskassignments.js" ],
		customfields: [ "@babel/polyfill", "./src/customfields.js" ],
		userassignmentshistory: [ "@babel/polyfill", "./src/userassignmentshistory.js" ],
		usertaskassignmentshistory: [ "@babel/polyfill", "./src/usertaskassignmentshistory.js" ],
		cardpositions: [ "@babel/polyfill", "./src/cardpositions.js" ],
		blockedhistory: [ "@babel/polyfill", "./src/blockedhistory.js" ],
		lanes: [ "@babel/polyfill", "./src/lanes.js" ],
		connections: [ "@babel/polyfill", "./src/connections.js" ]
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
				loader: "babel-loader"
			}
		}, {
			test: /\.(css|sass|scss)$/,
			use: [
				"style-loader",
				"css-loader",
				"sass-loader"
			]
		}, {
			test: /\.png$/,
			loader: "url-loader?limit=100000"
		} ]
	}
};
