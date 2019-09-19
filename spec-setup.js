require( "@babel/polyfill" );
const chai = require( "chai" );

global.sinon = require( "sinon" );

chai.use( require( "dirty-chai" ) );
chai.use( require( "sinon-chai" ) );

global.should = chai.should();
