
var nodePathDelimiter = require('os').platform().indexOf('win') === 0 ? ';' : ':';
process.env.NODE_PATH = __dirname + '..' + nodePathDelimiter + './node_modules';
require('module').Module._initPaths();

var genesis = function() {};
module.exports = genesis;
genesis.alloy = function() {};

var path = require('path');
var config = {};

genesis.alloy.preLoad = function (alloyConfig, alloyLogger) {

	config = require(path.join(alloyConfig.dir.project, 'genesis.json'));

	if (config.autoUpdate === true) {

		alloyLogger.trace('********************* STARTING NPM UPDATE ***************************');
		require('shelljs/global');

		var run = exec('npm update', { timeout: 10000 });
		alloyLogger.info('Exit code:' + run.code);
		alloyLogger.info('Program output:' + run.output);
		alloyLogger.info('Directory:' + process.cwd());
		alloyLogger.info(JSON.stringify(run));

		alloyLogger.trace('********************* FINISHED NPM UPDATE ***************************');

	}

	var tasks = config.tasks.preLoad || [];
	alloyLogger.trace('********************* Executing pre:load tasks: ' + tasks + ' ***************************');
	tasks.forEach(function(element, index, list) {
		alloyLogger.trace('********************* Executing pre:load task: ' + element + ' ***************************');
        var task = require(element);
		if (task && typeof task.preCompile == 'function') {
			task.preLoad(alloyConfig, alloyLogger, config);
		};
	});

};

genesis.alloy.preCompile = function(alloyConfig, alloyLogger) {

	var tasks = config.tasks.preCompile || [];
	alloyLogger.trace('********************* Executing pre:compile tasks: ' + tasks + ' ***************************');
	tasks.forEach(function(element, index, list) {
		alloyLogger.trace('********************* Executing pre:compile task: ' + element + ' ***************************');
        var task = require(element);
        if (task && typeof task.preCompile == 'function') {
	        task.preCompile(alloyConfig, alloyLogger, config);
        };
	});
};


genesis.alloy.postCompile = function(alloyConfig, alloyLogger) {

	var tasks = config.tasks.postCompile || [];
	alloyLogger.trace('********************* Executing post:compile tasks: ' + tasks + ' ***************************');
	tasks.forEach(function(element, index, list) {
		alloyLogger.trace('********************* Executing post:compile task: ' + element + ' ***************************');
        var task = require(element);
		if (task && typeof task.postCompile == 'function') {
			task.postCompile(alloyConfig, alloyLogger, config);
		};
	});
};
