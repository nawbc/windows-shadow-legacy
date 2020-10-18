const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
	console.log = function () { };
	console.warn = function () { };
	console.info = function () { };
	// eslint-disable-next-line no-console
	console.debug = function () { };
}