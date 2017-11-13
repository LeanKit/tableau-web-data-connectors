( function() {
	const apiError = err => {
		$( "#errorMsg" ).html( "Sorry, there was an error with your login credentials or token. Please verify and try again." ).show();
		$( "#auth" ).show();
		$( "#boards" ).hide();
		$( "#getBoards" ).removeClass( "is-loading" );
		tableau.log( `There was an api error ${ err }` );
	};

	const createConnector = () => {
		// Create the connector object
		const connector = tableau.makeConnector();

		// Define the schema
		connector.getSchema = schemaCallback => {
			const cols = [
				{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.int },
				{ id: "parentCardId", alias: "Parent Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.int },
				{ id: "externalCardId", alias: "External Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "cardTitle", alias: "Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "parentCardTitle", alias: "Parent Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "cardType", alias: "Card Type", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "cardSize", alias: "Card Size", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
				{ id: "priority", alias: "Priority", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "customIcon", alias: "Custom Icon", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "isCardBlocked", alias: "Is Card Blocked", columnRole: "dimension", dataType: tableau.dataTypeEnum.bool },
				{ id: "currentBlockedReason", alias: "Current Blocked Reason", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "cardExternalLinkName", alias: "Card External Link Name", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "cardExternalLinkUrl", alias: "Card External Link Url", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "creationDate", alias: "Creation Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
				{ id: "plannedStartDate", alias: "Planned Start Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.date },
				{ id: "actualStartDate", alias: "Actual Start Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
				{ id: "plannedFinishDate", alias: "Planned Finish Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.date },
				{ id: "actualFinishDate", alias: "Actual Finish Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
				{ id: "attachmentsCount", alias: "Attachments Count", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
				{ id: "lastAttachmentDate", alias: "Last Attachment Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
				{ id: "commentsCount", alias: "Comments Count", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
				{ id: "lastCommentDate", alias: "Last Comment Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
				{ id: "lastActivityDate", alias: "Last Activity Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
				{ id: "archivedDate", alias: "Archived Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
				{ id: "lastMovedDate", alias: "Last Moved Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
				{ id: "currentLaneId", alias: "Current Lane ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.int },
				{ id: "currentLaneTitle", alias: "Current Lane Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "parentLaneTitle", alias: "Parent Lane Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.int },
				{ id: "currentLaneType", alias: "Current Lane Type", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
				{ id: "currentBoardId", alias: "Current Board ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.int },
				{ id: "currentBoardTitle", alias: "Current Board Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }
			];

			const tableInfo = {
				id: "cards",
				alias: "LeanKit card data",
				columns: cols
			};

			schemaCallback( [ tableInfo ] );
		};

		// Download the data
		connector.getData = ( table, doneCallback ) => {
			const path = "export/cards.json";
			const { baseUrl, token, boardIds } = JSON.parse( tableau.connectionData );
			const limit = 500;

			const getNextPage = offset => {
				const url = `${ baseUrl }${ path }?token=${ token }&limit=${ limit }&offset=${ offset }&boardId=${ boardIds.join( "," ) }`;
				return axios.get( url ).then( res => {
					if ( res.data && res.data.length > 0 ) {
						table.appendRows( res.data );
						offset += limit;
						if ( res.data.length < limit ) {
							return doneCallback();
						}
						return getNextPage( offset );
					} else if ( offset === 0 ) {
						return tableau.abortWithError( "No data was returned." );
					}
					return doneCallback();
				} ).catch( err => {
					tableau.log( `There was an error fetching data ${ err }` );
					tableau.abortWithError( "Sorry, there was an error retrieving data." );
				} );
			};

			getNextPage( 0 );
		};

		return connector;
	};

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

	// Create event listeners for when the user submits the form
	$( document ).ready( function() {
		const connector = createConnector();
		tableau.registerConnector( connector );

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

		$( "#backButton" ).click( () => {
			$( "#errorMsg" ).hide();
			$( "#boards" ).hide();
			$( "#getBoards" ).removeClass( "is-loading" );
			$( "#auth" ).show();
		} );

		$( "#submitButton" ).click( () => {
			const baseUrl = $( "#account" ).val();
			const token = $( "#token" ).val();
			const boardIds = $( "#boardList" ).val();
			if ( !boardIds || boardIds.length === 0 ) {
				// todo: validate boards selected
			}
			tableau.connectionData = JSON.stringify( { baseUrl, token, boardIds } );
			tableau.connectionName = "LeanKit card data"; // This will be the data source name in Tableau
			tableau.submit(); // This sends the connector object to Tableau
		} );
	} );
}() );
