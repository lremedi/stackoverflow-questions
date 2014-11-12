var request = require('request');

(function(stackoverflowHelper){
	var endpoint = "https://api.stackexchange.com/2.2/questions?order=desc&sort=activity&tagged=versionone&site=stackoverflow";
	stackoverflowHelper.get = function (handler) {
		request.get(endpoint, function(res) {
		  res.on("data",handler);
		}).on('error', function(e) {
		  console.log("Got error: " + e.message);
		});
	}
	
})(module.exports)