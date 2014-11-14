var callback = function(state, event) {
  if (state.lastquestion == null) {
    return {
      lastquestion: 0
    }
  }
  state.lastquestion = event.data.creation_date;
}
fromStream("stackoverflowquestions")
  .whenAny(callback);