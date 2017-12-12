// import "bulma/bulma.sass";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
import "./styles.css";
import $ from "jquery";
import { urlToAccountName, 	getToken, getBoards, normalizeBaseUrl } from "./common";

const apiError = err => {
	$( "#errorMsg" ).html( "Sorry, there was an error with your login credentials or token. Please verify and try again." ).show();
	$( "#auth" ).show();
	$( "#boards" ).hide();
	$( "#getBoards" ).html( "Next &gt;" ).prop( "disabled", false );
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

const registerEventHandlers = connectionName => {
	$( "#loginTab" ).click( () => {
		$( "#tokenTab" ).removeClass( "active" ).removeClass( "btn-secondary" ).addClass( "btn-light" );
		$( "#loginTab" ).addClass( "active" ).removeClass( "btn-light" ).addClass( "btn-secondary" );
		$( "#loginPanel" ).show();
		$( "#tokenPanel" ).hide();
	} );

	$( "#tokenTab" ).click( () => {
		$( "#loginTab" ).removeClass( "active" ).removeClass( "btn-secondary" ).addClass( "btn-light" );
		$( "#tokenTab" ).addClass( "active" ).removeClass( "btn-light" ).addClass( "btn-secondary" );
		$( "#loginPanel" ).hide();
		$( "#tokenPanel" ).show();
	} );

	$( "#backButton" ).click( () => {
		$( "#errorMsg" ).hide();
		$( "#boards" ).hide();
		$( "#getBoards" ).html( "Next &gt;" ).prop( "disabled", false );
		$( "#auth" ).show();
	} );

	$( "#getBoards" ).click( () => {
		$( "#errorMsg" ).hide();
		$( "#getBoards" ).html( "<i class=\"fa fa-spinner fa-spin\"></i> Getting boards..." ).prop( "disabled", true );
		const baseUrl = normalizeBaseUrl( $( "#account" ).val().trim() );
		$( "#account" ).val( baseUrl );
		const account = urlToAccountName( baseUrl );
		// todo: validate baseUrl and account
		if ( $( "#loginTab" ).hasClass( "active" ) ) {
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
		tableau.connectionName = connectionName; // This will be the data source name in Tableau
		tableau.submit(); // This sends the connector object to Tableau
	} );
};

module.exports = {
	apiError,
	displayBoards,
	registerEventHandlers
};
