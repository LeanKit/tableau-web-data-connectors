import $ from "jquery";
import { getNextPage, tableTransform } from "./common";
import { registerEventHandlers } from "./common.ui";

const title = "LeanKit card position data";
const id = "cardpositions";
const path = "export/cardpositions.json";
const cols = [
	{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "externalCardId", alias: "External Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardTitle", alias: "Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "laneEntryDate", alias: "Lane Entry Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
	{ id: "laneExitDate", alias: "Lane Exit Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
	{ id: "laneId", alias: "Lane ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "laneTitle", alias: "Lane Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "boardId", alias: "Board ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "boardTitle", alias: "Board Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }
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
		connector.getData = ( tableauTable, doneCallback ) => {
			const { baseUrl, token, boardIds } = JSON.parse( tableau.connectionData );
			const limit = 500;

			const table = tableTransform( { tableauTable, cols } );

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
