import factory from "inject-loader!./connector";

describe( "connector", () => {
	let startConnector, jQuery, ready, tableau, common, commonUI;

	beforeEach( () => {
		global.document = "DOC";

		tableau = {
			registerConnector: sinon.stub(),
			makeConnector: sinon.stub().returns( { _connector: true } ),
			connectionData: JSON.stringify( {
				baseUrl: "URL",
				token: "TOKEN",
				boardIds: 0
			} )
		};

		common = {
			getNextPage: sinon.stub(),
			tableTransform: sinon.stub().returns( "TRANSFORMED" )
		};

		commonUI = {
			registerEventHandlers: sinon.stub()
		};

		ready = sinon.stub();
		jQuery = sinon.stub().returns( { ready } );

		startConnector = factory( {
			"jquery-slim": jQuery,
			"./common": common,
			"./common.ui": commonUI
		} );
	} );

	afterEach( () => {
		delete global.document;
	} );

	describe( "startConnector", () => {
		beforeEach( () => {
			startConnector( tableau, {
				title: "Extract title",
				id: "extract.title",
				path: "export/extract.json",
				cols: [
					{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: "DATATYPE" }
				]
			} );
		} );

		it( "should attach a ready handler", () => {
			ready.should.be.calledOnce
				.and.calledWithMatch( sinon.match.func );
		} );

		describe( "createConnector", () => {
			let connector;

			beforeEach( () => {
				ready.callArg( 0 );
				connector = tableau.registerConnector.lastCall.args[ 0 ];
			} );

			it( "should register the connector", () => {
				tableau.registerConnector.should.be.calledOnce
					.and.calledWithMatch( {
						_connector: true,
						getSchema: sinon.match.func,
						getData: sinon.match.func
					} );
			} );

			it( "should register event handlers", () => {
				commonUI.registerEventHandlers.should.be.calledOnce
					.and.calledWith( "Extract title" );
			} );

			describe( "getSchema", () => {
				let schemaCallback;

				beforeEach( () => {
					schemaCallback = sinon.stub();
					connector.getSchema( schemaCallback );
				} );

				it( "should call the callback with configuration", () => {
					schemaCallback.should.be.calledOnce
						.and.calledWith( [ {
							id: "extract.title",
							alias: "Extract title",
							columns: [
								{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: "DATATYPE" }
							]
						} ] );
				} );
			} );

			describe( "getData", () => {
				beforeEach( () => {
					connector.getData( "TABLE", "CALLBACK" );
				} );

				it( "should call transformTable", () => {
					common.tableTransform.should.be.calledOnce
						.and.calledWith( {
							tableau,
							tableauTable: "TABLE",
							cols: [
								{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: "DATATYPE" }
							]
						} );
				} );

				it( "should call getNextPage", () => {
					common.getNextPage.should.be.calledOnce
						.and.calledWith( {
							tableau,
							offset: 0,
							baseUrl: "URL",
							path: "export/extract.json",
							token: "TOKEN",
							limit: 500,
							boardIds: 0,
							table: "TRANSFORMED",
							doneCallback: "CALLBACK"
						} );
				} );
			} );
		} );
	} );
} );
