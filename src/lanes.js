import { startConnector } from "./common";

const title = "LeanKit lane data";
const id = "lanes";
const path = "export/lanes.json";
const cols = [
	{ id: "laneId", alias: "Lane ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "laneTitle", alias: "Lane Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "fullLaneTitle", alias: "Full Lane Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "boardId", alias: "Board ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "boardTitle", alias: "Board Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "lanePolicy", alias: "Lane Policy", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "laneClass", alias: "Lane Class", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "laneOrientation", alias: "Lane Orientation", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "laneType", alias: "Lane Type", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "creationDate", alias: "Creation Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime },
	{ id: "wipLimit", alias: "WIP Limit", columnRole: "dimension", dataType: tableau.dataTypeEnum.int },
	{ id: "laneWidth", alias: "Lane Width", columnRole: "dimension", dataType: tableau.dataTypeEnum.int },
	{ id: "lanePosition", alias: "Lane Position", columnRole: "dimension", dataType: tableau.dataTypeEnum.int },
	{ id: "parentLaneId", alias: "Parent Lane ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string },
	{ id: "isCompletedLane", alias: "Is Completed Lane", columnRole: "dimension", dataType: tableau.dataTypeEnum.bool },
	{ id: "isDefaultDropLane", alias: "Is Default Drop Lane", columnRole: "dimension", dataType: tableau.dataTypeEnum.bool },
	{ id: "isTopLevelLane", alias: "Is Top Level Lane", columnRole: "dimension", dataType: tableau.dataTypeEnum.bool },
	{ id: "canHoldCards", alias: "Can Hold Cards", columnRole: "dimension", dataType: tableau.dataTypeEnum.bool },
	{ id: "hasChildLanes", alias: "Has Child Lanes", columnRole: "dimension", dataType: tableau.dataTypeEnum.bool },
	{ id: "childLaneCount", alias: "Child Lane Count", columnRole: "measure", dataType: tableau.dataTypeEnum.int }
];

startConnector( tableau, { title, id, path, cols } );
