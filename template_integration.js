function checkGestureMap (gestureMap) {
  if (gestureMap && typeof gestureMap === 'object' && Object.keys(gestureMap).length > 0) {
    return _.every(Object.keys(gestureMap), function (actionString) {
      return !!extractAction(actionString) && typeof gestureMap[actionString] === 'function';
    });
  } else {
    return false;
  }
}
function extractAction (actionString) {
  var pieces = actionString.split(' ');
  if (pieces.length > 1) {
    return {
      gestureName: pieces[0],
      elementSelector: pieces.slice(1, pieces.length).join(' ')
    };
  } else {
    return false;
  }
}
function setupTemplateGestures () {
  var templateInstance = this,
      template = templateInstance.view.template;

  if (checkGestureMap(template._gestures)) {
    _.each(template._gestures, function (handler, actionString) {
      var action = extractAction(actionString);
      templateInstance.$(action.elementSelector).hammer(template._hammerOptions).bind(action.gestureName, _.bind(handler, templateInstance));
    });
  }
}
Template.prototype.hammerOptions = function (hammerOptions) {
  this._hammerOptions = hammerOptions;
}
Template.prototype.gestures = function (gestureMap) {
  if (checkGestureMap(gestureMap)) {
    this._gestures = gestureMap;
  }
}
Meteor.startup(function () {
  Template.onRendered(setupTemplateGestures);
});
