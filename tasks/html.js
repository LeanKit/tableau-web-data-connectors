/* eslint-disable no-console */
const handlebars = require( "handlebars" );
const path = require( "path" );
const fs = require( "fs-extra" );

const connectors = [ {
	title: "Cards",
	bundle: "cards"
}, {
	title: "Comments",
	bundle: "comments"
}, {
	title: "Tasks",
	bundle: "tasks"
}, {
	title: "Tags",
	bundle: "tags"
} ];

const rootDir = path.resolve( __dirname, ".." );

fs.readFile( path.join( rootDir, "src", "base.hbs" ), "utf-8" ).then( baseHtml => {
	const template = handlebars.compile( baseHtml );
	const htmlTasks = connectors.map( connector => {
		const html = template( connector );
		return fs.writeFile( path.join( rootDir, `${ connector.bundle }.html` ), html ).then( () => {
			console.log( `created ${ connector.bundle }.html` );
		} );
	} );
	Promise.all( htmlTasks ).then( () => {
		console.log( "finished html task" );
	} );
} );

