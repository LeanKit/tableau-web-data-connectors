import axios from "axios";

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

module.exports = {
	urlToAccountName,
	getToken,
	getBoards,
	normalizeBaseUrl,
	getNextPage
};
