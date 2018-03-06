import $ from "jquery";
import { getNextPage } from "./common";
import { registerEventHandlers } from "./common.ui";

const title = "LeanKit user task assignments history data";
const id = "usertaskassignmentshistory";
const path = "export/usertaskassignments/history.json";
const cols = [
	{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedUserId", alias: "Assigned User ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedUserFullName", alias: "Assigned User Full Name", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedUserEmailAddress", alias: "Assigned User Email Address", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedByUserId", alias: "Assigned By User ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedByUserFullName", alias: "Assigned By User Full Name", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedByUserEmailAddress", alias: "Assigned By User Email Address", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "unassignedByUserId", alias: "Unassigned By User ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "unassignedByUserFullName", alias: "Unassigned By User Full Name", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "unassignedByUserEmailAddress", alias: "Unassigned By User Email Address", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedToDate", alias: "Assigned To Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.date },
	{ id: "assignedFromDate", alias: "Assigned From Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.date },
	{ id: "cardTitle", alias: "Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardSize", alias: "Card Size", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
	{ id: "priority", alias: "Priority", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardTypeId", alias: "Card Type ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardTypeTitle", alias: "Card Type Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentBoardId", alias: "Current Board ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentBoardTitle", alias: "Current Board Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "totalDurationDays", alias: "Total Duration Days", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
	{ id: "totalDurationHours", alias: "Total Duration Hours", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
	{ id: "totalDurationMinusWeekendsDays", alias: "Total Duration Minus Weekends Days", columnRole: "measure", dataType: tableau.dataTypeEnum.int }
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
