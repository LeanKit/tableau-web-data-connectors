"use strict";

(function () {
	var apiError = function apiError(err) {
		$("#errorMsg").html("Sorry, there was an error with your login credentials or token. Please verify and try again.").show();
		$("#auth").show();
		$("#boards").hide();
		$("#getBoards").removeClass("is-loading");
		tableau.log("There was an api error " + err);
	};

	var createConnector = function createConnector() {
		// Create the connector object
		var connector = tableau.makeConnector();

		// Define the schema
		connector.getSchema = function (schemaCallback) {
			var cols = [{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.int }, { id: "parentCardId", alias: "Parent Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.int }, { id: "externalCardId", alias: "External Card ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "cardTitle", alias: "Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "parentCardTitle", alias: "Parent Card Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "cardType", alias: "Card Type", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "cardSize", alias: "Card Size", columnRole: "measure", dataType: tableau.dataTypeEnum.int }, { id: "priority", alias: "Priority", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "customIcon", alias: "Custom Icon", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "isCardBlocked", alias: "Is Card Blocked", columnRole: "dimension", dataType: tableau.dataTypeEnum.bool }, { id: "currentBlockedReason", alias: "Current Blocked Reason", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "cardExternalLinkName", alias: "Card External Link Name", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "cardExternalLinkUrl", alias: "Card External Link Url", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "creationDate", alias: "Creation Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime }, { id: "plannedStartDate", alias: "Planned Start Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.date }, { id: "actualStartDate", alias: "Actual Start Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime }, { id: "plannedFinishDate", alias: "Planned Finish Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.date }, { id: "actualFinishDate", alias: "Actual Finish Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime }, { id: "attachmentsCount", alias: "Attachments Count", columnRole: "measure", dataType: tableau.dataTypeEnum.int }, { id: "lastAttachmentDate", alias: "Last Attachment Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime }, { id: "commentsCount", alias: "Comments Count", columnRole: "measure", dataType: tableau.dataTypeEnum.int }, { id: "lastCommentDate", alias: "Last Comment Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime }, { id: "lastActivityDate", alias: "Last Activity Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime }, { id: "archivedDate", alias: "Archived Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime }, { id: "lastMovedDate", alias: "Last Moved Date", columnRole: "dimension", dataType: tableau.dataTypeEnum.datetime }, { id: "currentLaneId", alias: "Current Lane ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.int }, { id: "currentLaneTitle", alias: "Current Lane Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "parentLaneTitle", alias: "Parent Lane Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.int }, { id: "currentLaneType", alias: "Current Lane Type", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }, { id: "currentBoardId", alias: "Current Board ID", columnRole: "dimension", dataType: tableau.dataTypeEnum.int }, { id: "currentBoardTitle", alias: "Current Board Title", columnRole: "dimension", dataType: tableau.dataTypeEnum.string }];

			var tableInfo = {
				id: "cards",
				alias: "LeanKit card data",
				columns: cols
			};

			schemaCallback([tableInfo]);
		};

		// Download the data
		connector.getData = function (table, doneCallback) {
			var path = "export/cards.json";

			var _JSON$parse = JSON.parse(tableau.connectionData),
			    baseUrl = _JSON$parse.baseUrl,
			    token = _JSON$parse.token,
			    boardIds = _JSON$parse.boardIds;

			var limit = 500;

			var getNextPage = function getNextPage(offset) {
				var url = "" + baseUrl + path + "?token=" + token + "&limit=" + limit + "&offset=" + offset + "&boardId=" + boardIds.join(",");
				return axios.get(url).then(function (res) {
					if (res.data && res.data.length > 0) {
						table.appendRows(res.data);
						offset += limit;
						if (res.data.length < limit) {
							return doneCallback();
						}
						return getNextPage(offset);
					} else if (offset === 0) {
						return tableau.abortWithError("No data was returned.");
					}
					return doneCallback();
				}).catch(function (err) {
					tableau.log("There was an error fetching data " + err);
					tableau.abortWithError("Sorry, there was an error retrieving data.");
				});
			};

			getNextPage(0);
		};

		return connector;
	};

	var urlToAccountName = function urlToAccountName(url) {
		if (!url) {
			return null;
		}
		if (url.startsWith("http://localhost")) {
			return "d06";
		}
		if (url.startsWith("http")) {
			return url.replace(/https?:[/]*/, "").replace(/\..*/, "");
		}
		return null;
	};

	var normalizeBaseUrl = function normalizeBaseUrl(url) {
		if (url.startsWith("http://localhost")) {
			return url.endsWith("/") ? url : url + "/";
		}
		var m = url.match(/https?:[/]*[^/]*/);
		if (m) {
			return m[0] + "/io/reporting/";
		} else if (url) {
			return "https://" + url.replace(/[/].*/, "") + "/io/reporting/";
		}
		return null;
	};

	var getBoards = function getBoards(_ref) {
		var baseUrl = _ref.baseUrl,
		    token = _ref.token;

		var url = baseUrl + "export/boards.json?token=" + token;
		return axios.get(url).then(function (res) {
			return res.data;
		});
	};

	var getToken = function getToken(_ref2) {
		var baseUrl = _ref2.baseUrl,
		    account = _ref2.account,
		    username = _ref2.username,
		    password = _ref2.password;

		return axios.post(baseUrl + "auth", {
			email: username,
			password: password,
			accountName: account
		}).then(function (res) {
			return res.data.token;
		});
	};

	var displayBoards = function displayBoards(boards) {
		var html = [];
		html.push("<option value=\"0\">All Boards</option>");
		boards.forEach(function (board) {
			html.push("<option value=\"" + board.boardId + "\">" + board.boardTitle + "</option>");
		});
		$("#boardList").empty().append(html.join(""));
		$("#auth").hide();
		$("#boards").show();
	};

	// Create event listeners for when the user submits the form
	$(document).ready(function () {
		var connector = createConnector();
		tableau.registerConnector(connector);

		$("#loginTab").click(function () {
			$("#tokenTab").removeClass("is-active");
			$("#loginTab").addClass("is-active");
			$("#loginPanel").show();
			$("#tokenPanel").hide();
		});
		$("#tokenTab").click(function () {
			$("#loginTab").removeClass("is-active");
			$("#tokenTab").addClass("is-active");
			$("#loginPanel").hide();
			$("#tokenPanel").show();
		});

		$("#getBoards").click(function () {
			$("#errorMsg").hide();
			$("#getBoards").addClass("is-loading");
			var baseUrl = normalizeBaseUrl($("#account").val().trim());
			$("#account").val(baseUrl);
			var account = urlToAccountName(baseUrl);
			// todo: validate baseUrl and account
			if ($("#loginTab").hasClass("is-active")) {
				var username = $("#username").val().trim();
				var password = $("#password").val().trim();
				// todo: validate username/password
				getToken({ baseUrl: baseUrl, account: account, username: username, password: password }).then(function (token) {
					$("#token").val(token);
					return getBoards({ baseUrl: baseUrl, token: token });
				}).then(displayBoards).catch(apiError);
			} else {
				var token = $("#token").val().trim();
				getBoards({ baseUrl: baseUrl, token: token }).then(displayBoards).catch(apiError);
			}
		});

		$("#backButton").click(function () {
			$("#errorMsg").hide();
			$("#boards").hide();
			$("#getBoards").removeClass("is-loading");
			$("#auth").show();
		});

		$("#submitButton").click(function () {
			var baseUrl = $("#account").val();
			var token = $("#token").val();
			var boardIds = $("#boardList").val();
			if (!boardIds || boardIds.length === 0) {
				// todo: validate boards selected
			}
			tableau.connectionData = JSON.stringify({ baseUrl: baseUrl, token: token, boardIds: boardIds });
			tableau.connectionName = "LeanKit card data"; // This will be the data source name in Tableau
			tableau.submit(); // This sends the connector object to Tableau
		});
	});
})();