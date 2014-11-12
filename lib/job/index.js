(function(stackoverflowJob) {
	var TimerJob = require('timer-jobs'),
	stackoverflowHelper = require('./stackoverflowHelper.js'),
	request = require('request');

	var stackoverflowHook = "http://localhost:6565/api/stackoverflow-questions/hook";

	var handItem = function (item) {
		request.post(stackoverflowHook,{"link":item['link'],"title":item['title']});
	}

	stackoverflowJob.start = function () {
		var timer = new TimerJob({interval: 5000}, function(done) {
			stackoverflowHelper.get(handItem);
		    done();
		});
		timer.start();
	}
})(module.exports);