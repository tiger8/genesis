var fs = require('fs');
var path = require('path');
var wrench = require('wrench');
//var xmldom = require('xmldom');

var pkg = require('../package');
var NAME = pkg.name;
var VERSION = pkg.version;

var GENESIS_COMMONJS_VERSION = '0.1.0';
var GENESIS_TIGER8_VERSION = '0.1.0';

var root = find(process.cwd());
var appDir = path.join(root, 'app');

var alloyjmk_src = path.join(__dirname, '..', 'lib', 'alloy.jmk');
var alloyjmk_dst = path.join(appDir, 'alloy.jmk');

var config_src = path.join(__dirname, '..', 'lib', 'genesis.json');
var config_dst = path.join(root, 'genesis.json');

// install alloy.jmk
if (fs.existsSync(appDir)) {
	if (!fs.existsSync(alloyjmk_dst)) {
        fs.writeFileSync(alloyjmk_dst, fs.readFileSync(alloyjmk_src));
	}
}

// install genesis.json
if (fs.existsSync(appDir)) {
    if (!fs.existsSync(config_dst)) {
        fs.writeFileSync(config_dst, fs.readFileSync(config_src));
	}
}

console.log('********************* STARTING GENESIS-COMMONJS INSTALL ***************************');
var exec = require('child_process').exec;

exec(
    'npm install genesis-commonjs@>=' + GENESIS_COMMONJS_VERSION + ' --save',
    {
    cwd: path.join('..', appDir)
},
    function (error, stdout, stderr) {
    console.error(error);
    console.log(stdout);
    console.error(stderr);
}
);

console.log('********************* FINISHED GENESIS-COMMONJS INSTALL ***************************');

console.log('********************* STARTING GENESIS-TIGER8 INSTALL ***************************');
var exec = require('child_process').exec;

exec(
    'npm install genesis-tiger8@>=' + GENESIS_TIGER8_VERSION + ' --save',
    {
    cwd: path.join('..', appDir)
},
    function (error, stdout, stderr) {
    console.error(error);
    console.log(stdout);
    console.error(stderr);
}
);

console.log('********************* FINISHED GENESIS-TIGER8 INSTALL ***************************');


// Traverse the directory structure up and 
// returns the first directory that contains tiapp.xml
// https://github.com/tonylukasavage/tiapp.xml
function find(dir) {
	var cwd = dir || process.cwd(),
		parts = cwd.split(path.sep);

	// remove empty element
	if (parts[0] === '') {
		parts.shift();
	}

	for (var i = 0, len = parts.length; i < len; i++) {
		var p = (/^win/.test(process.platform) ? '' : path.sep) +
			path.join.apply(path, parts.slice(0, len - i).concat('tiapp.xml'));
		if (fs.existsSync(p) && fs.statSync(p).isFile()) {
			return path.dirname(p);
		}
	}

	return null;
};