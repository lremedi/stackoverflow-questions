(function(stackoverflowJob) {
	var TimerJob = require('timer-jobs'),
	stackoverflowHelper = require('stackoverflowHelper.js'),
	request = require('request');

	var stackoverflowHook = "/api/stackoverflowHook";

	var handler = function (chunk) {
		if(chunk.items){
			for (var i = chunk.items.length - 1; i >= 0; i--) {
				request.post(stackoverflowHook,{"link":chunk.items[i]['link'],"title":chunk.items[i]['title']});
			};
		}
	}

	stackoverflowJob.start = function () {
		var timer = new TimerJob({interval: 5000}, function(done) {
			stackoverflowHelper.get(handler);
		    done();
		});
		timer.start();
	}
})(module.exports);