module.exports = {
	extends: [ "leankit", "leankit/es6" ],
	rules: {
		"no-unused-expressions": 2,
		"prefer-arrow-callback": 0,
		"init-declarations": 0,
		"no-new-func": 0
	},
	globals: {
		"tableau": true
	},
	parserOptions: {
		sourceType: "module"
	},
	overrides: [
		{
			files: [ "*.spec.js", "client/spec/**/*.js" ],
			extends: [ "leankit/test" ],
			globals: {
				sinon: true,
				should: true
			}
		}
	]
};
