import { startConnector } from "./common";

const title = "LeanKit current user task assignments data";
const id = "currentusertaskassignments";
const path = "export/usertaskassignments/current.json";
const cols = [
	{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedUserId", alias: "Assigned User ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedUserFullName", alias: "Assigned User Full Name", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedUserEmailAddress", alias: "Assigned User Email Address", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedByUserId", alias: "Assigned By User ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedByUserFullName", alias: "Assigned By User Full Name", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedByUserEmailAddress", alias: "Assigned By User Email Address", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "assignedToDate", alias: "Assigned To Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.date },
	{ id: "cardTitle", alias: "Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardSize", alias: "Card Size", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
	{ id: "priority", alias: "Priority", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardTypeId", alias: "Card Type ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardTypeTitle", alias: "Card Type Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentBoardId", alias: "Current Board ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentBoardTitle", alias: "Current Board Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }
];

startConnector( tableau, { title, id, path, cols } );
