import $ from "jquery";
import { getNextPage, tableTransform } from "./common";
import { registerEventHandlers } from "./common.ui";

const title = "LeanKit card data";
const id = "cards";
const path = "export/cards.json";
const cols = [
	{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "parentCardId", alias: "Parent Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "externalCardId", alias: "External Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardTitle", alias: "Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "parentCardTitle", alias: "Parent Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardTypeId", alias: "Card Type ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardType", alias: "Card Type", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardSize", alias: "Card Size", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
	{ id: "priority", alias: "Priority", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "customIconId", alias: "Custom Icon ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
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
	{ id: "currentLaneId", alias: "Current Lane ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentLaneTitle", alias: "Current Lane Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "parentLaneId", alias: "Parent Lane ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "parentLaneTitle", alias: "Parent Lane Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentLaneClass", alias: "Current Lane Class", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentLaneType", alias: "Current Lane Type", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentBoardId", alias: "Current Board ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentBoardTitle", alias: "Current Board Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }
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
