import axios from "axios";
import $ from "jquery";
import { registerEventHandlers } from "./common.ui";

const urlToAccountName = url => {
	if ( !url ) {
		return null;
	}

	if ( url.startsWith( "http" ) ) {
		return url.replace( /https?:[/]*/, "" ).replace( /\..*/, "" );
	}

	return null;
};

const normalizeBaseUrl = url => {
	if ( url.startsWith( "http://localhost" ) ) {
		return url.endsWith( "/" ) ? url : `${ url }/`;
	}
	const m = url.match( /https?:[/]*[^/]*/ );
	if ( m ) {
		return `${ m[ 0 ] }/io/reporting/`;
	} else if ( url ) {
		return `https://${ url.replace( /[/].*/, "" ) }/io/reporting/`;
	}
	return null;
};

const BOARD_LIMIT = 1000;
const getBoards = ( { baseUrl, token } ) => {
	const url = `${ baseUrl }export/boards.json`;

	return new Promise( ( res, rej ) => {
		const boards = [];
		const fetchBoards = ( offset = 0 ) => {
			axios.get( url, {
				params: {
					token,
					offset,
					limit: BOARD_LIMIT
				}
			} ).then( ( { data } ) => {
				boards.push( ...data );
				/* If the number of boards exactly matches our limit,
					   there is a good chance there are more pages of data */
				if ( data.length === BOARD_LIMIT ) {
					fetchBoards( offset + BOARD_LIMIT );
				} else {
					res( boards );
				}
			} ).catch( rej );
		};

		fetchBoards();
	} );
};

const getToken = ( { baseUrl, account, username, password } ) => {
	return axios.post( `${ baseUrl }auth`, {
		email: username,
		password,
		accountName: account
	} ).then( res => {
		return res.data.token;
	} );
};

const getNextPage = ( { tableau, offset, baseUrl, path, token, limit, boardIds, table, doneCallback } ) => {
	const url = `${ baseUrl }${ path }?token=${ token }&limit=${ limit }&offset=${ offset }&boardId=${ boardIds.join( "," ) }`;
	return axios.get( url ).then( res => {
		if ( res.data && res.data.length > 0 ) {
			table.appendRows( res.data );
			offset += limit;
			if ( res.data.length < limit ) {
				return doneCallback();
			}
			return getNextPage( { tableau, offset, baseUrl, path, token, limit, boardIds, table, doneCallback } );
		} else if ( offset === 0 ) {
			return tableau.abortWithError( "No data was returned." );
		}
		return doneCallback();
	} ).catch( err => {
		tableau.log( `There was an error fetching data ${ err }` );
		tableau.abortWithError( "Sorry, there was an error retrieving data." );
	} );
};

const MS_TRUNCATE = 19;

const tableTransform = ( { tableauTable, cols } ) => {
	const dateTimeCols = cols.filter( c => c.dataType === tableau.dataTypeEnum.datetime ).map( c => c.id );

	return {
		appendRows( rows ) {
			rows.forEach( row => {
				dateTimeCols.forEach( colKey => {
					if ( row[ colKey ] ) {
						row[ colKey ] = `${ row[ colKey ].substr( 0, MS_TRUNCATE ) }Z`;
					}
				} );
			} );
			tableauTable.appendRows( rows );
		}
	};
};

function startConnector( tableau, { title, id, path, cols } ) {
	const createConnector = () => {
		// Create the connector object
		const connector = tableau.makeConnector();

		// Define the schema
		connector.getSchema = schemaCallback => {
			const tableInfo = {
				id,
				alias: title,
				columns: cols
			};

			schemaCallback( [ tableInfo ] );
		};

		// Download the data
		connector.getData = ( table, doneCallback ) => {
			const { baseUrl, token, boardIds } = JSON.parse( tableau.connectionData );
			const limit = 500;

			getNextPage( { tableau, offset: 0, baseUrl, path, token, limit, boardIds, table, doneCallback } );
		};

		return connector;
	};

	// Create event listeners for when the user submits the form
	$( document ).ready( function() {
		const connector = createConnector();
		tableau.registerConnector( connector );
		registerEventHandlers( title );
	} );
}

module.exports = {
	urlToAccountName,
	getToken,
	getBoards,
	normalizeBaseUrl,
	getNextPage,
	tableTransform,
	startConnector
};
