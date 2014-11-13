(function(stackoverflowHelper){
	var stackexchange = require('stackexchange');
	var context;
	var that = this;
	stackoverflowHelper.init = function (options) {
		that.context = new stackexchange(options);
	}
	stackoverflowHelper.get = function (handler,filter) {
		if(!context) console.log("Context not initialized.") 
		context.questions.questions(filter, function (err, results) {
		    if (err) throw err;
		    handler(results);
		});
	}
})(module.exports)