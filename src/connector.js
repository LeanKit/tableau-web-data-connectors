import $ from "jquery-slim";

import { getNextPage, tableTransform } from "./common";
import { registerEventHandlers } from "./common.ui";

export default function startConnector( tableau, { title, id, path, cols } ) {
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
}
