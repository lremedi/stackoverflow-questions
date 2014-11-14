(function(stackoverflowHelper) {
  var stackexchange = require('stackexchange');
  var context;
  var that = this;
  stackoverflowHelper.init = function(options) {
    that.context = new stackexchange(options);
  }
  stackoverflowHelper.get = function(filter, callback) {
    if (!that.context) console.log("Context not initialized.")
    that.context.questions.questions(filter, callback);
  }
})(module.exports)