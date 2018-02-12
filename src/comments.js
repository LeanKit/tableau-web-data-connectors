import $ from "jquery";
import { getNextPage } from "./common";
import { registerEventHandlers } from "./common.ui";

const title = "LeanKit comment data";
const id = "comments";
const path = "export/comments.json";
const cols = [
	{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "commentText", alias: "Comment Text", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "commentDate", alias: "Comment Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
	{ id: "commentPostedByUserId", alias: "Comment Posted By User ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }
];

( function() {
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
}() );
