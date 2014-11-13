(function(stackoverflowJob) {
	var TimerJob = require('timer-jobs'),
	stackoverflowHelper = require('./stackoverflowHelper.js'),
	request = require('request');
	var endpoints;
	var fromDate;
	var that = this;
	var handleResults = function (results) {
		results.items.forEach(function(item){
			request.post(that.endpoints.stackoverflowHook,{"link":item['link'],"title":item['title']});
		});
	}
	var getStatus = function(){
		request.get(that.endpoints.stackoverflowStatus,function (err,request,response) {
			if(err) throw err;
			that.fromDate = request.status.fromDate;
		});
	}
	stackoverflowJob.init = function (endpoints) {
		that.endpoints = endpoints;
	}
	stackoverflowJob.start = function (filter) {
		stackoverflowHelper.init();
		var timer = new TimerJob({interval: 5000}, function(done) {
			stackoverflowHelper.get(handItem,filter);
		    done();
		});
		timer.start();
	}
})(module.exports);