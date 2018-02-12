import $ from "jquery";
import { getNextPage } from "./common";
import { registerEventHandlers } from "./common.ui";

const title = "LeanKit tasks data";
const id = "tasks";
const path = "export/tasks.json";
const cols = [
	{ id: "taskId", alias: "Task ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "containingCardId", alias: "Containing Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "externalCardId", alias: "External Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "taskTitle", alias: "Task Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "containingCardTitle", alias: "Containing Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "taskType", alias: "Task Type", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "taskSize", alias: "Task Size", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
	{ id: "priority", alias: "Priority", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "customIcon", alias: "Custom Icon", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "isTaskBlocked", alias: "Is Task Blocked", columnRole: "dimension", dataType: tableau.dataTypeEnum.bool },
	{ id: "currentBlockedReason", alias: "Current Blocked Reason", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "taskExternalLinkName", alias: "Task External Link Name", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "taskExternalLinkUrl", alias: "Task External Link Url", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
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
	{ id: "currentTaskboardLaneId", alias: "Current Taskboard Lane ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentTaskboardLaneTitle", alias: "Current Taskboard Lane Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentTaskboardLaneType", alias: "Current Taskboard Lane Type", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }
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
