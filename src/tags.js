import startConnector from "./connector";

const title = "LeanKit tags data";
const id = "tags";
const path = "export/tags.json";
const cols = [
	{ id: "boardId", alias: "Board ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "tag", alias: "Tag", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }
];

startConnector( tableau, { title, id, path, cols } );
