import { startConnector } from "./common";

const title = "LeanKit comment data";
const id = "comments";
const path = "export/comments.json";
const cols = [
	{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "commentText", alias: "Comment Text", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "commentDate", alias: "Comment Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
	{ id: "commentPostedByUserId", alias: "Comment Posted By User ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }
];

startConnector( tableau, { title, id, path, cols } );
