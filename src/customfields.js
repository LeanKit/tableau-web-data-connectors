import $ from "jquery";
import { getNextPage } from "./common";
import { registerEventHandlers } from "./common.ui";

const title = "LeanKit custom fields data";
const id = "customfields";
const path = "export/customfields.json";
const cols = [
	{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentBoardId", alias: "Board ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "externalCardId", alias: "External Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "customFieldId", alias: "Custom Field ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "label", alias: "Label", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "type", alias: "Type", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "customFieldValue", alias: "Custom Field Value", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }
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
