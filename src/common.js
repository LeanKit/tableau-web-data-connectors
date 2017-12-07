import axios from "axios";

const urlToAccountName = url => {
	if ( !url ) {
		return null;
	}
	if ( url.startsWith( "http://localhost" ) ) {
		return "d06";
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

const getBoards = ( { baseUrl, token } ) => {
	const url = `${ baseUrl }export/boards.json?token=${ token }`;
	return axios.get( url ).then( res => {
		return res.data;
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
