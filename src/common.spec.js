import commonFactory from "inject-loader!./common";

describe( "common utilities", () => {
	let common, axios;

	const baseUrl = "https://calzone.leankit.com/io/reporting/";

	beforeEach( () => {
		axios = {
			get: sinon.stub(),
			post: sinon.stub()
		};
		common = commonFactory( { axios } );
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
} );
