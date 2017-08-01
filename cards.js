(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [
            { id : "cardId", alias : "Card ID", columnRole : "dimension", dataType : tableau.dataTypeEnum.int },
            { id : "parentCardId", alias : "Parent Card ID", columnRole : "dimension", dataType : tableau.dataTypeEnum.int },
            { id : "externalCardId", alias : "External Card ID", columnRole : "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "cardTitle", alias : "Card Title", columnRole : "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "parentCardTitle", alias : "Parent Card Title", columnRole : "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "cardType", alias : "Card Type", columnRole : "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "cardSize", alias : "Card Size", columnRole: "measure", dataType : tableau.dataTypeEnum.int },
            { id : "priority", alias : "Priority", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "customIcon", alias : "Custom Icon", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "isCardBlocked", alias : "Is Card Blocked", columnRole: "dimension", dataType : tableau.dataTypeEnum.bool },
            { id : "currentBlockedReason", alias : "Current Blocked Reason", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "cardExternalLinkName", alias : "Card External Link Name", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "cardExternalLinkUrl", alias : "Card External Link Url", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "creationDate", alias : "Creation Date", columnRole: "dimension", dataType : tableau.dataTypeEnum.datetime },
            { id : "plannedStartDate", alias : "Planned Start Date", columnRole: "dimension", dataType : tableau.dataTypeEnum.date },
            { id : "actualStartDate", alias : "Actual Start Date", columnRole: "dimension", dataType : tableau.dataTypeEnum.datetime },
            { id : "plannedFinishDate", alias : "Planned Finish Date", columnRole: "dimension", dataType : tableau.dataTypeEnum.date },
            { id : "actualFinishDate", alias : "Actual Finish Date", columnRole: "dimension", dataType : tableau.dataTypeEnum.datetime },
            { id : "attachmentsCount", alias : "Attachments Count", columnRole: "measure", dataType : tableau.dataTypeEnum.int },
            { id : "lastAttachmentDate", alias : "Last Attachment Date", columnRole: "dimension", dataType : tableau.dataTypeEnum.datetime },
            { id : "commentsCount", alias : "Comments Count", columnRole: "measure", dataType : tableau.dataTypeEnum.int },
            { id : "lastCommentDate", alias : "Last Comment Date", columnRole: "dimension", dataType : tableau.dataTypeEnum.datetime },
            { id : "lastActivityDate", alias : "Last Activity Date", columnRole: "dimension", dataType : tableau.dataTypeEnum.datetime },
            { id : "archivedDate", alias : "Archived Date", columnRole: "dimension", dataType : tableau.dataTypeEnum.datetime },
            { id : "lastMovedDate", alias : "Last Moved Date", columnRole: "dimension", dataType : tableau.dataTypeEnum.datetime },
            { id : "currentLaneId", alias : "Current Lane ID", columnRole: "dimension", dataType : tableau.dataTypeEnum.int },
            { id : "currentLaneTitle", alias : "Current Lane Title", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "parentLaneTitle", alias : "Parent Lane Title", columnRole: "dimension", dataType : tableau.dataTypeEnum.int },
            { id : "currentLaneType", alias : "Current Lane Type", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
            { id : "currentBoardId", alias : "Current Board ID", columnRole: "dimension", dataType : tableau.dataTypeEnum.int },
            { id : "currentBoardTitle", alias : "Current Board Title", columnRole : "dimension", dataType : tableau.dataTypeEnum.string }
        ];

        var tableInfo = {
            id : "cards",
            alias : "LeanKit card data",
            columns : cols
        };

        schemaCallback([tableInfo]);
    };

    myConnector.getData = function (table, doneCallback) {
        var domain, token;
        var data = tableau.connectionData.split("|");
        domain = data[0];
        token = data[1];
        var url = 'https://' + encodeURIComponent(domain) + '/io/reporting/export/cards.json?token=' + encodeURIComponent(token);
        tableau.log(url);
        $.getJSON(url, function(resp) {
            var cards = resp,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = cards.length; i < len; i++) {
                tableData.push({
                    "cardId": cards[i].cardId,
                    "parentCardId": cards[i].parentCardId,
                    "externalCardId": cards[i].externalCardId,
                    "cardTitle": cards[i].cardTitle,
                    "parentCardTitle": cards[i].parentCardTitle,
                    "cardType": cards[i].cardType,
                    "cardSize": cards[i].cardSize,
                    "priority": cards[i].priority,
                    "customIcon": cards[i].customIcon,
                    "isCardBlocked": cards[i].isCardBlocked,
                    "currentBlockedReason": cards[i].currentBlockedReason,
                    "cardExternalLinkName": cards[i].cardExternalLinkName,
                    "cardExternalLinkUrl": cards[i].cardExternalLinkUrl,
                    "creationDate": cards[i].creationDate,
                    "plannedStartDate": cards[i].plannedStartDate,
                    "actualStartDate": cards[i].actualStartDate,
                    "plannedFinishDate": cards[i].plannedFinishDate,
                    "actualFinishDate": cards[i].actualFinishDate,
                    "attachmentsCount": cards[i].attachmentsCount,
                    "lastAttachmentDate": cards[i].lastAttachmentDate,
                    "commentsCount": cards[i].commentsCount,
                    "lastCommentDate": cards[i].lastCommentDate,
                    "lastActivityDate": cards[i].lastActivityDate,
                    "archivedDate": cards[i].archivedDate,
                    "lastMovedDate": cards[i].lastMovedDate,
                    "currentLaneId": cards[i].currentLaneId,
                    "currentLaneTitle": cards[i].currentLaneTitle,
                    "parentLaneTitle": cards[i].parentLaneTitle,
                    "currentLaneType": cards[i].currentLaneType,
                    "currentBoardId": cards[i].currentBoardId,
                    "currentBoardTitle": cards[i].currentBoardTitle
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionData = $('#formGroupLeanKitUrl').val().trim() + '|' + $('#formGroupReportingApiToken').val().trim()
        tableau.connectionName = "LeanKit Cards";
        tableau.submit();
    });
});
})();