'use strict'

var fs = require('fs');

var readJSONSync = function(filePath){
	var json = undefined;
	if(fs.existsSync(filePath))
	{
		var jsonStr = fs.readFileSync(filePath, { encoding: 'utf8' });
		if(jsonStr && jsonStr.length)
		{
			json = JSON.parse(jsonStr);
		}
	}
	return json;
}

var bower = readJSONSync('bower.json') || {};

function BuildInfoBrunch(brunchCfg)
{
	var cfg = brunchCfg || {};
	var config = cfg.plugins.timestamp || {};
	
	this.config = {
		
		// Do we want to target commonjs or window?
		target: config.target || 'commonjs',
		
		// The name space to add the info. Default is "{bower.name}/info".
		// Override with `config.plugins.timestamp.nameSpace`.
		// If no bower.json exists and there is no brunch config override then
		// 'info' will be used.
		nameSpace: (function(){
			if(config.nameSpace)
			{
				return config.nameSpace
			}
			else if(bower.name)
			{
				return bower.name + '/info';
			}
			else
			{
				return 'info';
			}
		})(),
		
		info: config.info
	};
}

var getInfo = function(){
	return {
		timestamp: (new Date()).getTime()
	}
};

BuildInfoBrunch.prototype.brunchPlugin = true;
BuildInfoBrunch.prototype.type = 'javascript';
BuildInfoBrunch.prototype.defaultEnv = '*';
BuildInfoBrunch.prototype.optimize = function(args, callback){
	var infoObj = getInfo();
	if(this.config.info)
	{
		infoObj = this.config.info(infoObj);
		if(!infoObj) throw new Error('info function did not return valid result');
	}
	var infoString = JSON.stringify(infoObj);
	
	var str = undefined;
	switch(this.config.target)
	{
		case 'commonjs':
			str = 'require.register("'+this.config.nameSpace+'", function(exports, require, module){module.exports='+infoString+'});'
			break;
		case 'window':
			str = '(function(){window["'+this.config.nameSpace+'"]='+infoString+'})()'
			break;
		default:
			console.log('unsupported target \''+this.config.target+'\'');
			break;
	}
	var result = args.data.concat(str);
	callback(null, result);
}

module.exports = BuildInfoBrunch;
