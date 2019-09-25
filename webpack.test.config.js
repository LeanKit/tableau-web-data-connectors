const nodeExternals = require( "webpack-node-externals" );
const path = require( "path" );
const glob = require( "glob" );

module.exports = {
	mode: "development",
	target: "node", // webpack should compile node compatible code
	stats: "errors-only",
	externals: [ nodeExternals() ], // in order to ignore all modules in node_modules folder
	entry: {
		spec: [ ...glob.sync( "./src/**/*.spec.js" ) ]
	},
	output: {
		path: path.resolve( __dirname, "_spec" )
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.join( __dirname, "src" ),
				use: {
					loader: "babel-loader",
					options: {
						plugins: [
							"babel-plugin-add-module-exports",
							"babel-plugin-istanbul"
						]
					}
				}
			}, {
				test: /\.(css|scss)$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
			}
		]
	}
};
