const nodeExternals = require( "webpack-node-externals" );
const path = require( "path" );

module.exports = {
	mode: "development",
	target: "node", // webpack should compile node compatible code
	externals: [ nodeExternals() ], // in order to ignore all modules in node_modules folder
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.join( __dirname, "src" ),
				use: {
					loader: "babel-loader",
					options: {
						presets: [ "env" ]
					}
				}
			}, {
				test: /\.css$/,
				use: [
					"style-loader",
					"css-loader"
				]
			}
		]
	}
};
