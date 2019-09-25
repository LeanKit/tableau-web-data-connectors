import startConnector from "./connector";

const title = "LeanKit card blocked history data";
const id = "blockedhistory";
const path = "export/cards/blockedhistory.json";
const cols = [
	{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardTitle", alias: "Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardSize", alias: "Card Size", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
	{ id: "priority", alias: "Priority", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardTypeId", alias: "Card Type ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardTypeTitle", alias: "Card Type Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentBoardId", alias: "Current Board ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "currentBoardTitle", alias: "Current Board Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "blockedStartDate", alias: "Blocked Start Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.date },
	{ id: "blockedEndDate", alias: "Blocked End Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.date },
	{ id: "blockedByUserId", alias: "Blocked By User ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "blockedByUserFullName", alias: "Blocked By User Full Name", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "blockedByUserEmailAddress", alias: "Blocked By User Email Address", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "unblockedByUserId", alias: "Unblocked By User ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "unblockedByUserFullName", alias: "Unblocked By User Full Name", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "unblockedByUserEmailAddress", alias: "Unblocked By User Email Address", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "totalDurationDays", alias: "Total Duration Days", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
	{ id: "totalDurationHours", alias: "Total Duration Hours", columnRole: "measure", dataType: tableau.dataTypeEnum.int },
	{ id: "totalDurationMinusWeekendsDays", alias: "Total Duration Minus Weekends Days", columnRole: "measure", dataType: tableau.dataTypeEnum.int }
];

startConnector( tableau, { title, id, path, cols } );
