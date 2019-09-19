import { startConnector } from "./common";

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

startConnector( tableau, { title, id, path, cols } );
