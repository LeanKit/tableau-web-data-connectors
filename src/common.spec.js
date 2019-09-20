import commonFactory from "inject-loader!./common";

describe( "common utilities", () => {
	let common, axios;

	const baseUrl = "https://calzone.leankit.com/io/reporting/";

	beforeEach( () => {
		axios = {
			get: sinon.stub(),
			post: sinon.stub()
		};
		common = commonFactory( {
			axios
		} );
	} );


	describe( "urlToAccountName", () => {
		context( "when the url is empty", () => {
			it( "should return null", () => {
				should.equal( null, common.urlToAccountName( "" ) );
			} );
		} );

		context( "when the url doesn't start with http", () => {
			it( "should return null", () => {
				should.equal( null, common.urlToAccountName( "calzone.leankit.com" ) );
			} );
		} );

		context( "when the url starts with a http protocol", () => {
			[
				[ "http://calzone.leankit.com", "calzone" ],
				[ "https://pizza.leankit.com", "pizza" ],
				[ "https://salad.leankit.com/io/reporting", "salad" ]
			].forEach( ( [ url, account ] ) => {
				it( `should return '${ account }' for the url '${ url }'`, () => {
					common.urlToAccountName( url ).should.equal( account );
				} );
			} );
		} );
	} );

	describe( "normalizeBaseUrl", () => {
		context( "when the url is empty", () => {
			it( "should return null", () => {
				should.equal( null, common.normalizeBaseUrl( "" ) );
			} );
		} );

		context( "when the url is local host", () => {
			describe( "when the url ends with a slash", () => {
				it( "should return it unchanged", () => {
					common.normalizeBaseUrl( "http://localhost/" )
						.should.equal( "http://localhost/" );
				} );
			} );

			describe( "when the url does not end with a slash", () => {
				it( "should add the final slash", () => {
					common.normalizeBaseUrl( "http://localhost" )
						.should.equal( "http://localhost/" );
				} );
			} );
		} );

		context( "when the url is not local host", () => {
			describe( "when the url starts with http", () => {
				it( "should properly format the url", () => {
					common.normalizeBaseUrl( "https://calzone.leankit.com" )
						.should.equal( "https://calzone.leankit.com/io/reporting/" );
				} );
			} );

			describe( "when the url does not include protocol", () => {
				it( "should properly format the url", () => {
					common.normalizeBaseUrl( "calzone.leankit.com/" )
						.should.equal( "https://calzone.leankit.com/io/reporting/" );
				} );
			} );
		} );
	} );

	describe( "getBoards", () => {
		let boards;

		describe( "when there are fewer than 1000 boards", () => {
			beforeEach( async () => {
				axios.get.resolves( {
					data: [
						{ boardId: "123" }
					]
				} );
				boards = await common.getBoards( {
					baseUrl,
					token: "$ECURE"
				} );
			} );

			it( "should only call get once", () => {
				axios.get.should.be.calledOnce
					.and.calledWith( `${ baseUrl }export/boards.json`, {
						params: {
							token: "$ECURE",
							offset: 0,
							limit: 1000
						}
					} );
			} );

			it( "should return the board", () => {
				boards.should.eql( [ { boardId: "123" } ] );
			} );
		} );

		describe( "when there are more than 1000 boards", () => {
			beforeEach( async () => {
				axios.get.onCall( 0 ).resolves( {
					data: Array( 1000 ).map( ( _itm, index ) => ( { boardId: ( index + 1 ).toString() } ) )
				} );
				axios.get.onCall( 1 ).resolves( {
					data: Array( 5 ).map( ( _itm, index ) => ( { boardId: ( index + 1001 ).toString() } ) )
				} );
				boards = await common.getBoards( {
					baseUrl,
					token: "$ECURE"
				} );
			} );

			it( "should only call get until all boards are loaded", () => {
				axios.get.should.be.calledTwice
					.and.calledWith( `${ baseUrl }export/boards.json`, {
						params: {
							token: "$ECURE",
							offset: 0,
							limit: 1000
						}
					} )
					.and.calledWith( `${ baseUrl }export/boards.json`, {
						params: {
							token: "$ECURE",
							offset: 1000,
							limit: 1000
						}
					} );
			} );

			it( "should return the boards", () => {
				boards.should.have.lengthOf( 1005 );
			} );
		} );
	} );

	describe( "getToken", () => {
		let token;

		beforeEach( async () => {
			axios.post.resolves( {
				data: {
					token: "$ECURE"
				}
			} );

			token = await common.getToken( {
				baseUrl,
				account: "calzone",
				username: "john@example.com",
				password: "pass"
			} );
		} );

		it( "should pass through email, password, and account", () => {
			axios.post.should.be.calledOnce
				.and.calledWith(
					"https://calzone.leankit.com/io/reporting/auth",
					{
						email: "john@example.com",
						password: "pass",
						accountName: "calzone"
					}
				);
		} );

		it( "should return the token", () => {
			token.should.equal( "$ECURE" );
		} );
	} );

	describe( "getNextPage", () => {
		let tableau, table, offset, path, token, limit, boardIds, doneCallback;
		beforeEach( () => {
			path = "/somePath";
			token = "TOKEN";
			boardIds = [ "b1", "b2" ];
			limit = 5;
			offset = 0;
			doneCallback = sinon.stub();
			tableau = {
				log: sinon.stub(),
				abortWithError: sinon.stub()
			};
			table = {
				appendRows: sinon.stub()
			};
		} );

		describe( "when no data is returned", () => {
			beforeEach( async () => {
				axios.get.resolves( {} );
				await common.getNextPage( {
					tableau,
					offset: 1,
					baseUrl,
					path,
					token,
					limit,
					boardIds,
					table,
					doneCallback
				} );
			} );

			it( "should only make one request", () => {
				axios.get.should.be.calledOnce();
			} );

			it( "should call done", () => {
				doneCallback.should.be.calledOnce();
			} );
		} );

		describe( "when no data is returned and the offset is zero", () => {
			beforeEach( () => {
				axios.get.resolves( {} );
				return common.getNextPage( {
					tableau,
					offset,
					baseUrl,
					path,
					token,
					limit,
					boardIds,
					table,
					doneCallback
				} );
			} );

			it( "should only make one request", () => {
				axios.get.should.be.calledOnce();
			} );

			it( "should abort with error", () => {
				tableau.abortWithError.should.be.calledOnce()
					.and.calledWith( "No data was returned." );
			} );
		} );

		describe( "when there is an error", () => {
			beforeEach( () => {
				axios.get.rejects( new Error( "NOPE" ) );
				return common.getNextPage( {
					tableau,
					offset,
					baseUrl,
					path,
					token,
					limit,
					boardIds,
					table,
					doneCallback
				} );
			} );

			it( "should log the rror", () => {
				tableau.log.should.be.calledOnce()
					.and.calledWith( "There was an error fetching data Error: NOPE" );
			} );

			it( "should abort with error", () => {
				tableau.abortWithError.should.be.calledOnce()
					.and.calledWith( "Sorry, there was an error retrieving data." );
			} );
		} );

		describe( "when data is returned", () => {
			beforeEach( async () => {
				axios.get.onFirstCall().resolves( { data: [ "r1", "r2" ] } );
				axios.get.onSecondCall().resolves( { data: [ "r3" ] } );
				await common.getNextPage( {
					tableau,
					offset,
					baseUrl,
					path,
					token,
					limit: 2,
					boardIds,
					table,
					doneCallback
				} );
			} );

			it( "should only make one request", () => {
				axios.get.should.be.calledTwice()
					.and.be.calledWith( "https://calzone.leankit.com/io/reporting//somePath?token=TOKEN&limit=2&offset=0&boardId=b1,b2" )
					.and.be.calledWith( "https://calzone.leankit.com/io/reporting//somePath?token=TOKEN&limit=2&offset=2&boardId=b1,b2" );
			} );

			it( "should call done", () => {
				doneCallback.should.be.calledOnce();
			} );
		} );
	} );

	describe( "tableTransform", () => {
		let tableau, tableauTable;
		beforeEach( () => {
			tableau = {
				dataTypeEnum: {
					datetime: "DATETIME"
				}
			};
			tableauTable = {
				appendRows: sinon.stub()
			};
			const { appendRows } = common.tableTransform( {
				tableau,
				tableauTable,
				cols: [
					{ id: "cardId", alias: "Card ID", columnRole: "dimension", dataType: "STRING" },
					{ id: "whenItHappenedWas", alias: "When It Happened Was", columnRole: "dimension", dataType: "DATETIME" }
				]
			} );

			appendRows( [
				{ cardId: "c1234", whenItHappenedWas: "2019-04-15 19:05:14.9070000" },
				{ cardId: "c456" }
			] );
		} );

		it( "should transform the date before adding it to the table", () => {
			tableauTable.appendRows.should.be.calledOnce()
				.and.calledWith( [
					{ cardId: "c1234", whenItHappenedWas: "2019-04-15 19:05:14Z" },
					{ cardId: "c456" }
				] );
		} );
	} );
} );
