(function(stackoverflowHelper){
	var request = require('request');
	var zlib = require('zlib');
	var endpoint = "https://api.stackexchange.com/2.2/questions?order=desc&sort=activity&tagged=versionone&site=stackoverflow";
	function parseBody (buffer, callback) {
		zlib.unzip(buffer, function Unzipped (error, body) {
			try {
				if(!error){
					callback(error);
				}
				else{
					callback(JSON.parse(body.toString()));
				}
			} catch (error) {
				callback(error);
			}
		});
	}
	var options = { url: endpoint, encoding: null };


	stackoverflowHelper.get = function (handler) {
		request.get(options, function(error, response, body) {
			parseBody(body,console.log)
			/*var chunk = JSON.parse(body);
			if(chunk.items){
				for (var i = chunk.items.length - 1; i >= 0; i--) {
					handler(chunk.items[i]);
				}
			}*/
		});
	}
	
})(module.exports)