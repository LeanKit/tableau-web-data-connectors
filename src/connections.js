import { startConnector } from "./common";

const title = "LeanKit card connection data";
const id = "connections";
const path = "export/connections.json";
const cols = [
	{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "parentCardId", alias: "Parent Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "connectionCreatedDate", alias: "Connection Created Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
	{ id: "connectionCreatedByUserId", alias: "Connection Created By User ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }
];

startConnector( tableau, { title, id, path, cols } );
