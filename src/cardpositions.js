import startConnector from "./connector";

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

startConnector( tableau, { title, id, path, cols } );
