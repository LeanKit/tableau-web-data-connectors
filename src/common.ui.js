import $ from "jquery";
import { urlToAccountName, 	getToken, getBoards, normalizeBaseUrl } from "./common";

const apiError = err => {
	$( "#errorMsg" ).html( "Sorry, there was an error with your login credentials or token. Please verify and try again." ).show();
	$( "#auth" ).show();
	$( "#boards" ).hide();
	$( "#getBoards" ).removeClass( "is-loading" );
	tableau.log( `There was an api error ${ err }` );
};

const displayBoards = boards => {
	const html = [];
	html.push( "<option value=\"0\">All Boards</option>" );
	boards.forEach( board => {
		html.push( `<option value="${ board.boardId }">${ board.boardTitle }</option>` );
	} );
	$( "#boardList" ).empty().append( html.join( "" ) );
	$( "#auth" ).hide();
	$( "#boards" ).show();
};

const registerEventHandlers = () => {
	$( "#loginTab" ).click( () => {
		$( "#tokenTab" ).removeClass( "is-active" );
		$( "#loginTab" ).addClass( "is-active" );
		$( "#loginPanel" ).show();
		$( "#tokenPanel" ).hide();
	} );

	$( "#tokenTab" ).click( () => {
		$( "#loginTab" ).removeClass( "is-active" );
		$( "#tokenTab" ).addClass( "is-active" );
		$( "#loginPanel" ).hide();
		$( "#tokenPanel" ).show();
	} );

	$( "#backButton" ).click( () => {
		$( "#errorMsg" ).hide();
		$( "#boards" ).hide();
		$( "#getBoards" ).removeClass( "is-loading" );
		$( "#auth" ).show();
	} );

	$( "#getBoards" ).click( () => {
		$( "#errorMsg" ).hide();
		$( "#getBoards" ).addClass( "is-loading" );
		const baseUrl = normalizeBaseUrl( $( "#account" ).val().trim() );
		$( "#account" ).val( baseUrl );
		const account = urlToAccountName( baseUrl );
		// todo: validate baseUrl and account
		if ( $( "#loginTab" ).hasClass( "is-active" ) ) {
			const username = $( "#username" ).val().trim();
			const password = $( "#password" ).val().trim();
			// todo: validate username/password
			getToken( { baseUrl, account, username, password } )
				.then( token => {
					$( "#token" ).val( token );
					return getBoards( { baseUrl, token } );
				} )
				.then( displayBoards )
				.catch( apiError );
		} else {
			const token = $( "#token" ).val().trim();
			getBoards( { baseUrl, token } ).then( displayBoards ).catch( apiError );
		}
	} );

	$( "#submitButton" ).click( () => {
		const baseUrl = $( "#account" ).val();
		const token = $( "#token" ).val();
		const boardIds = $( "#boardList" ).val();
		if ( !boardIds || boardIds.length === 0 ) {
			// todo: validate boards selected
		}
		tableau.connectionData = JSON.stringify( { baseUrl, token, boardIds } );
		tableau.connectionName = "LeanKit comment data"; // This will be the data source name in Tableau
		tableau.submit(); // This sends the connector object to Tableau
	} );
};

module.exports = {
	apiError,
	displayBoards,
	registerEventHandlers
};
